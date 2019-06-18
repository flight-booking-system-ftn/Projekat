package com.isamrs.tim14.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.isamrs.tim14.model.RoomReservation;

public interface IRoomReservationRepository extends JpaRepository<RoomReservation, Integer>{

	RoomReservation findOneById(Integer id);
	
}
