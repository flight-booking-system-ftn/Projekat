package com.isamrs.tim14.rest;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dao.VehicleDAO;
import com.isamrs.tim14.model.RentACarAdmin;
import com.isamrs.tim14.model.User;
import com.isamrs.tim14.model.Vehicle;

@RestController
@RequestMapping("/api")
public class VehicleRest {

	private VehicleDAO vehicleDAO;
	
	@Autowired
	public VehicleRest(VehicleDAO vehicleDAO) {
		this.vehicleDAO = vehicleDAO;
	}
	
	@PreAuthorize("hasRole('ROLE_RENTACARADMIN')")
	@RequestMapping(
			value = "/vehicles",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Vehicle> saveVehicle(@RequestBody Vehicle vehicle) {
		Vehicle newVehicle = vehicleDAO.save(vehicle);
		if(newVehicle == null) {
			return new ResponseEntity<Vehicle>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Vehicle>(newVehicle, HttpStatus.CREATED);
	}
	
	
	@RequestMapping(
			value = "/vehiclesSearch/{vehicleId}/{arriveDate}/{dayNum}/{cars}/{motocycles}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Vehicle>> getVehicleSearch(@PathVariable String vehicleId, @PathVariable String arriveDate, @PathVariable String dayNum, @PathVariable String cars, 
			@PathVariable String motocycles){
		int id = Integer.parseInt(vehicleId);
		int numberOfDays = Integer.parseInt(dayNum);
		boolean car = (cars.equals("true")) ? true: false;
		boolean moto = (motocycles.equals("true")) ? true: false;
		Collection<Vehicle> vehicles = vehicleDAO.getVehiclesSearch(id, arriveDate, numberOfDays, car, moto);
		
		return new ResponseEntity<Collection<Vehicle>>(vehicles, HttpStatus.OK);
	}
	
}
