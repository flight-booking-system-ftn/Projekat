package com.isamrs.tim14.dao;

import java.util.Collection;
import java.util.List;

import org.springframework.http.ResponseEntity;

import com.isamrs.tim14.model.Flight;
import com.isamrs.tim14.model.Seat;
import com.isamrs.tim14.others.FlightsSearch;

public interface FlightDAO {
	public ResponseEntity<String> save(Flight flight);

	public ResponseEntity<List<Seat>> getSeats(Integer id);

	public ResponseEntity<List<List<Flight>>> search(FlightsSearch values);
	
	public ResponseEntity<Flight> getFlight(Integer id);
	
	public Integer getGrade(Integer id);
	
	public void setGrade(Integer id, Integer grade);
	
	public Collection<Flight> getAllRentsVehicles();
	
	public Integer getIntermediateGrade(Integer id);
	
}
