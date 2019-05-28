package com.isamrs.tim14.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dao.AirportDAO;
import com.isamrs.tim14.model.Airport;

@RestController
@RequestMapping("/airport")
public class AirportRest {
	private AirportDAO airportDAO;
	
	@Autowired
	public AirportRest(AirportDAO airportDAO) {
		this.airportDAO = airportDAO;
	}
	
	@PostMapping("/new")
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	public ResponseEntity<String> addAirportToAirline(@RequestBody Airport airport) {
		return airportDAO.save(airport);
	}
}
