package com.isamrs.tim14.repository;

import java.util.Date;

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
	
	@Query(value = "SELECT rr.* FROM room_reservation rr JOIN rooms_reservations rrs ON rrs.reservation_id = rr.id WHERE rrs.room_id = ?1 AND rr.start >= ?2 AND rr.end <= ?3", nativeQuery = true)
	RoomReservation getReservation(Integer id, Date start, Date end);
	
}
