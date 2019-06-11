package com.isamrs.tim14.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.Hotel;
import com.isamrs.tim14.model.HotelAdmin;
import com.isamrs.tim14.model.HotelService;
import com.isamrs.tim14.model.Room;

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

	@Override
	@Transactional
	public HotelService save(HotelService service) {
		HotelAdmin admin = (HotelAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		service.setHotel(admin.getHotel());
		boolean check = true;
		for(HotelService hs : admin.getHotel().getServices()) {
			if(hs.getName().equals(service.getName())) {
				check = false;
				break;
			}
		}
		if(check) {
			Hotel managedHotel = entityManager.find(Hotel.class, admin.getHotel().getId());
			managedHotel.getServices().add(service);
			entityManager.persist(service);
			return service;
		}
		
		return null;
	}

}
