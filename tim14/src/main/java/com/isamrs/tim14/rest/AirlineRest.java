package com.isamrs.tim14.rest;

import java.util.Collection;
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

import com.isamrs.tim14.dao.AirlineDAO;
import com.isamrs.tim14.model.Airline;
import com.isamrs.tim14.model.Airport;
import com.isamrs.tim14.model.Flight;
import com.isamrs.tim14.model.RentACar;

@RestController
@RequestMapping("/api")
public class AirlineRest {

	private AirlineDAO airlineDAO;

	@Autowired
	public AirlineRest(AirlineDAO airlineDAO) {
		this.airlineDAO = airlineDAO;
	}

	@RequestMapping(value = "/airlines", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Airline>> getAirlines() {

		Collection<Airline> airlines = airlineDAO.getAirlines();

		return new ResponseEntity<Collection<Airline>>(airlines, HttpStatus.OK);
	}

	@RequestMapping(value = "/airlines/{airlineID}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Airline> getAirline(@PathVariable Integer airlineID) {
		Airline airline = airlineDAO.getAirline(airlineID);
		if (airline == null) {
			return new ResponseEntity<Airline>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Airline>(airline, HttpStatus.OK);
	}

	@RequestMapping(value = "/airlines", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Airline> saveAirline(@RequestBody Airline airline) {
		Airline newAirline = airlineDAO.save(airline);
		if (newAirline == null) {
			return new ResponseEntity<Airline>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Airline>(newAirline, HttpStatus.CREATED);
	}

	@RequestMapping(value = "/airlines", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	public ResponseEntity<String> editAirline(@RequestBody Airline airline) {
		return airlineDAO.update(airline);
	}

	@RequestMapping(value = "/airlinesSearch/{airlineName}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Airline>> searchAirlines(@PathVariable String airlineName) {
		Collection<Airline> airlines = airlineDAO.search(airlineName);

		return new ResponseEntity<Collection<Airline>>(airlines, HttpStatus.OK);
	}
	
	@GetMapping("/airline/{id}/airports")
	public ResponseEntity<List<Airport>> getAirports(@PathVariable Integer id) {
		return airlineDAO.getAirports(id);
	}
	
	@GetMapping("/airline/airports")
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	public ResponseEntity<List<Airport>> getAirportsOfAirline() {
		return airlineDAO.getAirportsOfAirline();
	}
	
	@GetMapping("/airline/flights")
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	public ResponseEntity<Set<Flight>> getFlightsOfAirline() {
		return airlineDAO.getFlightsOfAirline();
	}

	@RequestMapping(
			value = "/reservedAirlines",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Airline>> getReservationRents(){
		
		Collection<Airline> res = airlineDAO.getAirlinesFromReservations();
		
		return new ResponseEntity<Collection<Airline>>(res, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@RequestMapping(value = "/getGradeForAirline/{id}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Integer> getUserGrade(@PathVariable Integer id) {
		Integer grade = airlineDAO.getGrade(id);
		return new ResponseEntity<Integer>(grade, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@RequestMapping(value = "/setGradeForAirline/{id}/{grade}",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Boolean> setUserGrade(@PathVariable Integer id, @PathVariable Integer grade) {
		airlineDAO.setGrade(id, grade);
		return new ResponseEntity<Boolean>(true, HttpStatus.OK);
	}
}
