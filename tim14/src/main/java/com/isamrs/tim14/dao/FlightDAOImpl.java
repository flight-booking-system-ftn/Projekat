package com.isamrs.tim14.dao;

import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.Airline;
import com.isamrs.tim14.model.Flight;
import com.isamrs.tim14.model.Seat;

@Repository
public class FlightDAOImpl implements FlightDAO {
	private EntityManager entityManager;
	
	@Autowired
	public FlightDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	@Override
	@Transactional
	public void save(Flight flight) {
		Query query = entityManager.createQuery("SELECT a FROM Airline a WHERE a.id = :airline_id");
		query.setParameter("airline_id", 1);
		
		Airline airline = (Airline)query.getSingleResult();
		flight.setAirline(airline);
		
		entityManager.persist(flight);
	}

	@Override
	@Transactional
	public Set<Flight> flightsOfAirline() {
		Query query = entityManager.createQuery("SELECT a FROM Airline a WHERE a.id = :airline_id");
		query.setParameter("airline_id", 1);
		
		Airline result = (Airline)query.getSingleResult();
		
		return result.getFlights();
	}

	@Override
	@Transactional
	public List<Seat> getSeats(Integer id) {
		Query query = entityManager.createQuery("SELECT f FROM Flight f WHERE f.id = :flight_id");
		query.setParameter("flight_id", id);
		
		Flight flight = (Flight)query.getSingleResult();
		
		return flight.getSeats();
	}
}
