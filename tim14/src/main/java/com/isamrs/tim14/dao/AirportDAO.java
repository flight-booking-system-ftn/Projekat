package com.isamrs.tim14.dao;

import java.util.List;

import com.isamrs.tim14.model.Airport;

public interface AirportDAO {
	public Airport save(Airport airport);

	public List<Airport> getAll();
}
