package com.isamrs.tim14.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.isamrs.tim14.model.VehicleReservation;

public interface IVehicleReservationRepository extends JpaRepository<VehicleReservation, Integer> {

}
