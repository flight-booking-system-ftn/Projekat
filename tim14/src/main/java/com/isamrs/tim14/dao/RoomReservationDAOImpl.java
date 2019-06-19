package com.isamrs.tim14.dao;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.dto.GraphsDTO;
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
	
	@Override
	@Transactional
	public ArrayList<RoomReservation> getQuickRoomReservations(String hotelID) {
		Hotel managedHotel = entityManager.find(Hotel.class, Integer.parseInt(hotelID));
		ArrayList<RoomReservation> result = new ArrayList<RoomReservation>();
		for(RoomReservation res : managedHotel.getReservations()) {
			if(res.getRegisteredUser() == null) {
				result.add(res);
			}
		}
		return result;
	}

	@Override
	@Transactional
	public RoomReservation saveQuick(String roomReservationID) {
		RoomReservation managedReservation = entityManager.find(RoomReservation.class, Integer.parseInt(roomReservationID));
		RegisteredUser user = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		managedReservation.setRegisteredUser(user);
		return managedReservation;
	}

	@Override
	@Transactional
	public Collection<Room> getRoomsHistory() {
		ArrayList<Room> allRooms = new ArrayList<Room>();
		RegisteredUser u = ((RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
		for (RoomReservation rr : u.getRoomReservations()) {
			//if (vr.getEnd().after(new Date(System.currentTimeMillis()))) {
				for (Room r: rr.getRooms()) {
					if (!allRooms.contains(r))
						allRooms.add(r);
				}
			//}
		}
		return allRooms;
	}

	@Override
	@Transactional
	public RoomReservation getOneQuickReservation(Integer id) {
		RoomReservation reservation = entityManager.find(RoomReservation.class, id);
		return reservation;
	}

	@Override
	@Transactional
	public GraphsDTO getRoomsDaily() throws ParseException {
		GraphsDTO graph = new GraphsDTO();
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		Date start = null;
		Calendar c = Calendar.getInstance();
		c.setTime(new Date()); 
		c.add(Calendar.DATE, -13);
		start = sdf.parse(sdf.format(c.getTime()));
		HotelAdmin admin = (HotelAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Set<Room> rooms = admin.getHotel().getRooms();
		for(int i = 0; i< 14; i++) {
			start = sdf.parse(sdf.format(c.getTime()));
			String dateX = sdf.format(start);
			graph.getX().add(dateX);
			int sum = 0;
			for(Room r: rooms) {
				for(RoomReservation rr : r.getReservations()) {
					if(sdf.parse(sdf.format(rr.getStart())).equals(start)) {
						sum++;
					}
				}
			}
			graph.getY().add(sum);
			c.add(Calendar.DATE, 1);
		}	
		return graph;
	}

	@Override
	public GraphsDTO getRoomsWeekly() throws ParseException {
		GraphsDTO graph = new GraphsDTO();
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		SimpleDateFormat sdf2 = new SimpleDateFormat("dd/MM");
		Date end = null;
		Date start = null;
		Calendar c = Calendar.getInstance();
		Calendar c2 = Calendar.getInstance();
		c.setTime(new Date()); // Now use today date.
		c.add(Calendar.WEEK_OF_YEAR, -13);
		start = sdf.parse(sdf.format(c.getTime()));
		c.add(Calendar.WEEK_OF_YEAR, 1);
		end = sdf.parse(sdf.format(c.getTime()));
		HotelAdmin admin = (HotelAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Set<Room> rooms = admin.getHotel().getRooms();
		for(int i = 0; i<12; i++) {
			start = end;
			c.add(Calendar.DATE, 7);
			end = sdf.parse(sdf.format(c.getTime()));
			int sum = 0;
			for(Room r: rooms) {
				for(RoomReservation rr : r.getReservations()) {
					if(sdf.parse(sdf.format(rr.getStart())).before(end) && sdf.parse(sdf.format(rr.getStart())).after(start) || sdf.parse(sdf.format(rr.getStart())).equals(end)) {
						sum++;
					}
				}
			}
			c2.setTime(start);
			c2.add(Calendar.DATE, 1);
			start = sdf.parse(sdf.format(c2.getTime()));
			String dateX = sdf2.format(start)+"-"+sdf2.format(end);
			graph.getX().add(dateX);
			graph.getY().add(sum);
		}
		return graph;
	}

	@Override
	public GraphsDTO getRoomsMonthly() throws ParseException {
		GraphsDTO graph = new GraphsDTO();
		SimpleDateFormat sdf = new SimpleDateFormat("MM/yy");
		Date date = null;
		Calendar c = Calendar.getInstance();
		c.add(Calendar.MONTH, -11);
		date = sdf.parse(sdf.format(c.getTime()));
		HotelAdmin admin = (HotelAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Set<Room> rooms = admin.getHotel().getRooms();
		for(int i = 0; i<12; i++) {
			String dateX = sdf.format(c.getTime());
			date = sdf.parse(sdf.format(c.getTime()));
			int sum = 0;
			for(Room r: rooms) {
				for(RoomReservation rr : r.getReservations()) {
					if(sdf.parse(sdf.format(rr.getStart())).equals(date)) {
						sum++;
					}
				}
			}
			graph.getX().add(dateX);
			graph.getY().add(sum);
			c.add(Calendar.MONTH, 1);
		}
		return graph;
	}
}
