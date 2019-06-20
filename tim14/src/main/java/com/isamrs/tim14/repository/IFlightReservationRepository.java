package com.isamrs.tim14.repository;

import java.util.List;

import javax.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.isamrs.tim14.model.FlightReservation;

public interface IFlightReservationRepository extends JpaRepository<FlightReservation, Integer>{

	@Query(value = "SELECT fr.* FROM flight f JOIN flight_reservation fr ON f.id = fr.flight_id WHERE f.airline_id = ?1 AND fr.user_id IS NULL AND fr.passenger_id IS NULL", nativeQuery = true)
	List<FlightReservation> findQuickReservations(Integer id);
	
	@Lock(LockModeType.OPTIMISTIC)
	FlightReservation findOneById(Integer id);
	
	@Query(value = "select * from flight_reservation fr where fr.seat_id = ?1", nativeQuery = true)
	FlightReservation findOneBySeat(Integer id);
	
	@Query(value = "select * from flight_reservation fr where fr.vehicle_reservation = ?1", nativeQuery = true)
	List<FlightReservation> findReservationsByVehicleReservation(Integer id);
	
	@Query(value = "select * from flight_reservation fr where fr.room_reservation = ?1", nativeQuery = true)
	List<FlightReservation> findReservationsByRoomReservation(Integer id);
	
}
