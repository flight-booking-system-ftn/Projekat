package com.isamrs.tim14.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.Hotel;
import com.isamrs.tim14.model.HotelService;

@Repository
public class HotelDAOImpl implements HotelDAO {

	private EntityManager entityManager;

	@Autowired
	public HotelDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	@Override
	@Transactional
	public List<Hotel> getHotels() {
		Query query = entityManager.createQuery("SELECT hot FROM Hotel hot");
		List<Hotel> result = query.getResultList();
		return result;
	}

	@Override
	@Transactional
	public Hotel save(Hotel hotel) {
		Query query = entityManager.createQuery("SELECT h FROM Hotel h WHERE lower(h.name) LIKE :hotelName");
		query.setParameter("hotelName", hotel.getName());
		List<Hotel> result = query.getResultList();
		if (result.size() == 0) {
			for(HotelService hs : hotel.getServices()) {
				hs.setHotel(hotel);
			}
			entityManager.persist(hotel);
			return hotel;
		} else {
			return null;
		}
	}

	@Override
	@Transactional
	public Hotel getHotel(int id) {
		Query query = entityManager.createQuery("SELECT hot FROM Hotel hot WHERE hot.id = :hotelId");
		query.setParameter("hotelId", id);
		List<Hotel> result = query.getResultList();

		if (result.size() == 0) {
			return null;
		}

		return result.get(0);
	}

	@Override
	@Transactional
	public void deleteHotel(int id) {

	}

	@Override
	@Transactional
	public List<Hotel> getHotelsSearch(String hotelName, String hotelDestination, long checkIn, long checkOut) {
		
		if(hotelName.equals("NO_INPUT")) {
			hotelName = "";
		}
		if(hotelDestination.equals("NO_INPUT")) {
			hotelDestination = "";
		}
		Query query = entityManager.createQuery("SELECT hot FROM Hotel hot WHERE hot.name LIKE :hotelName AND hot.destination.name LIKE :hotelDestination");
		query.setParameter("hotelName", "%" + hotelName + "%");
		query.setParameter("hotelDestination", "%" + hotelDestination + "%");
		List<Hotel> result = query.getResultList();
		return result;
	}

}
