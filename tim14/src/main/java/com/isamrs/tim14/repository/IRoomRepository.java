package com.isamrs.tim14.repository;

import java.util.List;

import javax.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.isamrs.tim14.model.Room;

public interface IRoomRepository extends JpaRepository<Room, Integer>{

	@Query(value = "select * from room r where r.id = ?1", nativeQuery = true)
	Room getRoomById(Integer id);
	
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	Room findOneById(Integer id);
	
	@Query(value = "select * from room r where r.hotel_id = ?1 and r.room_number = ?2", nativeQuery = true)
	Room findRoomByHotelIdAndRoomNumber(Integer hotelId, Integer roomNumber);
	
	@Query(value = "select * from room r where r.hotel_id = ?1 and (r.bed_number = ?2 or r.bed_number = ?3 or r.bed_number = ?4)", nativeQuery = true)
	List<Room> findRoomsByBedNumbers(Integer hotelId, Integer bed2, Integer bed3, Integer bed4);
	
	@Query(value = "select * from room r where (r.price between ?4 and ?5) and (r.bed_number = ?1 or r.bed_number = ?2 or r.bed_number = ?3)", nativeQuery = true)
	List<Room> findRoomsByBedNumbersAndPrice(Integer bed2, Integer bed3, Integer bed4, Double minPrice, Double maxPrice);
	
}
