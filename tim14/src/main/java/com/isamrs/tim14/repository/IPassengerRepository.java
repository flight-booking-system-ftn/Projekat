package com.isamrs.tim14.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.isamrs.tim14.model.Passenger;

public interface IPassengerRepository extends JpaRepository<Passenger, Integer>{

}
