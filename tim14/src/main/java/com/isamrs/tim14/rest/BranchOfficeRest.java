package com.isamrs.tim14.rest;

import java.util.Collection;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dao.BranchOfficeDAO;
import com.isamrs.tim14.model.BranchOffice;
import com.isamrs.tim14.model.Destination;

@RestController
@RequestMapping("/api")
public class BranchOfficeRest {

	private BranchOfficeDAO branchDAO;
	
	@Autowired
	public BranchOfficeRest(BranchOfficeDAO branchDAO) {
		this.branchDAO = branchDAO;
	}
	
	@RequestMapping(
			value = "/branchOffice",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<BranchOffice> saveRent(@RequestBody Destination destination) {
		BranchOffice newRent = branchDAO.save(destination);
		if(newRent == null) {
			return new ResponseEntity<BranchOffice>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<BranchOffice>(newRent, HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/branchOffice/{officeID}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<BranchOffice> getOffice(@PathVariable Integer officeID) {
		BranchOffice office = branchDAO.getOffice(officeID);
		if (office == null) {
			return new ResponseEntity<BranchOffice>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<BranchOffice>(office, HttpStatus.OK);
	}

	@RequestMapping(value = "/branchOffices", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<BranchOffice>> getOffices() {
		Set<BranchOffice> offices = branchDAO.getOffices();
		return new ResponseEntity<Collection<BranchOffice>>(offices, HttpStatus.OK);
	}
}
