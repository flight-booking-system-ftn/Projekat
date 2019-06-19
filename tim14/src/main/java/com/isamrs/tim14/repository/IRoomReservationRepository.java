package com.isamrs.tim14.repository;

import javax.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.isamrs.tim14.model.RoomReservation;

public interface IRoomReservationRepository extends JpaRepository<RoomReservation, Integer>{

	@Lock(LockModeType.OPTIMISTIC)
	RoomReservation findOneById(Integer id);
	
	@Query(value = "select * from room_reservation r where r.id = ?1", nativeQuery = true)
	RoomReservation getReservationById(Integer id);
	
}
