package com.isamrs.tim14.rest;

import java.util.Collection;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.model.BranchOffice;
import com.isamrs.tim14.model.RentACar;
import com.isamrs.tim14.model.RentACarAdmin;
import com.isamrs.tim14.service.RentService;

@RestController
@RequestMapping("/api")
public class RentACarRest {
	
	@Autowired
	private RentService rentService;
	
	@RequestMapping(
			value = "/rentacars",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<RentACar>> getRents(){
		Collection<RentACar> rents = rentService.findAll();
		
		return new ResponseEntity<Collection<RentACar>>(rents, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/rentacars/{rentID}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<RentACar> getRentACar(@PathVariable Integer rentID) {
		RentACar rent =  rentService.findById(rentID);
		
		if(rent == null) {
			return new ResponseEntity<RentACar>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<RentACar>(rent, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/rentacars",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<RentACar> saveRent(@RequestBody RentACar rentacar) {
		RentACar newRent = rentService.save(rentacar);
		
		if(newRent == null) {
			return new ResponseEntity<RentACar>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<RentACar>(newRent, HttpStatus.CREATED);
	}
	
	
	@RequestMapping(
			value = "/rentsSearch/{rentName}/{rentDestination}/{checkIn}/{checkOut}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<RentACar>> getRentSearch(@PathVariable String rentName,
			@PathVariable String rentDestination, @PathVariable long checkIn, @PathVariable long checkOut){
		Collection<RentACar> rents = rentService.getRentSearch(rentName, rentDestination, checkIn, checkOut);
		
		return new ResponseEntity<Collection<RentACar>>(rents, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/rentBranches/{rentID}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<BranchOffice>> getRentOffices(@PathVariable Integer rentID) {
		RentACar rent =  rentService.findById(rentID);
		
		if(rent == null) {
			return new ResponseEntity<Collection<BranchOffice>>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Collection<BranchOffice>>(rent.getOffices(), HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/rentBranchess",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<BranchOffice>> getRentOfficess() {
		RentACarAdmin rent = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		if(rent == null) {
			return new ResponseEntity<Collection<BranchOffice>>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Collection<BranchOffice>>(rent.getRentACar().getOffices(), HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/reservedRents",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<RentACar>> getReservationRents(){
		Collection<RentACar> rents = rentService.getRentsFromReservations();
		
		return new ResponseEntity<Collection<RentACar>>(rents, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@RequestMapping(value = "/getGradeForRent/{id}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Integer> getUserGrade(@PathVariable Integer id) {
		Integer grade = rentService.getGrade(id);
		
		return new ResponseEntity<Integer>(grade, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_RENTACARADMIN')")
	@RequestMapping(value = "/getGradeForRent",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Integer> getGrade() {
		Integer grade = rentService.getGradeRent();
		
		return new ResponseEntity<Integer>(grade, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@RequestMapping(value = "/setGradeForRent/{id}/{grade}",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Boolean> setUserGrade(@PathVariable Integer id, @PathVariable Integer grade) {
		rentService.setGrade(id, grade);
		
		return new ResponseEntity<Boolean>(true, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_RENTACARADMIN')")
	@RequestMapping(
			value = "/changeRent",
			method = RequestMethod.PUT,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<RentACar> changeRent(@RequestBody RentACar rent) {
		RentACar managedRent = rentService.changeRent(rent);
		
		if(managedRent == null) {
			return new ResponseEntity<RentACar>(HttpStatus.NOT_ACCEPTABLE);
		}
		return new ResponseEntity<RentACar>(managedRent, HttpStatus.CREATED);
	}
	
	@PreAuthorize("hasRole('ROLE_RENTACARADMIN')")
	@RequestMapping(
			value = "/getRentIncomes/{startDate}/{endDate}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Double> getIncome(@PathVariable Long startDate, @PathVariable Long endDate) {
		Date start = new Date(startDate);
		Date end = new Date(endDate);
		double income = rentService.getIncome(start, end);
		
		return new ResponseEntity<Double>(income, HttpStatus.OK);
	}
}
