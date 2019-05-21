package com.isamrs.tim14.dao;

import java.util.List;
import java.util.Set;

import org.springframework.http.ResponseEntity;

import com.isamrs.tim14.model.Flight;
import com.isamrs.tim14.model.Seat;
import com.isamrs.tim14.others.FlightsSearch;

public interface FlightDAO {
	public void save(Flight flight);

	public Set<Flight> flightsOfAirline();

	public List<Seat> getSeats(Integer id);

	public ResponseEntity<List<List<Flight>>> search(FlightsSearch values);
}
