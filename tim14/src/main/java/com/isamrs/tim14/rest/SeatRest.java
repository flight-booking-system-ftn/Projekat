package com.isamrs.tim14.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dao.SeatDAO;
import com.isamrs.tim14.model.Seat;

@RestController
@RequestMapping("/seats")
public class SeatRest {

	private SeatDAO seatDAO;

	@Autowired
	public SeatRest(SeatDAO seatDAO) {
		super();
		this.seatDAO = seatDAO;
	}
	
	@PutMapping("/toggle/{id}")
	public ResponseEntity<Seat> toggleSeat(@PathVariable Integer id) {
		return seatDAO.toggle(id);
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteSeat(@PathVariable Integer id) {
		return seatDAO.delete(id);
	}
}
