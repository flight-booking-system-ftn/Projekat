package com.isamrs.tim14.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.model.Airline;
import com.isamrs.tim14.model.AirlineAdmin;
import com.isamrs.tim14.model.Airport;
import com.isamrs.tim14.model.Destination;
import com.isamrs.tim14.repository.IAirlineRepository;
import com.isamrs.tim14.repository.IAirportRepository;
import com.isamrs.tim14.repository.IDestinationRepository;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class AirportService {
	
	@Autowired
	private IAirportRepository airportRepository;
	
	@Autowired
	private IDestinationRepository destinationRepository;
	
	@Autowired
	private IAirlineRepository airlineRepository;

	public ResponseEntity<String> save(Airport airport) {
		List<Destination> destinations = destinationRepository.findAll();
		
		for(Destination destination : destinations)
			if(destination.getName().equals(airport.getDestination().getName()) && destination.getAddress().equals(airport.getDestination().getAddress()) && destination.getCountry().equals(airport.getDestination().getCountry()))
				return new ResponseEntity("Some object is already on this location. Please, enter another location.", HttpStatus.NOT_ACCEPTABLE);
		
		AirlineAdmin user = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		for(Airport a : user.getAirline().getAirports())
			if(a.getName().equals(airport.getName()))
				return new ResponseEntity("Airport already exists in airline.", HttpStatus.FORBIDDEN);
		
		Airport result = airportRepository.findByName(airport.getName());
		Airline airline = airlineRepository.getOne(user.getAirline().getId());
		
		if(result != null)
			airline.getAirports().add(result);
		else {
			airportRepository.save(airport);
			airline.getAirports().add(airport);
		}
		
		return new ResponseEntity("Airport successfully added.", HttpStatus.CREATED);
	}
	
	public List<Airport> findAll() {
		return airportRepository.findAll();
	}
	
}
