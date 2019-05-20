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

import com.isamrs.tim14.model.HotelAdmin;
import com.isamrs.tim14.model.Room;
import com.isamrs.tim14.model.RoomReservation;

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
		entityManager.persist(room);
		return room;
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

}
