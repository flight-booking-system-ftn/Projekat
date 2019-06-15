package com.isamrs.tim14.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.Airline;
import com.isamrs.tim14.model.AirlineAdmin;
import com.isamrs.tim14.model.Airport;
import com.isamrs.tim14.model.Destination;

@Repository
public class AirportDAOImpl implements AirportDAO {
	private EntityManager entityManager;

	@Autowired
	public AirportDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	@Override
	@Transactional
	public ResponseEntity<String> save(Airport airport) {
		Query query = entityManager.createQuery("SELECT d FROM Destination d");
		List<Destination> destinations = query.getResultList();
		
		for(Destination destination : destinations)
			if(destination.getName().equals(airport.getDestination().getName()) && destination.getAddress().equals(airport.getDestination().getAddress()) && destination.getCountry().equals(airport.getDestination().getCountry()))
				return new ResponseEntity("Some object is already on this location. Please, enter another location.", HttpStatus.NOT_ACCEPTABLE);
		
		AirlineAdmin user = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		for(Airport a : user.getAirline().getAirports())
			if(a.getName().equals(airport.getName()))
				return new ResponseEntity("Airport already exists in airline.", HttpStatus.FORBIDDEN);
		
		query = entityManager.createQuery("SELECT a FROM Airport a WHERE a.name = :airport_name");
		query.setParameter("airport_name", airport.getName());
		
		List<Airport> result = query.getResultList();
		Airline managedAirline = entityManager.find(Airline.class, user.getAirline().getId());
		
		if(result.size() > 0)
			managedAirline.getAirports().add(result.get(0));
		else {
			entityManager.persist(airport);
			managedAirline.getAirports().add(airport);
		}
		
		return new ResponseEntity("Airport successfully added.", HttpStatus.CREATED);
	}

	@Override
	@Transactional
	public ResponseEntity<List<Airport>> getAll() {
		Query query = entityManager.createQuery("SELECT a FROM Airport a");
		List<Airport> result = query.getResultList();
		
		if(result.size() == 0)
			return new ResponseEntity("No airports were found.", HttpStatus.NOT_FOUND);
		else
			return new ResponseEntity(result, HttpStatus.OK);
	}
}
