package com.isamrs.tim14.dao;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

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

	@Override
	@Transactional
	public ResponseEntity<List<FlightReservation>> getQuickTickets(Integer id) {
		Query query = entityManager.createQuery("SELECT fr FROM Flight f, FlightReservation fr WHERE f.airline.id = :airline_id AND f.id = fr.flight.id AND fr.user IS NULL AND fr.passenger IS NULL");
		query.setParameter("airline_id", id);
		
		List<FlightReservation> result = query.getResultList();
		
		System.out.println("BRZE REZERVACIJE SU");
		for(FlightReservation reservation : result) {
			System.out.println(reservation.getId());
		}
		
		return new ResponseEntity(result, HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<String> buyQuickTicket(Integer reservationID) {
		FlightReservation reservation = entityManager.find(FlightReservation.class, reservationID);
		RegisteredUser user = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		reservation.setUser(user);
		reservation.setDateOfPurchase(new Timestamp(new Date().getTime()));
		
		return new ResponseEntity("Quick reservation successfully completed.", HttpStatus.OK);
	}

}
