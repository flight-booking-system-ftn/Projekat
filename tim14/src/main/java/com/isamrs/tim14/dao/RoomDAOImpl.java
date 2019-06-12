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
import com.isamrs.tim14.model.HotelAdmin;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.Room;
import com.isamrs.tim14.model.RoomReservation;
import com.isamrs.tim14.model.Vehicle;

@Repository
public class RoomDAOImpl implements RoomDAO {

	private EntityManager entityManager;

	@Autowired
	public RoomDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	@Override
	@Transactional
	public Room save(Room room) {
		HotelAdmin admin = (HotelAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		room.setHotel(admin.getHotel());
		boolean check = true;
		for(Room r : admin.getHotel().getRooms()) {
			if(r.getRoomNumber() == room.getRoomNumber()) {
				check = false;
				break;
			}
		}
		if(check) {
			entityManager.persist(room);
			return room;
		}
		
		return null;
	}

	@Override
	@Transactional
	public List<Room> getRoomsSearch(Integer hotelID, Long arriveDateTS, Long departureDateTS, Boolean twoBeds, Boolean threeBeds, Boolean fourBeds) {
		String queryPlus = " AND 1=2 ";
		boolean check = false;
		if(twoBeds || threeBeds || fourBeds) {
			queryPlus = " AND (";
			if(twoBeds) {
				queryPlus += " r.bedNumber = 2 ";
				check = true;
			}
			if(threeBeds && !check) {
				queryPlus += " r.bedNumber = 3 ";
				check = true;
			}else if(threeBeds) {
				queryPlus += " OR r.bedNumber = 3 ";
			}
			
			if(fourBeds && !check) {
				queryPlus += " r.bedNumber = 4 ";
			}else if(fourBeds){
				queryPlus += " OR r.bedNumber = 4 ";
			}
			queryPlus += ")";
		}
		Query query = entityManager.createQuery("SELECT r FROM Room r WHERE r.hotel.id = :hotelId" + queryPlus);
		query.setParameter("hotelId", hotelID);
		List<Room> resultQuery = query.getResultList();
		List<Room> result = new ArrayList<Room>();
		check = true;
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

	@Override
	@Transactional
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

	@Override
	@Transactional
	public void removeRoom(Integer id) {
		Room managedRoom = entityManager.find(Room.class, id);
		entityManager.remove(managedRoom);
	}

	
	@Override
	@Transactional
	public List<Room> getAllRoomsSearch(String hotelName, String destination, Long start, Long end, boolean twoBeds, boolean threeBeds,
			boolean fourBeds, Double minPrice, Double maxPrice) {
		String queryPlus = " 1=2 ";
		boolean check = false;
		if(twoBeds || threeBeds || fourBeds) {
			queryPlus = " (";
			if(twoBeds) {
				queryPlus += " r.bedNumber = 2 ";
				check = true;
			}
			if(threeBeds && !check) {
				queryPlus += " r.bedNumber = 3 ";
				check = true;
			}else if(threeBeds) {
				queryPlus += " OR r.bedNumber = 3 ";
			}
			
			if(fourBeds && !check) {
				queryPlus += " r.bedNumber = 4 ";
			}else if(fourBeds){
				queryPlus += " OR r.bedNumber = 4 ";
			}
			queryPlus += ")";
		}
		Query query = entityManager.createQuery("SELECT r FROM Room r WHERE " + queryPlus + " and r.price between :minPrice and :maxPrice");
		query.setParameter("minPrice", minPrice);
		query.setParameter("maxPrice", maxPrice);
		List<Room> resultQuery = query.getResultList();
		
		List<Room> result = new ArrayList<Room>();
		destination = (destination.equals("NO_INPUT")) ? "" : destination;
		hotelName = (hotelName.equals("NO_INPUT")) ? "" : hotelName;
		check = true;
		
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

	@Override
	@Transactional
	public Room getRoom(Integer id) {
		Room room = entityManager.find(Room.class, id);
		return room;
	}

	@Override
	@Transactional
	public Room changeRoom(Room room) {
		Room managedRoom = entityManager.find(Room.class, room.getId());
		Query query = entityManager.createQuery("SELECT r FROM Room r WHERE r.roomNumber = :roomNumber and r.hotel.id = :hotelID");
		query.setParameter("roomNumber", room.getRoomNumber());
		query.setParameter("hotelID", room.getHotel().getId());
		List<Room> resultQuery = query.getResultList();
		if(resultQuery.size()==0) {
			managedRoom.setRoomNumber(room.getRoomNumber());
			managedRoom.setBedNumber(room.getBedNumber());
			managedRoom.setPrice(room.getPrice());
			return managedRoom;
		}
		
		return null;
	}
	
	@Override
	@Transactional
	public Integer getGrade(Integer id) {
		Room room = entityManager.find(Room.class, id);
		RegisteredUser ru =(RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		for(Grade g : room.getGrades()) {
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
		Room room = entityManager.find(Room.class, id);
		RegisteredUser ru =(RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		for(Grade g : room.getGrades()) {
			if(g.getUser().getEmail().equals(ru.getEmail())) {
				g.setGrade(grade);
				entityManager.persist(g);
				return;
				}
		}
		Grade g = new Grade();
		g.setGrade(grade);
		g.setUser(ru);
		room.getGrades().add(g);
		entityManager.persist(g);	
	}

}
