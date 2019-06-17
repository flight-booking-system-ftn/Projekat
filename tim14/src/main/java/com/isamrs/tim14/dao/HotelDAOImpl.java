package com.isamrs.tim14.dao;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.Grade;
import com.isamrs.tim14.model.Hotel;
import com.isamrs.tim14.model.HotelAdmin;
import com.isamrs.tim14.model.HotelService;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.RentACar;
import com.isamrs.tim14.model.Room;
import com.isamrs.tim14.model.RoomReservation;
import com.isamrs.tim14.model.VehicleReservation;

@Repository
public class HotelDAOImpl implements HotelDAO {

	private EntityManager entityManager;

	@Autowired
	public HotelDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	@Override
	@Transactional
	public List<Hotel> getHotels() {
		Query query = entityManager.createQuery("SELECT hot FROM Hotel hot");
		List<Hotel> result = query.getResultList();
		return result;
	}

	@Override
	@Transactional
	public Hotel save(Hotel hotel) {
		Query query = entityManager.createQuery("SELECT h FROM Hotel h WHERE lower(h.name) LIKE :hotelName");
		query.setParameter("hotelName", hotel.getName());
		List<Hotel> result = query.getResultList();
		if (result.size() == 0) {
			for(HotelService hs : hotel.getServices()) {
				hs.setHotel(hotel);
			}
			entityManager.persist(hotel);
			return hotel;
		} else {
			return null;
		}
	}

	@Override
	@Transactional
	public Hotel getHotel(int id) {
		Query query = entityManager.createQuery("SELECT hot FROM Hotel hot WHERE hot.id = :hotelId");
		query.setParameter("hotelId", id);
		List<Hotel> result = query.getResultList();

		if (result.size() == 0) {
			return null;
		}

		return result.get(0);
	}

	@Override
	@Transactional
	public void deleteHotel(int id) {

	}

	@Override
	@Transactional
	public List<Hotel> getHotelsSearch(String hotelName, String hotelDestination, long checkIn, long checkOut) {
		
		if(hotelName.equals("NO_INPUT")) {
			hotelName = "";
		}
		if(hotelDestination.equals("NO_INPUT")) {
			hotelDestination = "";
		}
		Query query = entityManager.createQuery("SELECT hot FROM Hotel hot WHERE hot.name LIKE :hotelName AND hot.destination.name LIKE :hotelDestination");
		query.setParameter("hotelName", "%" + hotelName + "%");
		query.setParameter("hotelDestination", "%" + hotelDestination + "%");
		List<Hotel> result = query.getResultList();
		List<Hotel> fullResult = new ArrayList<Hotel>();
		List<Room> rooms = new ArrayList<Room>();
		
		boolean check = true;
		Date arrivalDate = new Date(checkIn);
		Date departureDate =  new Date(checkOut);
		
		for(Hotel hotel : result) {
			rooms.clear();
			for(Room room : hotel.getRooms()) {
				check = true;
				for(RoomReservation reservation : room.getReservations()) {
					if(!reservation.getEnd().before(arrivalDate) && !reservation.getStart().after(departureDate)) {
						check = false;
					}
				}
				if(check) {
					rooms.add(room);
					break;
				}
			}
			if(!rooms.isEmpty()) {
				fullResult.add(hotel);
			}
		}
		
		return fullResult;
	}

	@Override	
	@Transactional
	public Hotel changeHotel(Hotel hotel) {
		Hotel managedHotel = entityManager.find(Hotel.class, hotel.getId());
		
		if(hotel.getExtraServiceDiscount().intValue() == -1) {
			Query query = entityManager.createQuery("SELECT h FROM Hotel h WHERE h.name = :hotelName");
			query.setParameter("hotelName", hotel.getName());
			List<Room> resultQuery = query.getResultList();
			if(resultQuery.size()!=0) {
				return null;
			}
		}
		
		managedHotel.setDescription(hotel.getDescription());
		managedHotel.getDestination().setAddress(hotel.getDestination().getAddress());
		managedHotel.setName(hotel.getName());
		return managedHotel;
		
	}
	
	@Override
	@Transactional
	public Integer getGrade(Integer id) {
		Hotel hotel = entityManager.find(Hotel.class, id);
		RegisteredUser ru =(RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		for(Grade g : hotel.getGrades()) {
			System.out.println(g.getUser().getEmail());
			System.out.println("****"+ru.getEmail());
			if(g.getUser().getEmail().equals(ru.getEmail())) {
				return g.getGrade();
			}
		}
		return 0;
	}

	@Override
	@Transactional
	public void setGrade(Integer id, Integer grade) {
		Hotel hotel = entityManager.find(Hotel.class, id);
		RegisteredUser ru =(RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		for(Grade g : hotel.getGrades()) {
			if(g.getUser().getEmail().equals(ru.getEmail())) {
				g.setGrade(grade);
				return;
				}
		}
		Grade g = new Grade();
		g.setGrade(grade);
		g.setUser(ru);
		entityManager.persist(g);
		hotel.getGrades().add(g);
	}
	
	@Override
	@Transactional
	public List<Hotel> getHotelsFromReservations() {
		ArrayList<Hotel> all = new ArrayList<Hotel>();
		RegisteredUser u = ((RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
		for (RoomReservation rr : u.getRoomReservations()) {
				if (!(all.contains(rr.getHotel())))
					all.add(rr.getHotel());
				}
			//}
		return all;
	}

	@Override
	@Transactional
	public Hotel setDiscount(int discount) {
		HotelAdmin admin =(HotelAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Hotel managedHotel = entityManager.find(Hotel.class, admin.getHotel().getId());
		managedHotel.setExtraServiceDiscount(discount);
		return managedHotel;
	}

	@Override
	@Transactional
	public Integer getGradeHotel() {
		HotelAdmin admin = (HotelAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		int sum = 0;
		int count = 0;
		for(Grade g : admin.getHotel().getGrades()) {
			sum+=g.getGrade();
			count++;
		}
		if(count == 0) {
			return 0;
		}
		return sum/count;
	}

	@Override
	@Transactional
	public double getIncome(Date start, Date end) {
		HotelAdmin admin = (HotelAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		double sum = 0;
		for(Room room : admin.getHotel().getRooms()) {
			for(RoomReservation rr : room.getReservations()) {
				if(rr.getStart().before(end) && rr.getStart().after(start)) {
					sum += rr.getPrice() - rr.getPrice()*rr.getDiscount()/100;
				}
			}
		}
		
		return sum;
	}
	
	

}
