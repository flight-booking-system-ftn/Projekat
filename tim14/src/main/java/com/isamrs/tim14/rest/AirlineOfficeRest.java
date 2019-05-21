package com.isamrs.tim14.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dao.AirlineOfficeDAO;
import com.isamrs.tim14.model.AirlineOffice;

@RestController
@RequestMapping("/api")
public class AirlineOfficeRest {

	public AirlineOfficeDAO airlineOfficeDAO;
	
	@Autowired
	public AirlineOfficeRest(AirlineOfficeDAO airlineOfficeDAO) {
		this.airlineOfficeDAO = airlineOfficeDAO;
	}
	
	@PostMapping("/airlineOffice/add")
	//@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	public ResponseEntity<String> addOffice(@RequestBody AirlineOffice office) {
		return airlineOfficeDAO.save(office);
	}
	
	@GetMapping("/airlineOffice/all")
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN') or hasRole('ROLE_REGISTEREDUSER')")
	public ResponseEntity<List<AirlineOffice>> allOffices() {
		return airlineOfficeDAO.allOffices();
	}
	
}
