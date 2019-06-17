package com.isamrs.tim14.dao;

import java.util.ArrayList;
import java.util.Date;
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
import com.isamrs.tim14.model.Destination;
import com.isamrs.tim14.model.Flight;
import com.isamrs.tim14.model.FlightReservation;
import com.isamrs.tim14.model.Grade;
import com.isamrs.tim14.model.Luggage;
import com.isamrs.tim14.model.RegisteredUser;

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
		AirlineAdmin user = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Query query = null;
		
		if(airline.getName().equals(user.getAirline().getName())) {
			query = entityManager.createQuery("SELECT d FROM Destination d");
			
			List<Destination> destinations = query.getResultList();
			
			for(Destination destination : destinations)
				if(destination.getName().equals(airline.getDestination().getName()) && destination.getAddress().equals(airline.getDestination().getAddress()) && destination.getCountry().equals(airline.getDestination().getCountry())
						&& !airline.getDestination().getName().equals(user.getAirline().getDestination().getName()) && !airline.getDestination().getCountry().equals(user.getAirline().getDestination().getCountry()) && !airline.getDestination().getAddress().equals(user.getAirline().getDestination().getAddress()))
					return new ResponseEntity("Some object is already on this location. Please, enter another location.", HttpStatus.NOT_ACCEPTABLE);
		} else {
			query = entityManager.createQuery("SELECT a FROM Airline a WHERE lower(a.name) LIKE :airline_name AND lower(a.name) NOT LIKE :admin_airline_name");
			query.setParameter("airline_name", airline.getName());
			query.setParameter("admin_airline_name", user.getAirline().getName());
			
			List<Airline> result = query.getResultList();
			
			if(result.size() > 0)
				return new ResponseEntity("Airline with same name already exists.", HttpStatus.NOT_ACCEPTABLE);
		}
		
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
	
	@Override
	@Transactional
	public List<Airline> getAirlinesFromReservations() {
		ArrayList<Airline> all = new ArrayList<Airline>();
		RegisteredUser u = ((RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
		for (FlightReservation fr: u.getFlightReservations()) {
				if (!(all.contains(fr.getFlight().getAirline())))
					all.add(fr.getFlight().getAirline());
				}
			//}
		return all;
	}
	
	@Override
	@Transactional
	public Integer getGrade(Integer id) {
		Airline airline = entityManager.find(Airline.class, id);
		RegisteredUser ru =(RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		for(Grade g : airline.getGrades()) {
			System.out.println(g.getUser().getEmail());
			System.out.println("****"+ru.getEmail());
			if(g.getUser().getEmail().equals(ru.getEmail())) {
				return g.getGrade();
			}
		}
		return 0;
	}

	@Override
	@Transactional
	public void setGrade(Integer id, Integer grade) {
		Airline airline = entityManager.find(Airline.class, id);
		RegisteredUser ru =(RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		for(Grade g : airline.getGrades()) {
			if(g.getUser().getEmail().equals(ru.getEmail())) {
				g.setGrade(grade);
				return;
				}
		}
		Grade g = new Grade();
		g.setGrade(grade);
		g.setUser(ru);
		entityManager.persist(g);
		airline.getGrades().add(g);
	}

	@Override
	@Transactional
	public ResponseEntity<List<Airport>> getAllAirportsOfAirline() {
		Query query = entityManager.createQuery("SELECT a FROM Airport a");
		return new ResponseEntity(query.getResultList(), HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<Airline> getAirline() {
		AirlineAdmin user = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		return new ResponseEntity<Airline>(user.getAirline(), HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<Set<Luggage>> getLuggagePricelist(Integer id) {
		Flight managedFlight = entityManager.find(Flight.class, id);
		
		return new ResponseEntity<Set<Luggage>>(managedFlight.getAirline().getLuggagePricelist(), HttpStatus.OK);
	}

	@Override
	@Transactional
	public Integer getGradeAirline() {
		AirlineAdmin admin =(AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		int sum = 0;
		int count = 0;
		for(Grade g : admin.getAirline().getGrades()) {
			sum+=g.getGrade();
			count++;
		}
		if(count==0)
			return 0;
		else
			return sum/count;
	}
	
	@Override
	public double getIncome(Date start, Date end) {
		Query query = entityManager.createQuery("SELECT fr FROM FlightReservation fr");
		List<FlightReservation> reservations = query.getResultList();
		AirlineAdmin admin = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		int sum = 0;
		for(FlightReservation fr: reservations) {
			if(fr.getFlight().getAirline().getId()==admin.getAirline().getId()) {
				if(fr.getFlight().getArrivalDate().before(end) && fr.getFlight().getDepartureDate().after(start)) {
					sum +=  fr.getPrice() - fr.getPrice()*fr.getDiscount()/100;
				}
			}
		}
		return sum;
	}
}