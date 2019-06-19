package com.isamrs.tim14.repository;

import javax.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import com.isamrs.tim14.model.VehicleReservation;

public interface IVehicleReservationRepository extends JpaRepository<VehicleReservation, Integer> {

	@Lock(LockModeType.OPTIMISTIC)
	VehicleReservation findOneById(Integer id);
	
}
