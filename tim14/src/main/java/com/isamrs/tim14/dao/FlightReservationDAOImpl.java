package com.isamrs.tim14.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.AirlineAdmin;
import com.isamrs.tim14.model.FlightReservation;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.Seat;

@Repository
public class FlightReservationDAOImpl implements FlightReservationDAO {

	private EntityManager entityManager;
	
	@Autowired
	public FlightReservationDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
	
	@Override
	@Transactional
	public ResponseEntity<String> saveReservation(List<FlightReservation> reservations) {
		RegisteredUser user = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		reservations.get(0).setUser(user);
		
		for(FlightReservation reservation : reservations) {
			Seat managedSeat = entityManager.find(Seat.class, reservation.getSeat().getId());
			managedSeat.setBusy(true);
			
			entityManager.persist(reservation);
		}
		
		return new ResponseEntity("Reservation successfully saved.", HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<String> makeQuickReservation(List<FlightReservation> reservations) {
		for(FlightReservation reservation : reservations) {
			Seat managedSeat = entityManager.find(Seat.class, reservation.getSeat().getId());
			managedSeat.setBusy(true);
			
			entityManager.persist(reservation);
		}
		
		return new ResponseEntity("Quick reservation successfully saved.", HttpStatus.OK);
	}

}
