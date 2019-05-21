package com.isamrs.tim14.dao;

import java.util.Collection;

import org.springframework.http.ResponseEntity;

import com.isamrs.tim14.model.Seat;

public interface SeatDAO {

	public ResponseEntity<Seat> toggle(Integer id);
	
	public ResponseEntity<String> delete(Integer id);
	
	public ResponseEntity<Collection<Seat>> getSeats(Collection<Integer> seats);
}
