package com.isamrs.tim14.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.HotelService;

@Repository
public class HotelServiceDAOImpl implements HotelServiceDAO{

	private EntityManager entityManager;

	@Autowired
	public HotelServiceDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
	
	@Override	
	@Transactional
	public List<HotelService> getHotelServicesSearch(Integer hotelID) {
		Query query = entityManager.createQuery("SELECT s FROM HotelService s WHERE s.hotel.id = :hotelId");
		query.setParameter("hotelId", hotelID);
		List<HotelService> result = query.getResultList();
		return result;
	}

}
