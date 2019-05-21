package com.isamrs.tim14.dao;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.isamrs.tim14.model.FlightReservation;

public interface FlightReservationDAO {
	public ResponseEntity<String> saveReservation(List<FlightReservation> reservations);

	public ResponseEntity<String> makeQuickReservation(List<FlightReservation> reservations);
}
