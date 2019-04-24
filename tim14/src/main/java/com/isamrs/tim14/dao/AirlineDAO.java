package com.isamrs.tim14.dao;

import java.util.List;

import com.isamrs.tim14.model.Airline;

public interface AirlineDAO {

	public List<Airline> getAirlines();
	
	public Airline save(Airline airline);
	
	public Airline getAirline(int id);
	
	public void deleteAirline(int id);
	
	public Airline update(Airline airline);
	
	public List<Airline> search(String airlineName);

	
}
