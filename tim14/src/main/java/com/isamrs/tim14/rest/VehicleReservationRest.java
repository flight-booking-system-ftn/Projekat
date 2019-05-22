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

import com.isamrs.tim14.dao.VehicleReservationDAO;
import com.isamrs.tim14.model.VehicleReservation;

@RestController
@RequestMapping("/api")
public class VehicleReservationRest {

private VehicleReservationDAO VehicleReservationDAO;
	
	@Autowired
	public VehicleReservationRest(VehicleReservationDAO VehicleReservationDAO) {
		this.VehicleReservationDAO = VehicleReservationDAO;
	}
	
	@PreAuthorize("hasRole('ROLE_RENTACARADMIN') or hasRole('ROLE_REGISTEREDUSER')")
	@RequestMapping(
			value = "/vehicleReservations",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<VehicleReservation> saveVehicleReservation(@RequestBody VehicleReservation reservation) {
		VehicleReservation newVehicleReservation = VehicleReservationDAO.save(reservation);

		if(newVehicleReservation == null) {
			return new ResponseEntity<VehicleReservation>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<VehicleReservation>(newVehicleReservation, HttpStatus.CREATED);
	}
	
}
