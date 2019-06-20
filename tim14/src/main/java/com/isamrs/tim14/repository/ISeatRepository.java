package com.isamrs.tim14.repository;

import javax.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import com.isamrs.tim14.model.Seat;

public interface ISeatRepository extends JpaRepository<Seat, Integer> {
	
	@Lock(LockModeType.PESSIMISTIC_READ)
	Seat findOneById(Integer id);

}
