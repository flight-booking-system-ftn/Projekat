package com.isamrs.tim14.dao;

import java.util.List;
import java.util.Set;

import org.springframework.http.ResponseEntity;

import com.isamrs.tim14.model.Airline;
import com.isamrs.tim14.model.Airport;
import com.isamrs.tim14.model.Flight;
import com.isamrs.tim14.model.RentACar;

public interface AirlineDAO {

	public List<Airline> getAirlines();

	public Airline save(Airline airline);

	public Airline getAirline(int id);

	public void deleteAirline(int id);

	public ResponseEntity<String> update(Airline airline);

	public List<Airline> search(String airlineName);

	public ResponseEntity<List<Airport>> getAirports(Integer id);
	
	public ResponseEntity<Set<Flight>> getFlightsOfAirline();

	public ResponseEntity<List<Airport>> getAirportsOfAirline();
	
	public List<Airline> getAirlinesFromReservations();
	
	public Integer getGrade(Integer id);

	public void setGrade(Integer id, Integer grade);
}
