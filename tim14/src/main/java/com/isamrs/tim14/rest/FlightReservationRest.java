package com.isamrs.tim14.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dao.FlightReservationDAO;
import com.isamrs.tim14.model.FlightReservation;

@RestController
@RequestMapping("/api")
public class FlightReservationRest {

	private FlightReservationDAO flightReservationDAO;

	@Autowired
	public FlightReservationRest(FlightReservationDAO flightReservationDAO) {
		this.flightReservationDAO = flightReservationDAO;
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@PostMapping("/flightReservation/save")
	public ResponseEntity<String> saveReservation(@RequestBody FlightReservation reservation) {
		return flightReservationDAO.saveReservation(reservation);
	}
}
