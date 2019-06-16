package com.isamrs.tim14.rest;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dao.RoomReservationDAO;
import com.isamrs.tim14.model.Room;
import com.isamrs.tim14.model.RoomReservation;
import com.isamrs.tim14.model.Vehicle;

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
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@RequestMapping(
			value = "/reserveQuickRoomReservation/{reservationID}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<RoomReservation> saveQuickRoomReservation(@PathVariable String reservationID) {
		RoomReservation newRoomReservation = roomReservationDAO.saveQuick(reservationID);

		if(newRoomReservation == null) {
			return new ResponseEntity<RoomReservation>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<RoomReservation>(newRoomReservation, HttpStatus.CREATED);
	}
	
	@RequestMapping(
			value = "/quickRoomReservations/{hotelID}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<RoomReservation>> getQuickRoomReservations(@PathVariable String hotelID){
		
		Collection<RoomReservation> result = roomReservationDAO.getQuickRoomReservations(hotelID);
		
		return new ResponseEntity<Collection<RoomReservation>>(result, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/allUsedRooms",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Room>> getVehiclesHistory(){
		return new ResponseEntity<Collection<Room>>(roomReservationDAO.getRoomsHistory(), HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/getQuickReservation/{reservationID}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<RoomReservation> getOneQuickReservation(@PathVariable Integer reservationID){
		
		RoomReservation result = roomReservationDAO.getOneQuickReservation(reservationID);
		
		return new ResponseEntity<RoomReservation>(result, HttpStatus.OK);
	}
	
}
