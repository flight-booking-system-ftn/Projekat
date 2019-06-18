package com.isamrs.tim14.rest;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dto.UserDTO;
import com.isamrs.tim14.model.RentACar;
import com.isamrs.tim14.model.RentACarAdmin;
import com.isamrs.tim14.service.RentAdminService;

@RestController
@RequestMapping("/api")
public class RentAdminRest {

	@Autowired
	private RentAdminService rentAdminService;
	
	@RequestMapping(
			value = "/rentacaradmins",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<RentACarAdmin>> getRentAdmins(){
		
		Collection<RentACarAdmin> rentAdmins = rentAdminService.getRentAdmins();
		
		return new ResponseEntity<Collection<RentACarAdmin>>(rentAdmins, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/rentacaradmins/{rentID}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<RentACarAdmin> getRentAdmin(@PathVariable Integer rentID) {
		RentACarAdmin rentACarAdmin = rentAdminService.findById(rentID);
		
		if(rentACarAdmin == null) {
			return new ResponseEntity<RentACarAdmin>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<RentACarAdmin>(rentACarAdmin, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_SYSTEMADMIN')")
	@RequestMapping(
			value = "/rentacaradmins",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<RentACarAdmin> saveRentAdmin(@RequestBody RentACarAdmin rentAdmin) {
		RentACarAdmin newRentAdmin = rentAdminService.save(rentAdmin);
		
		if(newRentAdmin == null) {
			return new ResponseEntity<RentACarAdmin>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<RentACarAdmin>(newRentAdmin, HttpStatus.CREATED);
	}
	
	@PreAuthorize("hasRole('ROLE_RENTACARADMIN')")
	@RequestMapping(
			value = "/rentAdmin/rent",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<RentACar> getAdminsHotel(){
		RentACar currRent= rentAdminService.getCurrentRent();
		
		return new ResponseEntity<RentACar>(currRent, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_RENTACARADMIN')")
	@RequestMapping(
			value = "/updateRentAdmin",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<RentACarAdmin> updateRentACarAdmin(@RequestBody UserDTO rentAdmin) {
		RentACarAdmin updatedRentACarAdmin = rentAdminService.updateAdmin(rentAdmin);
		if(updatedRentACarAdmin == null) {
			return new ResponseEntity<RentACarAdmin>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<RentACarAdmin>(updatedRentACarAdmin, HttpStatus.CREATED);
	}
	
}
