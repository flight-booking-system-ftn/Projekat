package com.isamrs.tim14.rest;

import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dao.DestinationDAO;
import com.isamrs.tim14.model.Destination;

@RestController
@RequestMapping("/api")
public class DestinationRest {
	private DestinationDAO destinationDAO;

	@Autowired
	public DestinationRest(DestinationDAO destinationDAO) {
		this.destinationDAO = destinationDAO;
	}

	@PostMapping("/new")
	public void addDestination(@RequestBody Destination destination) {
		destinationDAO.save(destination);
	}

	@RequestMapping(value = "/destinations/{destID}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Destination> getDestination(@PathVariable Integer destID) {
		Destination destination = destinationDAO.getDestination(destID);
		if (destination == null) {
			return new ResponseEntity<Destination>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Destination>(destination, HttpStatus.OK);
	}

	@RequestMapping(value = "/destinations", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Destination>> getDestinations() {
		List<Destination> destinations = destinationDAO.getDestinations();
		return new ResponseEntity<Collection<Destination>>(destinations, HttpStatus.OK);
	}

	@RequestMapping(value = "/destinations", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Destination> saveDestination(@RequestBody Destination destination) {
		Destination newDest = destinationDAO.save(destination);
		if (newDest == null) {
			return new ResponseEntity<Destination>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Destination>(newDest, HttpStatus.CREATED);
	}
}
