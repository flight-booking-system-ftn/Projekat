package com.isamrs.tim14.dao;

import java.util.List;
import java.util.Set;

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
import com.isamrs.tim14.model.AirlineService;
import com.isamrs.tim14.model.Airport;
import com.isamrs.tim14.model.Flight;

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
			for(AirlineService as : airline.getServices()) {
				as.setAirline(airline);
			}
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
	public ResponseEntity<String> update(Airline airline) {
		Query query = entityManager.createQuery("SELECT a FROM Airline a WHERE lower(a.name) LIKE :airline_name AND a.destination.id = :destination_id");
		query.setParameter("airline_name", airline.getName());
		query.setParameter("destination_id", airline.getDestination().getId());
		
		List<Airline> result = query.getResultList();
		
		if(result.size() > 0)
			return new ResponseEntity("Airline with same name at the same destination already exists.", HttpStatus.FORBIDDEN);
		
		AirlineAdmin user = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Airline managedAirline = entityManager.find(Airline.class, user.getAirline().getId());

		managedAirline.setName(airline.getName());
		managedAirline.setDestination(airline.getDestination());
		managedAirline.setDescription(airline.getDescription());

		return new ResponseEntity("Airline informations successfully updated.", HttpStatus.OK);
	}

	@Override
	@Transactional
	public List<Airline> search(String airlineName) {
		Query query = entityManager.createQuery("SELECT a FROM Airline a WHERE a.name LIKE :airline_name");
		query.setParameter("airline_name", "%" + airlineName + "%");
		
		return query.getResultList();
	}

	@Override
	@Transactional
	public ResponseEntity<List<Airport>> getAirports(Integer id) {
		Query query = entityManager.createQuery("SELECT a FROM Airline a WHERE a.id = :airline_id");
		query.setParameter("airline_id", id);
		
		List<Airline> result = query.getResultList();
		return new ResponseEntity(result.get(0).getAirports(), HttpStatus.OK);
	}
	
	@Override
	@Transactional
	public ResponseEntity<Set<Flight>> getFlightsOfAirline() {
		AirlineAdmin user = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
					
		return new ResponseEntity(user.getAirline().getFlights(), HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<List<Airport>> getAirportsOfAirline() {
		AirlineAdmin user = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		if(user.getAirline().getAirports().size() == 0)
			return new ResponseEntity("No airports were found.", HttpStatus.NOT_FOUND);
		else
			return new ResponseEntity(user.getAirline().getAirports(), HttpStatus.OK);
	}

}
