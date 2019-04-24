package com.isamrs.tim14.rest;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dao.RentAdminDAO;
import com.isamrs.tim14.model.RentACarAdmin;

@RestController
@RequestMapping("/api")
public class RentAdminRest {
	private RentAdminDAO rentAdminDAO;
	
	@Autowired
	public RentAdminRest(RentAdminDAO rentAdminDAO) {
		this.rentAdminDAO = rentAdminDAO;
	}
	
	@RequestMapping(
			value = "/rentacaradmins",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<RentACarAdmin>> getRentAdmins(){
		
		Collection<RentACarAdmin> rentAdmins = rentAdminDAO.getRentAdmins();
		
		return new ResponseEntity<Collection<RentACarAdmin>>(rentAdmins, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/rentacaradmins/{rentID}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<RentACarAdmin> getRentAdmin(@PathVariable Integer rentID) {
		RentACarAdmin rentACarAdmin = rentAdminDAO.getRentAdmin(rentID);
		if(rentACarAdmin == null) {
			return new ResponseEntity<RentACarAdmin>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<RentACarAdmin>(rentACarAdmin, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/rentacaradmins",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<RentACarAdmin> saveRentAdmin(@RequestBody RentACarAdmin rentAdmin) {
		RentACarAdmin newRentAdmin = rentAdminDAO.save(rentAdmin);
		if(newRentAdmin == null) {
			return new ResponseEntity<RentACarAdmin>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<RentACarAdmin>(newRentAdmin, HttpStatus.CREATED);
	}
	
}
