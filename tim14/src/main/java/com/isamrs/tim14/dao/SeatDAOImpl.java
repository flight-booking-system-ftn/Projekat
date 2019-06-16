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
		
		List<Seat> result = query.getResultList();
		
		if(!result.get(0).getBusy()) {
			Seat managedSeat = entityManager.find(Seat.class, result.get(0).getId());
			managedSeat.setEnabled(!managedSeat.getEnabled());
			
			return new ResponseEntity<Seat>(managedSeat, HttpStatus.OK);
		} else
			return new ResponseEntity<Seat>(HttpStatus.FORBIDDEN);
	}
	
	@Override
	@Transactional
	public ResponseEntity<String> delete(Integer id) {
		Query query = entityManager.createQuery("SELECT s FROM Seat s WHERE s.id = :seat_id");
		query.setParameter("seat_id", id);
		
		List<Seat> result = query.getResultList();
		
		if(!result.get(0).getBusy()) {
			entityManager.remove(result.get(0));
			
			return new ResponseEntity<String>("Seat successfully deleted.", HttpStatus.OK);
		} else
			return new ResponseEntity<String>("Reserved seat can't be deleted.", HttpStatus.FORBIDDEN);
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

	@Override
	@Transactional
	public ResponseEntity<Seat> getSeat(Integer id) {
		Seat managedSeat = entityManager.find(Seat.class, id);
		
		return new ResponseEntity<Seat>(managedSeat, HttpStatus.OK);
	}

}
