package com.isamrs.tim14.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

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
	public Airport save(Airport airport) {
		Query query = entityManager.createQuery("SELECT a FROM Airport a WHERE a.name = :airport_name AND a.destination = :airport_destination");
		query.setParameter("airport_name", airport.getName());
		query.setParameter("airport_destination", airport.getDestination());

		List<Airport> airports = query.getResultList();

		if(airports.size() > 0) {
			return null;
		}
		
		entityManager.persist(airport);
		return airport;
	}

	@Override
	@Transactional
	public List<Airport> getAll() {
		Query query = entityManager.createQuery("SELECT a FROM Airport a");
		
		return query.getResultList();
	}
}
