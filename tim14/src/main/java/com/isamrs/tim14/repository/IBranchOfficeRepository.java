package com.isamrs.tim14.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.isamrs.tim14.model.BranchOffice;

public interface IBranchOfficeRepository extends JpaRepository<BranchOffice, Integer> {

	List<BranchOffice> findByName(String name);
	
	@Query(value = "SELECT * FROM branch_office bo WHERE bo.rent_a_car_id = ?1", nativeQuery = true)
	List<BranchOffice> findByRent(Integer id);
	
}
