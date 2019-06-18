package com.isamrs.tim14.rest;

import java.util.List;
import java.util.Set;

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

import com.isamrs.tim14.model.Flight;
import com.isamrs.tim14.model.Luggage;
import com.isamrs.tim14.model.Seat;
import com.isamrs.tim14.others.FlightsSearch;
import com.isamrs.tim14.service.FlightService;

@RestController
@RequestMapping("/flight")
public class FlightRest {
	@Autowired
	private FlightService flightService;
	
	@PostMapping("/new")
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	public Flight save(@RequestBody Flight flight) {
		return flightService.save(flight);
	}
	
	@GetMapping("/{id}/seats")
	public List<Seat> getSeats(@PathVariable Integer id) {
		return flightService.getSeats(id);
	}
	
	@PostMapping("/search")
	public ResponseEntity<List<List<Flight>>> search(@RequestBody FlightsSearch values) {
		return flightService.search(values);
	}
	
	@GetMapping("/{id}")
	public Flight getFlight(@PathVariable Integer id){
		return flightService.findById(id);
	}
	
	@GetMapping("/{id}/luggagePricelist")
	public Set<Luggage> getLuggagePricelist(@PathVariable Integer id) {
		return flightService.getLuggagePricelist(id);
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@RequestMapping(value = "/getGradeForFlight/{id}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Integer> getUserGrade(@PathVariable Integer id) {
		Integer grade = flightService.getGrade(id);
		return new ResponseEntity<Integer>(grade, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@RequestMapping(value = "/setGradeForFlight/{id}/{grade}",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Boolean> setUserGrade(@PathVariable Integer id, @PathVariable Integer grade) {
		flightService.setGrade(id, grade);
		return new ResponseEntity<Boolean>(true, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	@RequestMapping(value = "/getMediumGradeForFlight/{id}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Integer> getGrade(@PathVariable String id) {
		int idd = Integer.parseInt(id);
		Integer grade = flightService.getIntermediateGrade(idd);
		return new ResponseEntity<Integer>(grade, HttpStatus.OK);
	}
}
