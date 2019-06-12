package com.isamrs.tim14.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dao.FlightDAO;
import com.isamrs.tim14.model.Flight;
import com.isamrs.tim14.model.Seat;
import com.isamrs.tim14.others.FlightsSearch;

@RestController
@RequestMapping("/flight")
public class FlightRest {
	private FlightDAO flightDAO;
	
	@Autowired
	public FlightRest(FlightDAO flightDAO) {
		this.flightDAO = flightDAO;
	}
	
	@PostMapping("/new")
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	public ResponseEntity<String> save(@RequestBody Flight flight) {
		return flightDAO.save(flight);
	}
	
	@GetMapping("/{id}/seats")
	public ResponseEntity<List<Seat>> getSeats(@PathVariable Integer id) {
		return flightDAO.getSeats(id);
	}
	
	@PostMapping("/search")
	public ResponseEntity<List<List<Flight>>> search(@RequestBody FlightsSearch values) {
		return flightDAO.search(values);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Flight> getFlight(@PathVariable Integer id){
		return flightDAO.getFlight(id);
	}
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@RequestMapping(value = "/getGradeForFlight/{id}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Integer> getUserGrade(@PathVariable Integer id) {
		Integer grade = flightDAO.getGrade(id);
		return new ResponseEntity<Integer>(grade, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@RequestMapping(value = "/setGradeForFlight/{id}/{grade}",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Boolean> setUserGrade(@PathVariable Integer id, @PathVariable Integer grade) {
		flightDAO.setGrade(id, grade);
		return new ResponseEntity<Boolean>(true, HttpStatus.OK);
	}
}
