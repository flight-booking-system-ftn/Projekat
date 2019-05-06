package com.isamrs.tim14.dao;

import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.Airline;
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
		Query query = entityManager.createQuery("SELECT a FROM Airline a WHERE a.id = :airline_id");
		query.setParameter("airline_id", 1);
		
		Airline airline = (Airline)query.getSingleResult();
		
		for(Luggage l : airline.getLuggagePricelist()) {
			if(l.getDimensions().equals(luggage.getDimensions()) && l.getWeight() == luggage.getWeight()) {
				return new ResponseEntity<String>("Item with same values already exists.", HttpStatus.NOT_ACCEPTABLE);
			}
		}
		
		luggage.setAirline(airline);
		
		entityManager.persist(luggage);
		
		return new ResponseEntity<String>(HttpStatus.CREATED);
	}

	@Override
	@Transactional
	public Set<Luggage> getPricelist() {
		Query query = entityManager.createQuery("SELECT a FROM Airline a WHERE a.id = :airline_id");
		query.setParameter("airline_id", 1);
		
		Airline airline = (Airline)query.getSingleResult();
		
		System.out.println("PRTLJAGA IMA: " + airline.getLuggagePricelist().size());
		
		return airline.getLuggagePricelist();
	}

}
