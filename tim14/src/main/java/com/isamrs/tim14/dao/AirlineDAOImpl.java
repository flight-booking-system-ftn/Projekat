package com.isamrs.tim14.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.Airline;

@Repository
public class AirlineDAOImpl implements AirlineDAO {

	private EntityManager entityManager;

	@Autowired
	public AirlineDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	@Override
	@Transactional
	public List<Airline> getAirlines() {
		Query query = entityManager.createQuery("SELECT air FROM Airline air");
		List<Airline> result = query.getResultList();
		return result;
	}

	@Override
	@Transactional
	public Airline getAirline(int id) {
		Query query = entityManager.createQuery("SELECT air FROM Airline air WHERE air.id = :airlineId");
		query.setParameter("airlineId", id);
		List<Airline> result = query.getResultList();

		if (result.size() == 0) {
			return null;
		}

		return result.get(0);
	}

	@Override
	@Transactional
	public Airline save(Airline airline) {
		Query query = entityManager.createQuery("SELECT air FROM Airline air WHERE lower(air.name) LIKE :airlineName");
		query.setParameter("airlineName", airline.getName());
		List<Airline> result = query.getResultList();

		if (result.size() == 0) {
			entityManager.persist(airline);
			return airline;
		} else {
			return null;
		}
	}

	@Override
	public void deleteAirline(int id) {
		// TODO Auto-generated method stub

	}

	@Override
	@Transactional
	public Airline update(Airline airline) {
		Query query = entityManager.createQuery("SELECT a FROM Airline a WHERE a.id = :airline_id");
		query.setParameter("airline_id", 1);

		Airline result = (Airline) query.getSingleResult();

		result.setName(airline.getName());
		// result.setDestination(airline.getDestination());
		result.setDescription(airline.getDescription());

		entityManager.merge(result);

		return airline;
	}

	@Override
	@Transactional
	public List<Airline> search(String airlineName) {
		Query query = entityManager.createQuery("SELECT a FROM Airline a WHERE a.name LIKE :airline_name");
		query.setParameter("airline_name", "%" + airlineName + "%");
		List<Airline> result = query.getResultList();
		return result;
	}

}
