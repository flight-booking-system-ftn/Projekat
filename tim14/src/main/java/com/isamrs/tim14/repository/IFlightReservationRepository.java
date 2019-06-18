package com.isamrs.tim14.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.isamrs.tim14.model.FlightReservation;

public interface IFlightReservationRepository extends JpaRepository<FlightReservation, Integer>{

	@Query(value = "SELECT fr.* FROM flight f JOIN flight_reservation fr ON f.id = fr.flight_id WHERE f.airline_id = ?1 AND fr.user_id IS NULL AND fr.passenger_id IS NULL", nativeQuery = true)
	List<FlightReservation> findQuickReservations(Integer id);
	
}
