package com.isamrs.tim14.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.isamrs.tim14.model.BranchOffice;
import com.isamrs.tim14.model.RentACar;

@RepositoryRestResource(path = "rentacars")
public interface IRentACarRepository extends JpaRepository<RentACar, Integer>{
	
	RentACar findOneByName(String name);
	
	List<RentACar> findByNameContaining(String name);
	
	@Query(value = "SELECT * FROM branch_office bo WHERE bo.rent_a_car_id = ?1", nativeQuery = true)
	Set<BranchOffice> findByRent(Integer id);
	
}
