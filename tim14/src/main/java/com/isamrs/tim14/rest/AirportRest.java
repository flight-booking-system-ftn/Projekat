package com.isamrs.tim14.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.model.Airport;
import com.isamrs.tim14.service.AirportService;

@RestController
@RequestMapping("/airport")
public class AirportRest {

	@Autowired
	private AirportService airportService;
	
	@PostMapping("/new")
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	public ResponseEntity<String> addAirportToAirline(@RequestBody Airport airport) {
		return airportService.save(airport);
	}
	
	@GetMapping("/all")
	public List<Airport> findAll() {
		return airportService.findAll();
	}
	
}
