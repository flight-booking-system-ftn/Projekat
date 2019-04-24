package com.isamrs.tim14.rest;

import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dao.AirlineDAO;
import com.isamrs.tim14.model.Airline;
import com.isamrs.tim14.model.Hotel;

@RestController
@RequestMapping("/api")
public class AirlineRest {

	private AirlineDAO airlineDAO;
	
	@Autowired
	public AirlineRest(AirlineDAO airlineDAO) {
		this.airlineDAO = airlineDAO;
	}
	
	@RequestMapping(
			value = "/airlines",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Airline>> getAirlines(){
		
		Collection<Airline> airlines = airlineDAO.getAirlines();
		
		return new ResponseEntity<Collection<Airline>>(airlines, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/airlines/{airlineID}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Airline> getAirline(@PathVariable Integer airlineID) {
		Airline airline =  airlineDAO.getAirline(airlineID);
		if(airline == null) {
			return new ResponseEntity<Airline>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Airline>(airline, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/airlines",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Airline> saveAirline(@RequestBody Airline airline) {
		Airline newAirline = airlineDAO.save(airline);
		if(newAirline == null) {
			return new ResponseEntity<Airline>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Airline>(newAirline, HttpStatus.CREATED);
	}
	
	@RequestMapping(
		value="/airlines",
		method = RequestMethod.PUT,
		produces = MediaType.APPLICATION_JSON_VALUE,
		consumes = MediaType.APPLICATION_JSON_VALUE)
	public Airline editAirline(@RequestBody Airline airline) {
		return airlineDAO.update(airline);
	}
	
	@RequestMapping(
			value="/airlinesSearch/{airlineName}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Airline>> searchAirlines(@PathVariable String airlineName) {
		Collection<Airline> airlines = airlineDAO.search(airlineName);
		
		return new ResponseEntity<Collection<Airline>>(airlines, HttpStatus.OK);
	}
	
}
