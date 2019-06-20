package com.isamrs.tim14.repository;

import javax.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import com.isamrs.tim14.model.Destination;

public interface IDestinationRepository extends JpaRepository<Destination, Integer>{

	@Lock(LockModeType.OPTIMISTIC)
	Destination findOneById(Integer id);
	
	
	
}
