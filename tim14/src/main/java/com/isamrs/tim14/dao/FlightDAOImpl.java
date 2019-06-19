package com.isamrs.tim14.dao;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.AirlineAdmin;
import com.isamrs.tim14.model.Flight;
import com.isamrs.tim14.model.Grade;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.Seat;
import com.isamrs.tim14.model.SeatType;
import com.isamrs.tim14.others.FlightPathAndDate;
import com.isamrs.tim14.others.FlightsSearch;

@Repository
public class FlightDAOImpl implements FlightDAO {
	private EntityManager entityManager;
	
	@Autowired
	public FlightDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	@Override
	@Transactional
	public ResponseEntity<String> save(Flight flight) {
		AirlineAdmin user = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		flight.setAirline(user.getAirline());
		
		entityManager.persist(flight);
		
		return new ResponseEntity("Flight successully added.", HttpStatus.CREATED);
	}

	@Override
	@Transactional
	public ResponseEntity<List<Seat>> getSeats(Integer id) {
		Query query = entityManager.createQuery("SELECT f FROM Flight f WHERE f.id = :flight_id");
		query.setParameter("flight_id", id);
		
		Flight flight = (Flight)query.getSingleResult();
		
		return new ResponseEntity(flight.getSeats(), HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<List<List<Flight>>> search(FlightsSearch values) {
		List<List<Flight>> result = new ArrayList<List<Flight>>();
		
		int freeSeats;
		List<Flight> flights;
		
		for(FlightPathAndDate data : values.getData()) {
			Query query = null;
			
			if(values.getAirlineID() == -999)
				query = entityManager.createQuery("SELECT f FROM Flight f WHERE f.from = :from_airport AND f.to = :to_airport AND f.luggageQuantity >= :bags AND f.flightDuration <= :flight_duration");
			else {
				query = entityManager.createQuery("SELECT f FROM Flight f WHERE f.airline.id = :airline_id AND f.from = :from_airport AND f.to = :to_airport AND f.luggageQuantity >= :bags AND f.flightDuration <= :flight_duration");
				query.setParameter("airline_id", values.getAirlineID());
			}
			query.setParameter("from_airport", data.getFrom());
			query.setParameter("to_airport", data.getTo());
			query.setParameter("bags", values.getBags());
			query.setParameter("flight_duration", values.getDurationRange());
			
			flights = query.getResultList();
			List<Flight> flightResult = new ArrayList<Flight>();
			
			for(Flight flight : flights) {
				if(flight.getDepartureDate().getYear() == data.getDepartureDate().getYear() && flight.getDepartureDate().getMonth() == data.getDepartureDate().getMonth()
						&& flight.getDepartureDate().getDate() == data.getDepartureDate().getDate()) {
					freeSeats = 0;
					for(Seat seat : flight.getSeats()) {
						if(seat.getEnabled() == true && seat.getBusy() == false) {
							if(values.getSeatClass().equals("Economy") && seat.getType() == SeatType.ECONOMY && flight.getTicketPriceEconomyClass() <= values.getPriceRange()) {
								freeSeats++;
								if(freeSeats >= values.getPassengers()) {
									flightResult.add(flight);
									freeSeats = 0;
									break;
								}
							} else if(values.getSeatClass().equals("Business") && seat.getType() == SeatType.BUSINESS && flight.getTicketPriceBusinessClass() <= values.getPriceRange()) {
								freeSeats++;
								if(freeSeats >= values.getPassengers()) {
									flightResult.add(flight);
									freeSeats = 0;
									break;
								}
							} else if(values.getSeatClass().equals("First Class") && seat.getType() == SeatType.FIRST_CLASS && flight.getTicketPriceFirstClass() <= values.getPriceRange()) {
								freeSeats++;
								if(freeSeats >= values.getPassengers()) {
									flightResult.add(flight);
									freeSeats = 0;
									break;
								}
							}
						}
					}
				}
			}
			
			if(flightResult.size() == 0)
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			
			result.add(flightResult);
		}
		
		if(values.getTripType().equals("Round trip")) {
			Query query = null;
			
			if(values.getAirlineID() == -999)
				query = entityManager.createQuery("SELECT f FROM Flight f WHERE f.from = :from_airport AND f.to = :to_airport AND f.luggageQuantity >= :bags AND f.flightDuration <= :flight_duration");
			else {
				query = entityManager.createQuery("SELECT f FROM Flight f WHERE f.airline.id = :airline_id AND f.from = :from_airport AND f.to = :to_airport AND f.luggageQuantity >= :bags AND f.flightDuration <= :flight_duration");
				query.setParameter("airline_id", values.getAirlineID());
			}
			query.setParameter("from_airport", values.getData().get(0).getTo());
			query.setParameter("to_airport", values.getData().get(0).getFrom());
			query.setParameter("bags", values.getBags());
			query.setParameter("flight_duration", values.getDurationRange());
			
			flights = query.getResultList();
			List<Flight> returningFlightResult = new ArrayList<Flight>();
			
			for(Flight flight : flights) {
				if(flight.getDepartureDate().getYear() == values.getData().get(0).getReturnDate().getYear() && flight.getDepartureDate().getMonth() == values.getData().get(0).getReturnDate().getMonth()
						&& flight.getDepartureDate().getDate() == values.getData().get(0).getReturnDate().getDate()) {
					freeSeats = 0;
					for(Seat seat : flight.getSeats()) {
						if(seat.getEnabled() == true && seat.getBusy() == false) {
							if(values.getSeatClass().equals("Economy") && seat.getType() == SeatType.ECONOMY && flight.getTicketPriceEconomyClass() <= values.getPriceRange()) {
								freeSeats++;
								if(freeSeats >= values.getPassengers()) {
									returningFlightResult.add(flight);
									freeSeats = 0;
									break;
								}
							} else if(values.getSeatClass().equals("Business") && seat.getType() == SeatType.BUSINESS && flight.getTicketPriceBusinessClass() <= values.getPriceRange()) {
								freeSeats++;
								if(freeSeats >= values.getPassengers()) {
									returningFlightResult.add(flight);
									freeSeats = 0;
									break;
								}
							} else if(values.getSeatClass().equals("First Class") && seat.getType() == SeatType.FIRST_CLASS && flight.getTicketPriceFirstClass() <= values.getPriceRange()) {
								freeSeats++;
								if(freeSeats >= values.getPassengers()) {
									returningFlightResult.add(flight);
									freeSeats = 0;
									break;
								}
							}
						}
					}
				}
			}
			
			if(returningFlightResult.size() == 0)
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			
			result.add(returningFlightResult);
		}
		
		return new ResponseEntity(result, HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<Flight> getFlight(Integer id) {
		Query query = entityManager.createQuery("SELECT f FROM Flight f WHERE f.id = :flight_id");
		query.setParameter("flight_id", id);
		
		List<Flight> result = query.getResultList();
		
		return new ResponseEntity(result.get(0), HttpStatus.OK);
	}
	
	@Override
	@Transactional
	public Integer getGrade(Integer id) {
		Flight flight = entityManager.find(Flight.class, id);
		RegisteredUser ru =(RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		for(Grade g : flight.getGrades()) {
			if(g.getUser().getEmail().equals(ru.getEmail())) {
				return g.getGrade();
			}
		}
		return 0;
	}

	@Override
	@Transactional
	public void setGrade(Integer id, Integer grade) {
		Flight flight = entityManager.find(Flight.class, id);
		RegisteredUser ru =(RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		for(Grade g : flight.getGrades()) {
			if(g.getUser().getEmail().equals(ru.getEmail())) {
				g.setGrade(grade);
				return;
				}
		}
		Grade g = new Grade();
		g.setGrade(grade);
		g.setUser(ru);
		entityManager.persist(g);
		flight.getGrades().add(g);	
	}
	
	@Override
	@Transactional
	public Integer getIntermediateGrade(Integer id) {
		Flight flight = entityManager.find(Flight.class, id);
		int sum = 0;
		int count = 0;
		for(Grade g : flight.getGrades()) {
			sum+= g.getGrade();
			count++;
		}
		if(count==0)
			return 0;
		else
			return sum/count;
	}
}
