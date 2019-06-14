package com.isamrs.tim14.rest;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dao.UserDAO;
import com.isamrs.tim14.model.Room;
import com.isamrs.tim14.model.Sales;

@RestController
@RequestMapping("/api")
public class DiscountRest {

	
	private UserDAO userDAO;
	
	@Autowired
	public DiscountRest(UserDAO userDAO) {
		this.userDAO = userDAO;
	}
	
	@PreAuthorize("hasRole('ROLE_SYSTEMADMIN')")
	@RequestMapping(
			value = "/discount",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Sales> getDiscount(){
		Sales sale = userDAO.getDiscount();
		return new ResponseEntity<Sales>(sale, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_SYSTEMADMIN')")
	@RequestMapping(
			value = "/discount",
			method = RequestMethod.PUT,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Sales> changeSale(@RequestBody Sales sale) {
		Sales newSale = userDAO.changeDiscount(sale);

		if(newSale == null) {
			return new ResponseEntity<Sales>(HttpStatus.NOT_ACCEPTABLE);
		}
		return new ResponseEntity<Sales>(newSale, HttpStatus.CREATED);
	}
	
}
