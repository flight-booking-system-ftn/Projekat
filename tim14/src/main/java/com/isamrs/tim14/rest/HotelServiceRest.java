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

import com.isamrs.tim14.dao.HotelServiceDAO;
import com.isamrs.tim14.model.HotelService;

@RestController
@RequestMapping("/api")
public class HotelServiceRest {
	
	private HotelServiceDAO hotelServiceDAO;
	
	@Autowired
	public HotelServiceRest(HotelServiceDAO hotelServiceDAO) {
		this.hotelServiceDAO = hotelServiceDAO;
	}
	
	@RequestMapping(
			value = "/hotelServicesSearch/{hotelId}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<HotelService>> getHotelServiceSearch(@PathVariable String hotelId){
		int id = Integer.parseInt(hotelId);
		Collection<HotelService> hservices = hotelServiceDAO.getHotelServicesSearch(id);
		
		return new ResponseEntity<Collection<HotelService>>(hservices, HttpStatus.OK);
	}
	
	
	
	@PreAuthorize("hasRole('ROLE_HOTELADMIN')")
	@RequestMapping(
			value = "/hotelService",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<HotelService> saveNewService(@RequestBody HotelService hotelService){
		HotelService service = hotelServiceDAO.save(hotelService);
		if(service == null) {
			return new ResponseEntity<HotelService>(HttpStatus.NOT_ACCEPTABLE);
		}
		return new ResponseEntity<HotelService>(service, HttpStatus.CREATED);
	}
}
