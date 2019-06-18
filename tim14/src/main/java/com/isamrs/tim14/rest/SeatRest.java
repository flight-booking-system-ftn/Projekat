package com.isamrs.tim14.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.model.Seat;
import com.isamrs.tim14.service.SeatService;

@RestController
@RequestMapping("/seats")
public class SeatRest {

	@Autowired
	private SeatService seatService;
	
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	@PutMapping("/toggle/{id}")
	public void toggleSeat(@PathVariable Integer id) {
		seatService.toggle(id);
	}
	
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	@DeleteMapping("/delete/{id}")
	public void deleteSeat(@PathVariable Integer id) {
		seatService.delete(id);
	}
	
	@PostMapping("/getSelectedSeats")
	public List<Seat> getSeats(@RequestBody List<Integer> seats) {
		return seatService.getSeats(seats);
	}
	
	@GetMapping("/{id}")
	public Seat getSeat(@PathVariable Integer id) {
		return seatService.getSeat(id);
	}
}
