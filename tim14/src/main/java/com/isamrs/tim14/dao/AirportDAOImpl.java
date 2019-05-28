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
		AirlineAdmin user = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		for(Airport a : user.getAirline().getAirports())
			if(a.getName().equals(airport.getName()) && a.getDestination().getId() == airport.getDestination().getId())
				return new ResponseEntity("Airport already exists in airline.", HttpStatus.FORBIDDEN);
		
		Query query = entityManager.createQuery("SELECT a FROM Airport a WHERE a.name = :airport_name AND a.destination.id = :destination_id");
		query.setParameter("airport_name", airport.getName());
		query.setParameter("destination_id", airport.getDestination().getId());
		
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
