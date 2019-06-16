package com.isamrs.tim14.rest;

import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dao.FlightReservationDAO;
import com.isamrs.tim14.model.Flight;
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
	public ResponseEntity<String> saveReservation(@RequestBody List<FlightReservation> reservations) {
		return flightReservationDAO.saveReservation(reservations);
	}
	
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	@PostMapping("/flightReservation/makeQuick")
	public ResponseEntity<String> makeQuickReservation(@RequestBody List<FlightReservation> reservations) {
		return flightReservationDAO.makeQuickReservation(reservations);
	}
	
	@GetMapping("/flightReservation/getQuickTickets/{airlineID}")
	public ResponseEntity<List<FlightReservation>> getQuickTickets(@PathVariable Integer airlineID) {
		return flightReservationDAO.getQuickTickets(airlineID);
	}
	
	@PutMapping("/flightReservation/buyQuickTicket/{reservationID}")
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	public ResponseEntity<String> buyQuickTicket(@PathVariable Integer reservationID) {
		return flightReservationDAO.buyQuickTicket(reservationID);
	}
	
	@GetMapping("/flightReservation/getQuickReservation/{reservationID}")
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	public ResponseEntity<FlightReservation> getQuickReservation(@PathVariable Integer reservationID) {
		return flightReservationDAO.getQuickReservation(reservationID);
	}
	
	@RequestMapping(
			value = "/allUsedFlights",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Flight>> getFlightsHistory(){
		return new ResponseEntity<Collection<Flight>>(flightReservationDAO.getFlightHistory(), HttpStatus.OK);
	}
}
