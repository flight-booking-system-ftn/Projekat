package com.isamrs.tim14.repository;

import java.util.Date;

import javax.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.isamrs.tim14.model.VehicleReservation;

public interface IVehicleReservationRepository extends JpaRepository<VehicleReservation, Integer> {

	@Lock(LockModeType.OPTIMISTIC)
	VehicleReservation findOneById(Integer id);
	
	@Query(value = "SELECT vr.* FROM vehicle_reservation vr JOIN vehicles_reservations vrs ON vrs.reservation_id = vr.id WHERE vrs.vehicle_id = ?1 AND vr.start >= ?2 AND vr.end <= ?3", nativeQuery = true)
	VehicleReservation getReservation(Integer id, Date start, Date end);
	
}
