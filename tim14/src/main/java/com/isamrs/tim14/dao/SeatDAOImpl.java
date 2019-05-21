package com.isamrs.tim14.dao;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.Seat;

@Repository
public class SeatDAOImpl implements SeatDAO {
	
	private EntityManager entityManager;
	
	@Autowired
	public SeatDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	@Override
	@Transactional
	public ResponseEntity<Seat> toggle(Integer id) {
		Query query = entityManager.createQuery("SELECT s FROM Seat s WHERE s.id = :seat_id");
		query.setParameter("seat_id", id);
		
		Seat seat = (Seat)query.getSingleResult();
		
		if(!seat.getBusy()) {
			seat.setEnabled(!seat.getEnabled());
			
			entityManager.merge(seat);
			
			return new ResponseEntity<Seat>(seat, HttpStatus.OK);
		} else
			return new ResponseEntity<Seat>(HttpStatus.FORBIDDEN);
	}
	
	@Override
	@Transactional
	public ResponseEntity<String> delete(Integer id) {
		Query query = entityManager.createQuery("SELECT s FROM Seat s WHERE s.id = :seat_id");
		query.setParameter("seat_id", id);
		
		Seat seat = (Seat)query.getSingleResult();
		
		if(!seat.getBusy()) {
			entityManager.remove(seat);
			
			return new ResponseEntity<String>(HttpStatus.OK);
		} else
			return new ResponseEntity<String>(HttpStatus.FORBIDDEN);
	}

	@Override
	@Transactional
	public ResponseEntity<Collection<Seat>> getSeats(Collection<Integer> seats) {
		Collection<Seat> result = new ArrayList<Seat>();
		
		for(Integer seatID : seats) {
			Query query = entityManager.createQuery("SELECT s FROM Seat s WHERE s.id = :seat_id");
			query.setParameter("seat_id", seatID);
			
			List<Seat> seat = query.getResultList();
			
			result.add(seat.get(0));
		}
		
		return new ResponseEntity(result, HttpStatus.OK);
	}

}
