package com.isamrs.tim14.rest;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
	public void save(@RequestBody Flight flight) {
		flightDAO.save(flight);
	}
	
	@GetMapping("/flightsOfAirline")
	public Set<Flight> getFlightsOfAirline() {
		return flightDAO.flightsOfAirline();
	}
	
	@GetMapping("/{id}/seats")
	public List<Seat> getSeats(@PathVariable Integer id) {
		return flightDAO.getSeats(id);
	}
	
	@PostMapping("/search")
	public List<Flight> search(@RequestBody FlightsSearch values) {
		return flightDAO.search(values);
	}
}
