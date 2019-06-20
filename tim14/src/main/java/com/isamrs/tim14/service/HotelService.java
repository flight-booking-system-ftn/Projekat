package com.isamrs.tim14.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.OptimisticLockException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.model.Destination;
import com.isamrs.tim14.model.Grade;
import com.isamrs.tim14.model.Hotel;
import com.isamrs.tim14.model.HotelAdmin;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.Room;
import com.isamrs.tim14.model.RoomReservation;
import com.isamrs.tim14.repository.IDestinationRepository;
import com.isamrs.tim14.repository.IGradeRepository;
import com.isamrs.tim14.repository.IHotelRepository;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class HotelService {

	@Autowired
	private IHotelRepository hotelRepository;
	
	@Autowired
	private IGradeRepository gradeRepository;
	
	@Autowired
	private IDestinationRepository destinationRepository;
	
	public List<Hotel> getHotels() {
		return hotelRepository.findAll();
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public Hotel save(Hotel hotel) {
		if(hotelRepository.findOneByName(hotel.getName()) != null) {
			return null;
		}
		hotel.setId(null);
		hotelRepository.save(hotel);
		return hotel;
	}
	
	public Hotel getHotel(int id) {
		return hotelRepository.getHotelById(id);
	}
	
	public List<Hotel> getHotelsSearch(String hotelName, String hotelDestination, long checkIn, long checkOut){
		
		hotelName = (hotelName.equals("NO_INPUT")) ? "" : hotelName;
		hotelDestination = (hotelDestination.equals("NO_INPUT")) ? "" : hotelDestination;
		
		List<Hotel> result = hotelRepository.findHotelByNameContain(hotelName);
		List<Hotel> myResult = new ArrayList<Hotel>();
		for(int i=0;i<result.size();i++) {
			if(result.get(i).getDestination().getName().toLowerCase().contains(hotelDestination.toLowerCase())) {
				myResult.add(result.get(i));
			}
		}
		result = myResult;

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
						if(reservation.getRegisteredUser() != null) {
							check = false;
						}
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
	
	@Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = false, rollbackFor = OptimisticLockException.class)
	public Hotel changeHotel(Hotel hotel) {
		Hotel managedHotel = hotelRepository.findOneById(hotel.getId());
		
		if(hotel.getExtraServiceDiscount().intValue() == -1) {
			if(hotelRepository.findOneByName(hotel.getName()) != null) {
				try {
					Thread.sleep(2000);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
				return null;
			}
		}
		
		Destination managedDestination = destinationRepository.findOneById(hotel.getDestination().getId());
		managedDestination.setAddress(hotel.getDestination().getAddress());
		managedHotel.setDescription(hotel.getDescription());
		managedHotel.setName(hotel.getName());
		
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		return managedHotel;
	}
	
	public Integer getGrade(Integer id) {
		RegisteredUser ru =(RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Hotel hotel = hotelRepository.getHotelById(id);
		
		for(Grade g : hotel.getGrades()) {
			if(g.getUser().getEmail().equals(ru.getEmail())) {
				return g.getGrade();
			}
		}
		
		return 0;
	}
	
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public void setGrade(Integer id, Integer grade) {
		Hotel hotel = hotelRepository.getHotelById(id);
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
		gradeRepository.save(g);
		hotel.getGrades().add(g);
	}
	
	public List<Hotel> getHotelsFromReservations() {
		ArrayList<Hotel> all = new ArrayList<Hotel>();
		RegisteredUser u = ((RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
		
		for (RoomReservation rr : u.getRoomReservations()) {
			if (!(all.contains(rr.getHotel()))) {
				all.add(rr.getHotel());
			}
		}
		
		return all;
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public Hotel setDiscount(int discount) {
		HotelAdmin admin =(HotelAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Hotel managedHotel = hotelRepository.getHotelById(admin.getHotel().getId());
		managedHotel.setExtraServiceDiscount(discount);
		return managedHotel;
	}
	
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
