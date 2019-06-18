package com.isamrs.tim14.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.isamrs.tim14.model.Airline;

public interface IAirlineRepository extends JpaRepository<Airline, Integer>{

	Airline findOneByName(String name);
	
	@Query(value = "select * from airline a where a.name like ?1 and a.name not like ?2", nativeQuery = true)
	Airline findOneByNameAndNotName(String newName, String oldName);
	
	@Query(value = "select * from airline a where a.name like %?1%", nativeQuery = true)
	List<Airline> findByName(String airlineName);
	
}
