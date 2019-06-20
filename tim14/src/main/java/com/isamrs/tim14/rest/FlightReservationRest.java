package com.isamrs.tim14.rest;

import java.text.ParseException;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.isamrs.tim14.dto.GraphsDTO;
import com.isamrs.tim14.model.Flight;
import com.isamrs.tim14.model.FlightReservation;
import com.isamrs.tim14.service.FlightReservationService;

@RestController
@RequestMapping("/api")
public class FlightReservationRest {

	@Autowired
	private FlightReservationService flightReservationService;
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@PostMapping("/flightReservation/save")
	public void saveReservation(@RequestBody List<FlightReservation> reservations) {
		flightReservationService.saveReservation(reservations);
	}
	
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	@PostMapping("/flightReservation/makeQuick")
	public void makeQuickReservation(@RequestBody List<FlightReservation> reservations) {
		flightReservationService.makeQuickReservation(reservations);
	}
	
	@GetMapping("/flightReservation/getQuickTickets/{airlineID}")
	public List<FlightReservation> getQuickTickets(@PathVariable Integer airlineID) {
		return flightReservationService.getQuickTickets(airlineID);
	}
	
	@PutMapping("/flightReservation/buyQuickTicket")
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	public void buyQuickTicket(@RequestBody FlightReservation flightReservation) {
		flightReservationService.buyQuickTicket(flightReservation);
	}
	
	@GetMapping("/flightReservation/getQuickReservation/{reservationID}")
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	public FlightReservation getQuickReservation(@PathVariable Integer reservationID) {
		return flightReservationService.getQuickReservation(reservationID);
	}
	
	@RequestMapping(
			value = "/allUsedFlights",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<Flight>> getFlightsHistory(){
		return new ResponseEntity<Collection<Flight>>(flightReservationService.getFlightHistory(), HttpStatus.OK);
	}
	
	@GetMapping("/flightReservation/acceptInvitation/{reservationID}")
	public RedirectView acceptInvitation(@PathVariable Integer reservationID) {
		return new RedirectView("/login.html");
	}
	
	@GetMapping("/flightReservation/declineInvitation/{reservationID}")
	public RedirectView declineInvitation(@PathVariable Integer reservationID) {
		flightReservationService.declineInvitation(reservationID);
		
		return new RedirectView("/login.html");
	}
	
	@GetMapping("/allFlightReservations")
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	public Set<FlightReservation> getUserVehicleReservations(){
		return flightReservationService.getUserFlightReservations();
	}
	
	@DeleteMapping("/cancelFlightReservation/{reservationID}")
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	public ResponseEntity<Boolean> cancelFlightReservation(@PathVariable Integer reservationID) {
		flightReservationService.cancelFlightReservation(reservationID);
		return new ResponseEntity<Boolean>(true, HttpStatus.OK);
	}
	
	@RequestMapping(
			value = "/getDailyFlights",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<GraphsDTO> getDaily() throws ParseException{
		GraphsDTO g = flightReservationService.getFlightsDaily();
		return new ResponseEntity<GraphsDTO>(g, HttpStatus.OK);
	}

	@RequestMapping(
			value = "/getWeeklyFlights",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<GraphsDTO> getWeekly() throws ParseException{
		GraphsDTO g = flightReservationService.getFlightsWeekly();
		return new ResponseEntity<GraphsDTO>(g, HttpStatus.OK);
	}

	@RequestMapping(
			value = "/getMonthlyFlights",
			method = RequestMethod.GET,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<GraphsDTO> getMonthly() throws ParseException{
		GraphsDTO g = flightReservationService.getFlightsMonthly();
		return new ResponseEntity<GraphsDTO>(g, HttpStatus.OK);
	}
}
