package com.isamrs.tim14.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.model.Grade;
import com.isamrs.tim14.model.HotelAdmin;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.Room;
import com.isamrs.tim14.model.RoomReservation;
import com.isamrs.tim14.repository.IGradeRepository;
import com.isamrs.tim14.repository.IRoomRepository;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class RoomService {

	@Autowired
	private IRoomRepository roomRepository;
	
	@Autowired
	private IGradeRepository gradeRepository;
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public Room save(Room room) {
		HotelAdmin admin = (HotelAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if(roomRepository.findRoomByHotelIdAndRoomNumber(admin.getHotel().getId(), room.getRoomNumber())!= null) {
			return null;
		}
		room.setId(null);
		room.setHotel(admin.getHotel());
		roomRepository.save(room);
		return room;
	}
	
	public List<Room> getRoomsSearch(Integer hotelID, Long arriveDateTS, Long departureDateTS, Boolean twoBeds, Boolean threeBeds, Boolean fourBeds){
		
		int bed2 = (twoBeds) ? 2 : -2;
		int bed3 = (threeBeds) ? 3 : -3;
		int bed4 = (fourBeds) ? 4 : -4;
		
		List<Room> resultQuery = roomRepository.findRoomsByBedNumbers(hotelID, bed2, bed3, bed4);
		List<Room> result = new ArrayList<Room>();
		boolean check = true;
		Date arrivalDate = new Date(arriveDateTS);
		Date departureDate =  new Date(departureDateTS);
		for(Room selectedRoom : resultQuery) {
			check = true;
			for(RoomReservation reservation : selectedRoom.getReservations()) {
				if(!reservation.getEnd().before(arrivalDate) && !reservation.getStart().after(departureDate)) {
					check = false;
				}
			}
			if(check) {
				result.add(selectedRoom);
			}
		}
		
		return result;
	}
	
	public List<Room> getUnreservedRooms() {
		HotelAdmin admin = (HotelAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		List<Room> unreservedRooms = new ArrayList<Room>();
		List<Room> reservedRooms = new ArrayList<Room>();
		for(RoomReservation res : admin.getHotel().getReservations()) {
			if(res.getEnd().getTime() + 24*60*60*1000 > new Date().getTime()) {
				for(Room room : res.getRooms()) {
					reservedRooms.add(room);
				}
			}
		}
		boolean check = true;
		for(Room room : admin.getHotel().getRooms()) {
			check = true;
			for(Room resRoom : reservedRooms) {
				if(resRoom.getId() == room.getId()) {
					check = false;
					break;
				}
			}
			if(check) {
				unreservedRooms.add(room);
			}
		}
		return unreservedRooms;
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false) 
	public void removeRoom(Integer id) {
		Room managedRoom = roomRepository.findOneById(id);
		roomRepository.delete(managedRoom);
	}
	
	public List<Room> getAllRoomsSearch(String hotelName, String destination, Long start, Long end, boolean twoBeds, boolean threeBeds,
			boolean fourBeds, Double minPrice, Double maxPrice){
		
		int bed2 = (twoBeds) ? 2 : -2;
		int bed3 = (threeBeds) ? 3 : -3;
		int bed4 = (fourBeds) ? 4 : -4;
		
		List<Room> resultQuery = roomRepository.findRoomsByBedNumbersAndPrice(bed2, bed3, bed4, minPrice, maxPrice);
		List<Room> result = new ArrayList<Room>();
		destination = (destination.equals("NO_INPUT")) ? "" : destination;
		hotelName = (hotelName.equals("NO_INPUT")) ? "" : hotelName;
		boolean check = true;
		
		Date arrivalDate = new Date(start);
		Date departureDate =  new Date(end);
		
		for(Room selectedRoom : resultQuery) {
			check = true;
			if(!selectedRoom.getHotel().getDestination().getName().toLowerCase().contains(destination.toLowerCase())) {
				continue;
			}
			if(!selectedRoom.getHotel().getName().toLowerCase().contains(hotelName.toLowerCase())) {
				continue;
			}
			for(RoomReservation reservation : selectedRoom.getReservations()) {
				if(!reservation.getEnd().before(arrivalDate) && !reservation.getStart().after(departureDate)) {
					check = false;
				}
			}
			if(check) {
				result.add(selectedRoom);
			}
		}
		return result;
	}
	
	public Room getRoom(Integer id) {
		return roomRepository.findOneById(id);
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false) 
	public Room changeRoom(Room room) {
		if(room.getFloor() == -1 && roomRepository.findRoomByHotelIdAndRoomNumber(room.getHotel().getId(), room.getRoomNumber()) != null) {
			return null;
		}
		Room managedRoom = roomRepository.findOneById(room.getId());
		managedRoom.setRoomNumber(room.getRoomNumber());
		managedRoom.setBedNumber(room.getBedNumber());
		managedRoom.setPrice(room.getPrice());
		return managedRoom;
	}
	
	public Integer getGrade(Integer id) {
		Room room = roomRepository.findOneById(id);
		RegisteredUser ru =(RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		for(Grade g : room.getGrades()) {
			if(g.getUser().getEmail().equals(ru.getEmail())) {
				return g.getGrade();
			}
		}
		return 0;
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false) 
	public void setGrade(Integer id, Integer grade) {
		Room room = roomRepository.findOneById(id);
		RegisteredUser ru =(RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		for(Grade g : room.getGrades()) {
			if(g.getUser().getEmail().equals(ru.getEmail())) {
				g.setGrade(grade);
				return;
			}
		}
		
		Grade g = new Grade();
		g.setId(null);
		g.setGrade(grade);
		g.setUser(ru);
		gradeRepository.save(g);
		room.getGrades().add(g);	
	}
	
	public Collection<Room> getAllHotelRooms() {
		HotelAdmin admin = (HotelAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return admin.getHotel().getRooms();
	}
	
	
	public Integer getIntermediateGrade(Integer id) {
		Room room = roomRepository.findOneById(id);
		int sum = 0;
		int count = 0;
		
		for(Grade g : room.getGrades()) {
			sum+= g.getGrade();
			count++;
		}
		
		if(count==0) {
			return 0;
		}else {
			return sum/count;
		}
	}
	
}
