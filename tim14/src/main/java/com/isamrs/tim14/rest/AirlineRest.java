package com.isamrs.tim14.rest;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.model.Airline;
import com.isamrs.tim14.model.Airport;
import com.isamrs.tim14.model.Flight;
import com.isamrs.tim14.model.Luggage;
import com.isamrs.tim14.service.AirlineService;

@RestController
@RequestMapping("/api")
public class AirlineRest {

	@Autowired
	private AirlineService airlineService;

	@RequestMapping(value = "/airlines", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Airline>> getAirlines() {
		Collection<Airline> airlines = airlineService.findAll();

		return new ResponseEntity<Collection<Airline>>(airlines, HttpStatus.OK);
	}

	@RequestMapping(value = "/airlines/{airlineID}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Airline> getAirline(@PathVariable Integer airlineID) {
		Airline airline = airlineService.findById(airlineID);
		if (airline == null) {
			return new ResponseEntity<Airline>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Airline>(airline, HttpStatus.OK);
	}

	@RequestMapping(value = "/airlines", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Airline> saveAirline(@RequestBody Airline airline) {
		Airline newAirline = airlineService.save(airline);
		if (newAirline == null) {
			return new ResponseEntity<Airline>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Airline>(newAirline, HttpStatus.CREATED);
	}

	@RequestMapping(value = "/airlines", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	public ResponseEntity<String> editAirline(@RequestBody Airline airline) {
		return airlineService.update(airline);
	}

	@RequestMapping(value = "/airlinesSearch/{airlineName}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Airline>> searchAirlines(@PathVariable String airlineName) {
		Collection<Airline> airlines = airlineService.search(airlineName);

		return new ResponseEntity<Collection<Airline>>(airlines, HttpStatus.OK);
	}
	
	@GetMapping("/airline/{id}/airports")
	public Set<Airport> getAirports(@PathVariable Integer id) {
		return airlineService.getAirports(id);
	}
	
	@GetMapping("/airline/airports")
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	public ResponseEntity<List<Airport>> getAirportsOfAirline() {
		return airlineService.getAirportsOfAirline();
	}
	
	@GetMapping("/airline/flights")
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	public Set<Flight> getFlightsOfAirline() {
		return airlineService.getFlightsOfAirline();
	}
	
	@GetMapping("/airline/getAirline")
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	public Airline getAirline() {
		return airlineService.getAirline();
	}
	
	@GetMapping("/airline/getPricelist")
	public Set<Luggage> getPricelist() {
		return airlineService.getPricelist();
	}

	@RequestMapping(
			value = "/reservedAirlines",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Airline>> getReservationRents(){
		
		Collection<Airline> res = airlineService.getAirlinesFromReservations();
		
		return new ResponseEntity<Collection<Airline>>(res, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@RequestMapping(value = "/getGradeForAirline/{id}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Integer> getUserGrade(@PathVariable Integer id) {
		Integer grade = airlineService.getGrade(id);
		return new ResponseEntity<Integer>(grade, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@RequestMapping(value = "/setGradeForAirline/{id}/{grade}",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Boolean> setUserGrade(@PathVariable Integer id, @PathVariable Integer grade) {
		airlineService.setGrade(id, grade);
		return new ResponseEntity<Boolean>(true, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	@RequestMapping(value = "/getGradeForAirline",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Integer> getGrade() {
		Integer grade = airlineService.getGradeAirline();
		return new ResponseEntity<Integer>(grade, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	@RequestMapping(
			value = "/getAirlineIncomes/{startDate}/{endDate}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Double> getIncome(@PathVariable Long startDate, @PathVariable Long endDate) {
		Date start = new Date(startDate);
		Date end = new Date(endDate);
		double income = airlineService.getIncome(start, end);
		return new ResponseEntity<Double>(income, HttpStatus.OK);
	}
}
