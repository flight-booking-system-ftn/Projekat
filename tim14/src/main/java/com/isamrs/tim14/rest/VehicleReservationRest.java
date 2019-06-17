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

import com.isamrs.tim14.dao.VehicleReservationDAO;
import com.isamrs.tim14.dto.GraphsDTO;
import com.isamrs.tim14.model.Vehicle;
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
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@RequestMapping(
			value = "/reserveQuickVehicleReservation/{reservationID}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<VehicleReservation> saveQuickRoomReservation(@PathVariable String reservationID) {
		VehicleReservation res = VehicleReservationDAO.saveQuickVehicleReservation(reservationID);

		if(res == null) {
			return new ResponseEntity<VehicleReservation>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<VehicleReservation>(res, HttpStatus.CREATED);
	}

	@RequestMapping(
			value = "/quickVehicleReservations/{rentID}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<VehicleReservation>> getQuickVehicleReservations(@PathVariable String rentID){

		Collection<VehicleReservation> result = VehicleReservationDAO.getQuickVehicleReservations(rentID);

		return new ResponseEntity<Collection<VehicleReservation>>(result, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/allUsedVehicles",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Vehicle>> getVehiclesHistory(){
		return new ResponseEntity<Collection<Vehicle>>(VehicleReservationDAO.getVehicleHistory(), HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/getQuickReservationRent/{reservationID}",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<VehicleReservation> getOneQuickReservation(@PathVariable Integer reservationID){
		
		VehicleReservation result = VehicleReservationDAO.getOneQuickReservation(reservationID);
		
		return new ResponseEntity<VehicleReservation>(result, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/getDailyVehicles",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<GraphsDTO> getDaily() throws ParseException{
		GraphsDTO g = VehicleReservationDAO.getVehiclesDaily();
		return new ResponseEntity<GraphsDTO>(g, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/getWeeklyVehicles",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<GraphsDTO> getWeekly() throws ParseException{
		GraphsDTO g = VehicleReservationDAO.getVehiclesWeekly();
		return new ResponseEntity<GraphsDTO>(g, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/getMonthlyVehicles",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<GraphsDTO> getMonthly() throws ParseException{
		GraphsDTO g = VehicleReservationDAO.getVehiclesMonthly();
		return new ResponseEntity<GraphsDTO>(g, HttpStatus.OK);
	}
	
}
