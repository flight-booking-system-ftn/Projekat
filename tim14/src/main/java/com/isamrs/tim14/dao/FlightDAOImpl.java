package com.isamrs.tim14.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.Airline;
import com.isamrs.tim14.model.Flight;
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
		
		List<Airline> result = query.getResultList();
		
		if(result.size() == 0)
			return null;
					
		return result.get(0).getFlights();
	}

	@Override
	@Transactional
	public List<Seat> getSeats(Integer id) {
		Query query = entityManager.createQuery("SELECT f FROM Flight f WHERE f.id = :flight_id");
		query.setParameter("flight_id", id);
		
		Flight flight = (Flight)query.getSingleResult();
		
		return flight.getSeats();
	}

	@Override
	@Transactional
	public ResponseEntity<List<List<Flight>>> search(FlightsSearch values) {
		List<List<Flight>> result = new ArrayList<List<Flight>>();
		
		int freeSeats;
		List<Flight> flights;
		
		for(FlightPathAndDate data : values.getData()) {
			Query query = entityManager.createQuery("SELECT f FROM Flight f WHERE f.from = :from_airport AND f.to = :to_airport AND f.luggageQuantity >= :bags");
			query.setParameter("from_airport", data.getFrom());
			query.setParameter("to_airport", data.getTo());
			query.setParameter("bags", values.getBags());
			
			flights = query.getResultList();
			List<Flight> flightResult = new ArrayList<Flight>();
			
			for(Flight flight : flights) {
				if(flight.getDepartureDate().getYear() == data.getDepartureDate().getYear() && flight.getDepartureDate().getMonth() == data.getDepartureDate().getMonth()
						&& flight.getDepartureDate().getDate() == data.getDepartureDate().getDate()) {
					freeSeats = 0;
					for(Seat seat : flight.getSeats()) {
						if(seat.getEnabled() == true && seat.getBusy() == false) {
							if(values.getSeatClass().equals("Economy") && seat.getType() == SeatType.ECONOMY) {
								freeSeats++;
								if(freeSeats >= values.getPassengers()) {
									flightResult.add(flight);
									freeSeats = 0;
									break;
								}
							} else if(values.getSeatClass().equals("Business") && seat.getType() == SeatType.BUSINESS) {
								freeSeats++;
								if(freeSeats >= values.getPassengers()) {
									flightResult.add(flight);
									freeSeats = 0;
									break;
								}
							} else if(values.getSeatClass().equals("First Class") && seat.getType() == SeatType.FIRST_CLASS) {
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
			System.out.println("ROUND TRIP, TRAZIM POVRATNI LET ZA DATUM " + values.getData().get(0).getReturnDate());
			Query query = entityManager.createQuery("SELECT f FROM Flight f WHERE f.from = :from_airport AND f.to = :to_airport AND f.luggageQuantity >= :bags");
			query.setParameter("from_airport", values.getData().get(0).getTo());
			query.setParameter("to_airport", values.getData().get(0).getFrom());
			query.setParameter("bags", values.getBags());
			
			flights = query.getResultList();
			List<Flight> returningFlightResult = new ArrayList<Flight>();
			
			for(Flight flight : flights) {
				if(flight.getDepartureDate().getYear() == values.getData().get(0).getReturnDate().getYear() && flight.getDepartureDate().getMonth() == values.getData().get(0).getReturnDate().getMonth()
						&& flight.getDepartureDate().getDate() == values.getData().get(0).getReturnDate().getDate()) {
					freeSeats = 0;
					for(Seat seat : flight.getSeats()) {
						if(seat.getEnabled() == true && seat.getBusy() == false) {
							if(values.getSeatClass().equals("Economy") && seat.getType() == SeatType.ECONOMY) {
								freeSeats++;
								if(freeSeats >= values.getPassengers()) {
									returningFlightResult.add(flight);
									freeSeats = 0;
									break;
								}
							} else if(values.getSeatClass().equals("Business") && seat.getType() == SeatType.BUSINESS) {
								freeSeats++;
								if(freeSeats >= values.getPassengers()) {
									returningFlightResult.add(flight);
									freeSeats = 0;
									break;
								}
							} else if(values.getSeatClass().equals("First Class") && seat.getType() == SeatType.FIRST_CLASS) {
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
}
