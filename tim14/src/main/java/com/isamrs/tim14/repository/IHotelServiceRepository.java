package com.isamrs.tim14.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.isamrs.tim14.model.HotelService;

public interface IHotelServiceRepository extends JpaRepository<HotelService, Integer>{

	HotelService findOneById(Integer id);
	
	@Query(value = "select * from hotel_service hs where hs.hotel_id = ?1", nativeQuery = true)
	List<HotelService> findServicesByHotelID(Integer hotelId);
}
