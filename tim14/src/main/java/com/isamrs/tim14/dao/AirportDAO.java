package com.isamrs.tim14.dao;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.isamrs.tim14.model.Airport;

public interface AirportDAO {
	public ResponseEntity<String> save(Airport airport);

	public ResponseEntity<List<Airport>> getAll();
}
