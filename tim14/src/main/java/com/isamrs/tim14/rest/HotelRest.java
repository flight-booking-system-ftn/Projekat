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

import com.isamrs.tim14.dao.HotelDAO;
import com.isamrs.tim14.model.Hotel;
import com.isamrs.tim14.model.Room;

@RestController
@RequestMapping("/api")
public class HotelRest {
	
	private HotelDAO hotelDAO;
	
	@Autowired
	public HotelRest(HotelDAO hotelDAO) {
		this.hotelDAO = hotelDAO;
	}
	
	@RequestMapping(
			value = "/hotels",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Hotel>> getHotels(){
		
		Collection<Hotel> hotels = hotelDAO.getHotels();
		
		return new ResponseEntity<Collection<Hotel>>(hotels, HttpStatus.OK);
	}
	

	@RequestMapping(
			value = "/hotelsSearch/{hotelName}/{hotelDestination}/{checkIn}/{checkOut}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Hotel>> getHotelsSearch(@PathVariable String hotelName, @PathVariable String hotelDestination, @PathVariable long checkIn, @PathVariable long checkOut){
		System.out.println(hotelName + " " + hotelDestination + " " + checkIn + " " + checkOut);
		Collection<Hotel> hotels = hotelDAO.getHotelsSearch(hotelName, hotelDestination, checkIn, checkOut);
		
		return new ResponseEntity<Collection<Hotel>>(hotels, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/hotels/{hotelID}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Hotel> getHotel(@PathVariable Integer hotelID) {
		Hotel hotel =  hotelDAO.getHotel(hotelID);
		if(hotel == null) {
			return new ResponseEntity<Hotel>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Hotel>(hotel, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/hotels",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Hotel> saveHotel(@RequestBody Hotel hotel) {
		Hotel newHotel = hotelDAO.save(hotel);
		if(newHotel == null) {
			return new ResponseEntity<Hotel>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Hotel>(newHotel, HttpStatus.CREATED);
	}
	
	
	@PreAuthorize("hasRole('ROLE_HOTELADMIN')")
	@RequestMapping(
			value = "/changeHotel",
			method = RequestMethod.PUT,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Hotel> changeHotel(@RequestBody Hotel hotel) {
		Hotel managedHotel = hotelDAO.changeHotel(hotel);
		if(managedHotel == null) {
			return new ResponseEntity<Hotel>(HttpStatus.NOT_ACCEPTABLE);
		}
		return new ResponseEntity<Hotel>(managedHotel, HttpStatus.CREATED);
	}
}
