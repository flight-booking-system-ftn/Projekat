package com.isamrs.tim14.dao;

import java.util.Set;

import com.isamrs.tim14.model.Airport;

public interface AirportDAO {
	public Airport save(Airport airport);

	public Set<Airport> airportsOfAirline();
}
