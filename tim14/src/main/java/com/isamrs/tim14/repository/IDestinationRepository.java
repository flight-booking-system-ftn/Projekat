package com.isamrs.tim14.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.isamrs.tim14.model.Destination;

public interface IDestinationRepository extends JpaRepository<Destination, Integer>{

	Destination findOneById(Integer id);
}
