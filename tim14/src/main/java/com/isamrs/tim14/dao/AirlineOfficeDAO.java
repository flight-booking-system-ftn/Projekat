package com.isamrs.tim14.dao;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.isamrs.tim14.model.AirlineOffice;

public interface AirlineOfficeDAO {

	public ResponseEntity<String> save(AirlineOffice office);

	public ResponseEntity<List<AirlineOffice>> allOffices();

}
