package com.isamrs.tim14.dao;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.FlightReservation;
import com.isamrs.tim14.model.FlightTicket;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.Seat;
import com.isamrs.tim14.model.User;

@Repository
public class FlightReservationDAOImpl implements FlightReservationDAO {

	private EntityManager entityManager;
	
	@Autowired
	public FlightReservationDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
	
	@Override
	@Transactional
	public ResponseEntity<String> saveReservation(FlightReservation reservation) {
		for(FlightTicket ticket : reservation.getTickets()) {
			Seat managedSeat = entityManager.find(Seat.class, ticket.getSeat().getId());
			if(managedSeat.getBusy()) {
				return new ResponseEntity("Seat is taken.", HttpStatus.FORBIDDEN);
			}
		}
		RegisteredUser user = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		for(FlightTicket ticket : reservation.getTickets()) {
			ticket.setUser(user);
			Seat managedSeat = entityManager.find(Seat.class, ticket.getSeat().getId());
			managedSeat.setBusy(true);
		}
		
		reservation.setUser(user);
		
		entityManager.persist(reservation);
		
		return new ResponseEntity("Reservation successfully saved.", HttpStatus.OK);
	}

}
