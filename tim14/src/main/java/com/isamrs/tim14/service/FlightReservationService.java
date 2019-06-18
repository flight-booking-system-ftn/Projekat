package com.isamrs.tim14.service;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.dto.GraphsDTO;
import com.isamrs.tim14.model.AirlineAdmin;
import com.isamrs.tim14.model.Flight;
import com.isamrs.tim14.model.FlightReservation;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.Seat;
import com.isamrs.tim14.repository.IFlightReservationRepository;
import com.isamrs.tim14.repository.ISeatRepository;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class FlightReservationService {
	
	@Autowired
	private IFlightReservationRepository flightReservationRepository;
	
	@Autowired
	private ISeatRepository seatRepository;
	
	@Autowired
	private EmailService mailService;
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public void saveReservation(List<FlightReservation> reservations) {
		RegisteredUser user = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		reservations.get(0).setUser(user);
		reservations.get(0).setPassportNumber("123456789");
		
		for(FlightReservation reservation : reservations) {
			Seat managedSeat = seatRepository.getOne(reservation.getSeat().getId());
			managedSeat.setBusy(true);
			
			reservation.setUserWhoReserved(user);
			
			flightReservationRepository.save(reservation);
			
			if(reservation.getUser().getId() != user.getId() && reservation.getUser() != null)
				try {
					String message = "User " + reservations.get(0).getUser().getEmail() + " inviting you to the flight " + reservation.getFlight().getFrom().getDestination().getName() + " --> " + reservation.getFlight().getTo().getDestination().getName() + ".\n\nAccept invitation: http://localhost:5000/api/flightReservation/acceptInvitation/" + reservation.getId() + ".\nDecline invitation: http://localhost:5000/api/flightReservation/declineInvitation/" + reservation.getId();
					mailService.sendNotificaitionAsync(reservation.getUser(), "Invitation on flight", message);
				} catch (MailException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		}
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public void makeQuickReservation(List<FlightReservation> reservations) {
		for(FlightReservation reservation : reservations) {
			Seat managedSeat = seatRepository.getOne(reservation.getSeat().getId());
			managedSeat.setBusy(true);
			
			flightReservationRepository.save(reservation);
		}
	}
	
	public List<FlightReservation> getQuickTickets(Integer id) {
		return flightReservationRepository.findQuickReservations(id);
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public void buyQuickTicket(FlightReservation flightReservation) {
		FlightReservation reservation = flightReservationRepository.getOne(flightReservation.getId());
		RegisteredUser user = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		reservation.setPassportNumber("123456789");
		reservation.setUser(user);
		reservation.setDateOfPurchase(new Timestamp(new Date().getTime()));
		reservation.setRoomReservation(flightReservation.getRoomReservation());
		reservation.setVehicleReservation(flightReservation.getVehicleReservation());
	}
	
	public FlightReservation getQuickReservation(Integer reservationID) {
		return flightReservationRepository.getOne(reservationID);
	}
	
	public void declineInvitation(Integer reservationID) {
		FlightReservation reservation = flightReservationRepository.getOne(reservationID);
		
		if(reservation == null)
			return;
		
		flightReservationRepository.delete(reservation);
	}
	
	public Collection<Flight> getFlightHistory() {
		ArrayList<Flight> allFlights = new ArrayList<Flight>();
		RegisteredUser u = ((RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal());

		for (FlightReservation fr : u.getFlightReservations())
			if (!allFlights.contains(fr.getFlight()))
				allFlights.add(fr.getFlight());

		return allFlights;
	}
	
	public GraphsDTO getFlightsDaily() throws ParseException {
		GraphsDTO graph = new GraphsDTO();
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		Date start = null;

		Calendar c = Calendar.getInstance();
		c.setTime(new Date()); // Now use today date.
		c.add(Calendar.DATE, -13);

		start = sdf.parse(sdf.format(c.getTime()));

		AirlineAdmin admin = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Collection<Flight> flights = admin.getAirline().getFlights();
		List<FlightReservation> reservations = flightReservationRepository.findAll();

		for (int i = 0; i < 14; i++) {
			start = sdf.parse(sdf.format(c.getTime()));
			System.out.println(c.getTime());
			String dateX = sdf.format(start);
			graph.getX().add(dateX);
			int sum = 0;
			for (Flight f : flights)
				for (FlightReservation fr : reservations)
					if (fr.getFlight().getId() == f.getId())
						if (sdf.parse(sdf.format(fr.getFlight().getDepartureDate())).equals(start))
							sum++;

			graph.getY().add(sum);
			c.add(Calendar.DATE, 1);
		}

		return graph;
	}
	
	public GraphsDTO getFlightsWeekly() throws ParseException {
		GraphsDTO graph = new GraphsDTO();
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		SimpleDateFormat sdf2 = new SimpleDateFormat("dd/MM");
		Date end = null;
		Date start = null;

		Calendar c = Calendar.getInstance();
		Calendar c2 = Calendar.getInstance();
		c.setTime(new Date()); // Now use today date.
		c.add(Calendar.WEEK_OF_YEAR, -13);

		start = sdf.parse(sdf.format(c.getTime()));
		c.add(Calendar.WEEK_OF_YEAR, 1);
		end = sdf.parse(sdf.format(c.getTime()));

		AirlineAdmin admin = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Collection<Flight> flights = admin.getAirline().getFlights();
		List<FlightReservation> reservations = flightReservationRepository.findAll();

		for (int i = 0; i < 12; i++) {
			start = end;
			c.add(Calendar.DATE, 7);
			System.out.println(c.getTime());
			end = sdf.parse(sdf.format(c.getTime()));
			int sum = 0;
			for (Flight f : flights)
				for (FlightReservation fr : reservations)
					if (fr.getFlight().getId() == f.getId())
						if (sdf.parse(sdf.format(fr.getFlight().getDepartureDate())).before(end)
								&& sdf.parse(sdf.format(fr.getFlight().getDepartureDate())).after(start)
								|| sdf.parse(sdf.format(fr.getFlight().getDepartureDate())).equals(end))
							sum++;

			c2.setTime(start);
			c2.add(Calendar.DATE, 1);
			start = sdf.parse(sdf.format(c2.getTime()));

			String dateX = sdf2.format(start) + "-" + sdf2.format(end);
			graph.getX().add(dateX);
			graph.getY().add(sum);
		}

		return graph;
	}
	
	public GraphsDTO getFlightsMonthly() throws ParseException {
		GraphsDTO graph = new GraphsDTO();
		SimpleDateFormat sdf = new SimpleDateFormat("MM/yy");
		Date date = null;

		Calendar c = Calendar.getInstance();
		c.add(Calendar.MONTH, -11);

		date = sdf.parse(sdf.format(c.getTime()));

		AirlineAdmin admin = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Collection<Flight> flights = admin.getAirline().getFlights();
		List<FlightReservation> reservations = flightReservationRepository.findAll();

		for (int i = 0; i < 12; i++) {
			String dateX = sdf.format(c.getTime());
			date = sdf.parse(sdf.format(c.getTime()));
			int sum = 0;
			for (Flight f : flights)
				for (FlightReservation fr : reservations)
					if (fr.getFlight().getId() == f.getId())
						if (sdf.parse(sdf.format(fr.getFlight().getDepartureDate())).equals(date))
							sum++;

			graph.getX().add(dateX);
			graph.getY().add(sum);
			c.add(Calendar.MONTH, 1);
		}

		return graph;
	}

}
