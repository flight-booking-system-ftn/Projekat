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

import com.isamrs.tim14.dao.HotelAdminDAO;
import com.isamrs.tim14.dto.UserDTO;
import com.isamrs.tim14.model.Hotel;
import com.isamrs.tim14.model.HotelAdmin;

@RestController
@RequestMapping("/api")
public class HotelAdminRest {
	private HotelAdminDAO hotelAdminDAO;
	
	@Autowired
	public HotelAdminRest(HotelAdminDAO hotelAdminDAO) {
		this.hotelAdminDAO = hotelAdminDAO;
	}
	
	@RequestMapping(
			value = "/hoteladmins",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<HotelAdmin>> getHotelAdmins(){
		
		Collection<HotelAdmin> hotelAdmins = hotelAdminDAO.getHotelAdmins();
		
		return new ResponseEntity<Collection<HotelAdmin>>(hotelAdmins, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/hoteladmins/{hotelAdminID}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<HotelAdmin> getHotelAdmin(@PathVariable Integer hotelAdminID) {
		HotelAdmin hotelAdmin =  hotelAdminDAO.getHotelAdmin(hotelAdminID);
		if(hotelAdmin == null) {
			return new ResponseEntity<HotelAdmin>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<HotelAdmin>(hotelAdmin, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_HOTELADMIN')")
	@RequestMapping(
			value = "/hotelAdmin/hotel",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Hotel> getAdminsHotel(){
		
		Hotel currentHotel = hotelAdminDAO.getCurrentHotel();
		
		return new ResponseEntity<Hotel>(currentHotel, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_SYSTEMADMIN')")
	@RequestMapping(
			value = "/hoteladmins",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<HotelAdmin> saveHotelAdmin(@RequestBody HotelAdmin hotelAdmin) {
		System.out.println(hotelAdmin.getFirstName());
		System.out.println(hotelAdmin.getHotel().getName());
		HotelAdmin newHotelAdmin = hotelAdminDAO.save(hotelAdmin);
		if(newHotelAdmin == null) {
			return new ResponseEntity<HotelAdmin>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<HotelAdmin>(newHotelAdmin, HttpStatus.CREATED);
	}
	
	@PreAuthorize("hasRole('ROLE_HOTELADMIN')")
	@RequestMapping(
			value = "/updateHotelAdmin",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<HotelAdmin> updateHotelAdmin(@RequestBody UserDTO hotelAdmin) {
		HotelAdmin updatedHotelAdmin = hotelAdminDAO.updateAdmin(hotelAdmin);
		if(updatedHotelAdmin == null) {
			return new ResponseEntity<HotelAdmin>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<HotelAdmin>(updatedHotelAdmin, HttpStatus.CREATED);
	}
	
}
