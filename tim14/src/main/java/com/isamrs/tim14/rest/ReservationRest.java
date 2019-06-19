package com.isamrs.tim14.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dto.ReservationsDTO;
import com.isamrs.tim14.service.ReservationService;

@RestController
@RequestMapping("/api")
public class ReservationRest {

	@Autowired
	private ReservationService reservationService;
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@PostMapping("/saveReservations")
	public ReservationsDTO saveReservations(@RequestBody ReservationsDTO reservations) {
		return reservationService.saveReservations(reservations);
	}
	
}
