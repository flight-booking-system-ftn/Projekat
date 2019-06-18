package com.isamrs.tim14.rest;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.model.AirlineAdmin;
import com.isamrs.tim14.service.AirlineAdminService;

@RestController
@RequestMapping("/api")
public class AirlineAdminRest {
	
	@Autowired
	private AirlineAdminService airlineAdminService;
	
	@RequestMapping(
			value = "/airlineadmins",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<AirlineAdmin>> getAirlineAdmins(){
		Collection<AirlineAdmin> airlineAdmins = airlineAdminService.getAirlineAdmins();
		
		return new ResponseEntity<Collection<AirlineAdmin>>(airlineAdmins, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/airlineadmins/{airlineAdminID}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<AirlineAdmin> getAirlineAdmin(@PathVariable Integer airlineAdminID) {
		AirlineAdmin airlineAdmin = airlineAdminService.findById(airlineAdminID);
		
		if(airlineAdmin == null) {
			return new ResponseEntity<AirlineAdmin>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<AirlineAdmin>(airlineAdmin, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_SYSTEMADMIN')")
	@RequestMapping(
			value = "/airlineadmins",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<AirlineAdmin> saveAirlineAdmin(@RequestBody AirlineAdmin airlineAdmins) {
		AirlineAdmin newAirlineAdmin = airlineAdminService.save(airlineAdmins);
		
		if(newAirlineAdmin == null) {
			return new ResponseEntity<AirlineAdmin>(HttpStatus.NOT_FOUND);
		}
		
		return new ResponseEntity<AirlineAdmin>(newAirlineAdmin, HttpStatus.CREATED);
	}
	
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	@PutMapping("/airlineadmins/updateProfile")
	public void updateProfile(@RequestBody AirlineAdmin admin) {
		airlineAdminService.updateProfile(admin);
	}
}
