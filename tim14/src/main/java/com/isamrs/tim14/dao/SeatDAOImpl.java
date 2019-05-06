package com.isamrs.tim14.dao;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.model.Seat;

@RestController
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

}
