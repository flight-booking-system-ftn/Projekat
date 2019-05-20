package com.isamrs.tim14.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dao.RoomReservationDAO;
import com.isamrs.tim14.model.RoomReservation;

@RestController
@RequestMapping("/api")
public class RoomReservationRest {

private RoomReservationDAO roomReservationDAO;
	
	@Autowired
	public RoomReservationRest(RoomReservationDAO roomReservationDAO) {
		this.roomReservationDAO = roomReservationDAO;
	}
	
	@PreAuthorize("hasRole('ROLE_HOTELADMIN') or hasRole('ROLE_REGISTEREDUSER')")
	@RequestMapping(
			value = "/roomReservations",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<RoomReservation> saveRoomReservation(@RequestBody RoomReservation reservation) {
		RoomReservation newRoomReservation = roomReservationDAO.save(reservation);

		if(newRoomReservation == null) {
			return new ResponseEntity<RoomReservation>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<RoomReservation>(newRoomReservation, HttpStatus.CREATED);
	}
	
}
