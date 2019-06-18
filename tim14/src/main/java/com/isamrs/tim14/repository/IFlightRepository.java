package com.isamrs.tim14.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.isamrs.tim14.model.Flight;

public interface IFlightRepository extends JpaRepository<Flight, Integer> {

	@Query(value = "SELECT * FROM Flight f WHERE f.start_airport_id = ?1 AND f.end_airport_id = ?2 AND f.luggage_quantity >= ?3 AND f.flight_duration <= ?4", nativeQuery = true)
	List<Flight> findGlobalFlights(Integer from, Integer to, Integer bags, Double duration);
	
	@Query(value = "SELECT * FROM Flight f WHERE f.airline_id = ?1 AND f.start_airport_id = ?2 AND f.end_airport_id = ?3 AND f.luggage_quantity >= ?4 AND f.flight_duration <= ?5", nativeQuery = true)
	List<Flight> findFlightsByAirline(Integer airlineID, Integer from, Integer to, Integer bags, Double duration);
	
}
