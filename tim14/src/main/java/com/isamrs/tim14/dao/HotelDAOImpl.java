package com.isamrs.tim14.dao;

import java.util.ArrayList;
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
		return result;
	}

	@Override	
	@Transactional
	public Hotel changeHotel(Hotel hotel) {
		Hotel managedHotel = entityManager.find(Hotel.class, hotel.getId());
		
		Query query = entityManager.createQuery("SELECT h FROM Hotel h WHERE h.name = :hotelName");
		query.setParameter("hotelName", hotel.getName());
		List<Room> resultQuery = query.getResultList();
		if(resultQuery.size()!=0) {
			return null;
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

}
