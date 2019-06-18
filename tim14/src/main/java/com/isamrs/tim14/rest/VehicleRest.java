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

import com.isamrs.tim14.model.Vehicle;
import com.isamrs.tim14.service.VehicleService;

@RestController
@RequestMapping("/api")
public class VehicleRest {

	@Autowired
	private VehicleService vehicleService;
	
	@PreAuthorize("hasRole('ROLE_RENTACARADMIN')")
	@RequestMapping(
			value = "/vehicles",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Vehicle> saveVehicle(@RequestBody Vehicle vehicle) {
		Vehicle newVehicle = vehicleService.save(vehicle);
		
		if(newVehicle == null) {
			return new ResponseEntity<Vehicle>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Vehicle>(newVehicle, HttpStatus.CREATED);
	}
	
	
	@RequestMapping(
			value = "/vehiclesSearch/{vehicleId}/{arriveDate}/{dayNum}/{cars}/{motocycles}/{startDest}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Vehicle>> getVehicleSearch(@PathVariable String vehicleId, @PathVariable Long arriveDate, @PathVariable Long dayNum, @PathVariable String cars, 
			@PathVariable String motocycles,  @PathVariable String startDest){
		int id = Integer.parseInt(vehicleId);
		boolean car = (cars.equals("true")) ? true: false;
		boolean moto = (motocycles.equals("true")) ? true: false;
		Collection<Vehicle> vehicles = vehicleService.getVehiclesSearch(id, arriveDate, dayNum, car, moto, startDest);
		
		return new ResponseEntity<Collection<Vehicle>>(vehicles, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/allVehiclesSearch/{rentName}/{destination}/{start}/{end}/{name}/{cars}/{motocycles}/{minPrice}/{maxPrice}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Vehicle>> getAllVehicleSearch(@PathVariable String rentName, @PathVariable String destination, @PathVariable Long start,  @PathVariable Long end,
			@PathVariable String name, @PathVariable String cars, @PathVariable String motocycles,  @PathVariable Double minPrice
			, @PathVariable Double maxPrice){
		boolean car = (cars.equals("true")) ? true: false;
		boolean moto = (motocycles.equals("true")) ? true: false;
		rentName = (rentName.equals("NO_INPUT")) ? "" : rentName;
		destination = (destination.equals("NO_INPUT")) ? "" : destination;
		Collection<Vehicle> vehicles = vehicleService.getAllVehiclesSearch(rentName, destination, start, end, name, car, moto, minPrice, maxPrice);
		
		return new ResponseEntity<Collection<Vehicle>>(vehicles, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_RENTACARADMIN')")
	@RequestMapping(
			value = "/unreservedVehicles",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Vehicle>> getUnreservedVehcles(){
		Collection<Vehicle> vehicles = vehicleService.getUnreservedVehicles();
		return new ResponseEntity<Collection<Vehicle>>(vehicles, HttpStatus.OK);
	}

	@PreAuthorize("hasRole('ROLE_RENTACARADMIN')")
	@RequestMapping(
			value = "/removeVehicle/{id}",
			method = RequestMethod.DELETE)
	public ResponseEntity<?> removeRoom(@PathVariable Integer id){
		vehicleService.removeVehicle(id);
		return new ResponseEntity<Boolean>(true, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@RequestMapping(value = "/getGradeForVehicle/{id}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Integer> getUserGrade(@PathVariable Integer id) {
		Integer grade = vehicleService.getGrade(id);
		return new ResponseEntity<Integer>(grade, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_RENTACARADMIN')")
	@RequestMapping(value = "/getMediumGradeForVehicle/{id}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Integer> getGrade(@PathVariable Integer id) {
		Integer grade = vehicleService.getIntermediateGrade(id);
		return new ResponseEntity<Integer>(grade, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@RequestMapping(value = "/setGradeForVehicle/{id}/{grade}",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Boolean> setUserGrade(@PathVariable Integer id, @PathVariable Integer grade) {
		vehicleService.setGrade(id, grade);
		return new ResponseEntity<Boolean>(true, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_RENTACARADMIN')")
	@RequestMapping(
			value = "/vehicle/{id}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Vehicle> getSelectedVehicle(@PathVariable Integer id){
		Vehicle vehicle = vehicleService.findById(id);
		return new ResponseEntity<Vehicle>(vehicle, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_RENTACARADMIN')")
	@RequestMapping(
			value = "/editVehicle",
			method = RequestMethod.PUT,
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Vehicle> changeVehicle(@RequestBody Vehicle vehicle) {
		Vehicle veh = vehicleService.changeVehicle(vehicle);
		return new ResponseEntity<Vehicle>(veh, HttpStatus.CREATED);
	}
	
	@PreAuthorize("hasRole('ROLE_RENTACARADMIN')")
	@RequestMapping(
			value = "/allVehicles",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Vehicle>> getAllVehicles(){
		Collection<Vehicle> vehicles = vehicleService.getAllRentsVehicles();
		return new ResponseEntity<Collection<Vehicle>>(vehicles, HttpStatus.OK);
	}
}
