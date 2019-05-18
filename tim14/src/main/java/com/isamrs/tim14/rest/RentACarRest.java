package com.isamrs.tim14.rest;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dao.RentDAO;
import com.isamrs.tim14.model.RentACar;

@RestController
@RequestMapping("/api")
public class RentACarRest {
	
	private RentDAO rentDAO;
	
	@Autowired
	public RentACarRest(RentDAO rentDAO) {
		this.rentDAO = rentDAO;
	}
	
	@RequestMapping(
			value = "/rentacars",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<RentACar>> getRents(){
		
		Collection<RentACar> rents = rentDAO.getRents();
		
		return new ResponseEntity<Collection<RentACar>>(rents, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/rentacars/{rentID}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<RentACar> getRentACar(@PathVariable Integer rentID) {
		RentACar rent =  rentDAO.getRent(rentID);
		if(rent == null) {
			return new ResponseEntity<RentACar>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<RentACar>(rent, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/rentacars",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<RentACar> saveRent(@RequestBody RentACar rentacar) {
		RentACar newRent = rentDAO.save(rentacar);
		if(newRent == null) {
			return new ResponseEntity<RentACar>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<RentACar>(newRent, HttpStatus.CREATED);
	}
	
	
	@RequestMapping(
			value = "/rentsSearch/{rentName}/{rentDestination}/{checkIn}/{checkOut}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<RentACar>> getRentSearch(@PathVariable String rentName,
			@PathVariable String rentDestination, @PathVariable String checkIn, @PathVariable String checkOut){
		
		Collection<RentACar> rents = rentDAO.getRentSearch(rentName, rentDestination, checkIn, checkOut);
		
		return new ResponseEntity<Collection<RentACar>>(rents, HttpStatus.OK);
	}
}
