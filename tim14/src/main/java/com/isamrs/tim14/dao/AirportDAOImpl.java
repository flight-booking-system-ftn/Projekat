package com.isamrs.tim14.dao;

import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.Airline;
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
		Query query = entityManager.createQuery("SELECT a FROM Airline a WHERE a.id = :airline_id");
		query.setParameter("airline_id", 1);

		Airline result = (Airline) query.getSingleResult();

		System.out.println(result.getName());

		boolean exists = false;
		for (Airport a : result.getAirports()) {
			if (a.getName().toLowerCase().equals(airport.getName().toLowerCase()) && a.getAddress().toLowerCase().equals(airport.getAddress().toLowerCase())) {
				exists = true;
				break;
			}
		}

		if (!exists) {
			result.getAirports().add(airport);
			entityManager.persist(airport);
			entityManager.persist(result);

			return airport;
		} else
			return null;
	}

	@Override
	@Transactional
	public Set<Airport> airportsOfAirline() {
		Query query = entityManager.createQuery("SELECT a FROM Airline a WHERE a.id = :airline_id");
		query.setParameter("airline_id", 1);

		Airline result = (Airline) query.getSingleResult();

		return result.getAirports();
	}
}
