package com.isamrs.tim14.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.isamrs.tim14.model.Vehicle;

public interface IVehicleRepository extends JpaRepository<Vehicle, Integer>{

}