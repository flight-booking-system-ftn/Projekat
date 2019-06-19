package com.isamrs.tim14.repository;

import java.util.List;

import javax.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.isamrs.tim14.model.Vehicle;

public interface IVehicleRepository extends JpaRepository<Vehicle, Integer> {
	
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	Vehicle findOneById(Integer id);
	
	@Query(value = "select * from vehicle v where v.rent_a_car_id = ?1 and (v.type = ?2 or v.type = ?3)", nativeQuery = true)
	List<Vehicle> findVehiclesByTypes(Integer rentID, String carType, String motoType);
	
	@Query(value = "select * from vehicle v where (v.type = ?1 or v.type = ?2) and (v.price between ?3 and ?4)", nativeQuery = true)
	List<Vehicle> findVehiclesByTypesAndPrice(String carType, String motoType, Double minPrice, Double maxPrice);

}