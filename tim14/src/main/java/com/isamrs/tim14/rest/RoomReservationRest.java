package com.isamrs.tim14.rest;

import java.text.ParseException;
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
import com.isamrs.tim14.dto.GraphsDTO;
import com.isamrs.tim14.model.Room;
import com.isamrs.tim14.model.RoomReservation;
import com.isamrs.tim14.service.RoomReservationService;

@RestController
@RequestMapping("/api")
public class RoomReservationRest {

private RoomReservationDAO roomReservationDAO;
	
	@Autowired
	public RoomReservationRest(RoomReservationDAO roomReservationDAO) {
		this.roomReservationDAO = roomReservationDAO;
	}
	
	@Autowired
	private RoomReservationService roomReservationService;
	
	@PreAuthorize("hasRole('ROLE_HOTELADMIN') or hasRole('ROLE_REGISTEREDUSER')")
	@RequestMapping(
			value = "/roomReservations",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<RoomReservation> saveRoomReservation(@RequestBody RoomReservation reservation) {
		RoomReservation newRoomReservation = roomReservationService.save(reservation);
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
		RoomReservation newRoomReservation = roomReservationService.saveQuick(reservationID);

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
		
		Collection<RoomReservation> result = roomReservationService.getQuickRoomReservations(hotelID);
		
		return new ResponseEntity<Collection<RoomReservation>>(result, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/allUsedRooms",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Room>> getRoomsHistory(){
		return new ResponseEntity<Collection<Room>>(roomReservationService.getRoomsHistory(), HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/getQuickReservation/{reservationID}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<RoomReservation> getOneQuickReservation(@PathVariable Integer reservationID){
		
		RoomReservation result = roomReservationService.getOneQuickReservation(reservationID);
		
		return new ResponseEntity<RoomReservation>(result, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/getDailyRooms",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<GraphsDTO> getDaily() throws ParseException{
		GraphsDTO g = roomReservationService.getRoomsDaily();
		return new ResponseEntity<GraphsDTO>(g, HttpStatus.OK);
	}

	@RequestMapping(
			value = "/getWeeklyRooms",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<GraphsDTO> getWeekly() throws ParseException{
		GraphsDTO g = roomReservationService.getRoomsWeekly();
		return new ResponseEntity<GraphsDTO>(g, HttpStatus.OK);
	}

	@RequestMapping(
			value = "/getMonthlyRooms",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<GraphsDTO> getMonthly() throws ParseException{
		GraphsDTO g = roomReservationService.getRoomsMonthly();
		return new ResponseEntity<GraphsDTO>(g, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/allRoomReservations",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<RoomReservation>> getUserVehicleReservations(){
		Collection<RoomReservation> result = roomReservationService.getUserRoomReservations();

		return new ResponseEntity<Collection<RoomReservation>>(result, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/cancelRoomReservation/{reservationID}",
			method = RequestMethod.DELETE,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Boolean> cancelRoomReservation(@PathVariable String reservationID) {
		roomReservationService.cancelRoomReservation(reservationID);
		return new ResponseEntity<Boolean>(true, HttpStatus.OK);
	}
	
}
