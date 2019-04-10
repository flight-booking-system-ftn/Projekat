package com.isamrs.tim14.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.isamrs.tim14.model.Flight;

public interface IFlightRepository extends JpaRepository<Flight, Integer> {

}
