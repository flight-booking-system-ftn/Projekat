package com.isamrs.tim14.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.Room;

@Repository
public class RoomDAOImpl implements RoomDAO{
	
	private EntityManager entityManager;
	
	@Autowired
	public RoomDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
	
	@Override
	@Transactional
	public Room save(Room room) {
		entityManager.persist(room);
		return room;
	}

	@Override
	@Transactional
	public List<Room> getRoomsSearch(Integer hotelID) {
		Query query = entityManager.createQuery("SELECT r FROM Room r WHERE r.hotel.id = :hotelId");
		query.setParameter("hotelId", hotelID);
		List<Room> result = query.getResultList();
		return result;
	}

}
