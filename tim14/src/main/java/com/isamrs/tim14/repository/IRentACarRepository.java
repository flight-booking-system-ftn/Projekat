package com.isamrs.tim14.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.isamrs.tim14.model.RentACar;

@RepositoryRestResource(path = "rentacars")
public interface IRentACarRepository extends JpaRepository<RentACar, Integer>{
	RentACar getRentACarById(Integer id);
}
