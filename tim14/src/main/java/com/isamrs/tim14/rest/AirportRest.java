package com.isamrs.tim14.rest;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
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
	public @ResponseBody Airport addAirportToAirline(@RequestBody Airport airport) {
		return airportDAO.save(airport);
	}
	
	@GetMapping("/airportsOfAirline")
	public Set<Airport> getAirportsOfAirline() {
		return airportDAO.airportsOfAirline();
	}
}
