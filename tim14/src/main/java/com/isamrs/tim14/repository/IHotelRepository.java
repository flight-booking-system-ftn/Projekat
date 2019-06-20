package com.isamrs.tim14.repository;

import java.util.List;

import javax.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.isamrs.tim14.model.Hotel;


public interface IHotelRepository extends JpaRepository<Hotel, Integer>{

	Hotel findOneByName(String name);
	
	@Lock(LockModeType.OPTIMISTIC)
	Hotel findOneById(Integer id);
	
	@Query(value = "select * from hotel h where h.id = ?1", nativeQuery = true)
	Hotel getHotelById(Integer id);
	
	@Query(value = "select * from hotel h where h.name like %?1%", nativeQuery = true)
	List<Hotel> findHotelByNameContain(String name);
	
}
