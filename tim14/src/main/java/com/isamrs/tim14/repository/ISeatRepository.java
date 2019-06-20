package com.isamrs.tim14.repository;

import java.util.List;

import javax.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.isamrs.tim14.model.Seat;

public interface ISeatRepository extends JpaRepository<Seat, Integer> {
	
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT s FROM Seat s WHERE s.id IN :ids")
	List<Seat> findAllSeats(Integer[] ids);

}
