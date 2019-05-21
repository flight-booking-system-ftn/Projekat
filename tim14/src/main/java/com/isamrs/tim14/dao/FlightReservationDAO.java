package com.isamrs.tim14.dao;

import org.springframework.http.ResponseEntity;

import com.isamrs.tim14.model.FlightReservation;

public interface FlightReservationDAO {
	public ResponseEntity<String> saveReservation(FlightReservation reservation);
}
