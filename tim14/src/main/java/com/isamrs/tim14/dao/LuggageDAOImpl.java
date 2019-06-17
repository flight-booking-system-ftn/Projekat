package com.isamrs.tim14.dao;

import java.util.Set;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.AirlineAdmin;
import com.isamrs.tim14.model.Luggage;

@Repository
public class LuggageDAOImpl implements LuggageDAO {
	
	private EntityManager entityManager;
	
	@Autowired
	public LuggageDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	@Override
	@Transactional
	public ResponseEntity<String> add(Luggage luggage) {
		AirlineAdmin user = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		for(Luggage l : user.getAirline().getLuggagePricelist()) {
			if(l.getDimensions().equals(luggage.getDimensions()) && l.getWeight() == luggage.getWeight()) {
				return new ResponseEntity<String>("Item with same values already exists.", HttpStatus.NOT_ACCEPTABLE);
			}
		}
		
		luggage.setAirline(user.getAirline());
		
		entityManager.persist(luggage);
		
		return new ResponseEntity<String>("Item successfully added.", HttpStatus.CREATED);
	}

	@Override
	@Transactional
	public ResponseEntity<Set<Luggage>> getPricelist() {
		System.out.println("ULOGOVANI ADMIN:");
		AirlineAdmin user = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		return new ResponseEntity(user.getAirline().getLuggagePricelist(), HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<Luggage> getLuggage(Integer id) {
		Luggage managedLuggage = entityManager.find(Luggage.class, id);
		
		return new ResponseEntity<Luggage>(managedLuggage, HttpStatus.OK);
	}

}
