package com.isamrs.tim14.rest;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dao.RoomDAO;
import com.isamrs.tim14.model.Hotel;
import com.isamrs.tim14.model.Room;

@RestController
@RequestMapping("/api")
public class RoomRest {

	private RoomDAO roomDAO;
	
	@Autowired
	public RoomRest(RoomDAO roomDAO) {
		this.roomDAO = roomDAO;
	}
	
	@RequestMapping(
			value = "/rooms",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Room> saveRoom(@RequestBody Room room) {
		Room newRoom = roomDAO.save(room);
		if(newRoom == null) {
			return new ResponseEntity<Room>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Room>(newRoom, HttpStatus.CREATED);
	}
	
	@RequestMapping(
			value = "/roomsSearch/{hotelId}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Room>> getRoomSearch(@PathVariable String hotelId){
		int id = Integer.parseInt(hotelId);
		Collection<Room> rooms = roomDAO.getRoomsSearch(id);
		
		return new ResponseEntity<Collection<Room>>(rooms, HttpStatus.OK);
	}
	
}
