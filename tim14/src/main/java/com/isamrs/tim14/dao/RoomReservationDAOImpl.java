package com.isamrs.tim14.dao;

import java.util.HashSet;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.Hotel;
import com.isamrs.tim14.model.HotelAdmin;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.Room;
import com.isamrs.tim14.model.RoomReservation;
import com.isamrs.tim14.model.User;

@Repository
public class RoomReservationDAOImpl implements RoomReservationDAO {

	private EntityManager entityManager;

	@Autowired
	public RoomReservationDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
	
	@Override
	@Transactional
	public RoomReservation save(RoomReservation roomReservation) {
		if(roomReservation.getHotel().getReservations() == null) {
			roomReservation.getHotel().setReservations(new HashSet<RoomReservation>());
		}
		roomReservation.getHotel().getReservations().add(roomReservation);
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if(user instanceof RegisteredUser) {
			RegisteredUser registered = (RegisteredUser) user;
			if(registered.getRoomReservations() == null) {
				registered.setRoomReservations(new HashSet<RoomReservation>());
			}
			registered.getRoomReservations().add(roomReservation);
			roomReservation.setRegisteredUser(registered);
		}else {
			roomReservation.setRegisteredUser(null);
		}
		
		entityManager.persist(roomReservation);
		
		for(Room r : roomReservation.getRooms()) {
			Room managedRoomEntity = entityManager.find(Room.class, r.getId());
			if(managedRoomEntity.getReservations() == null) {
				managedRoomEntity.setReservations(new HashSet<RoomReservation>());
			}
			managedRoomEntity.getReservations().add(roomReservation);
		}
		
		return roomReservation;
	}

}
