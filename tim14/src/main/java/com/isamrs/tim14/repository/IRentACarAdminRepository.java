package com.isamrs.tim14.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.isamrs.tim14.model.RentACarAdmin;

public interface IRentACarAdminRepository extends JpaRepository<RentACarAdmin, Integer>{

	@Query(value = "SELECT * FROM User u WHERE u.rent_a_car_id IS NOT NULL", nativeQuery = true)
	List<RentACarAdmin> findAll();
	
	RentACarAdmin findOneByUsernameAndEmail(String username, String email);
	
}
