package com.isamrs.tim14.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.persistence.OptimisticLockException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.model.Airline;
import com.isamrs.tim14.model.AirlineAdmin;
import com.isamrs.tim14.model.Airport;
import com.isamrs.tim14.model.Destination;
import com.isamrs.tim14.model.Flight;
import com.isamrs.tim14.model.FlightReservation;
import com.isamrs.tim14.model.Grade;
import com.isamrs.tim14.model.Luggage;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.repository.IAirlineRepository;
import com.isamrs.tim14.repository.IDestinationRepository;
import com.isamrs.tim14.repository.IFlightReservationRepository;
import com.isamrs.tim14.repository.IGradeRepository;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class AirlineService {
	
	@Autowired
	private IAirlineRepository airlineRepository;
	
	@Autowired
	private IDestinationRepository destinationRepository;
	
	@Autowired
	private IGradeRepository gradeRepository;
	
	@Autowired
	private IFlightReservationRepository flightReservationRepository;
	
	public List<Airline> findAll() {
		return airlineRepository.findAll();
	}
	
	public Airline findById(Integer id) {
		return (Airline) airlineRepository.getOne(id);
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public Airline save(Airline airline) {
		Airline result = airlineRepository.findOneByName(airline.getName());
		
		if(result != null)
			return null;
		
		airlineRepository.save(airline);
		return airline;
	}
	
	@Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = false, rollbackFor = OptimisticLockException.class)
	public ResponseEntity<String> update(Airline airline) {
		AirlineAdmin user = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		List<Destination> destinations = destinationRepository.findAll();
		
		if(airline.getName().equals(user.getAirline().getName())) {
			for(Destination destination : destinations)
				if(destination.getName().equals(airline.getDestination().getName()) && destination.getAddress().equals(airline.getDestination().getAddress()) && destination.getCountry().equals(airline.getDestination().getCountry())
						&& !airline.getDestination().getName().equals(user.getAirline().getDestination().getName()) && !airline.getDestination().getCountry().equals(user.getAirline().getDestination().getCountry()) && !airline.getDestination().getAddress().equals(user.getAirline().getDestination().getAddress())) {
					try {
						Thread.sleep(1000);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
					return new ResponseEntity("Some object is already on this location. Please, enter another location.", HttpStatus.NOT_ACCEPTABLE);
				}
		} else {
			Airline result = airlineRepository.findOneByNameAndNotName(airline.getName(), user.getAirline().getName());
			
			if(result != null) {
				try {
					Thread.sleep(1000);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
				return new ResponseEntity("Airline with same name already exists.", HttpStatus.NOT_ACCEPTABLE);
			}
				
		}
		
		Airline managedAirline = airlineRepository.findOneById(user.getAirline().getId());
		
		Destination managedDestination = destinationRepository.findOneById(managedAirline.getDestination().getId());
		managedDestination.setAddress(airline.getDestination().getAddress());
		managedDestination.setCountry(airline.getDestination().getCountry());
		managedDestination.setLatitude(airline.getDestination().getLatitude());
		managedDestination.setLongitude(airline.getDestination().getLongitude());
		managedDestination.setName(airline.getDestination().getName());
		
		managedAirline.setName(airline.getName());
		managedAirline.setDescription(airline.getDescription());

		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity("Airline informations successfully updated.", HttpStatus.OK);
	}
	
	public List<Airline> search(String airlineName) {
		return airlineRepository.findByNameContaining(airlineName);
	}
	
	public Set<Airport> getAirports(Integer id) {
		Airline airline = airlineRepository.getOne(id);
		
		return airline.getAirports();
	}
	
	public Set<Flight> getFlightsOfAirline() {
		AirlineAdmin user = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
					
		return user.getAirline().getFlights();
	}

	public ResponseEntity<List<Airport>> getAirportsOfAirline() {
		AirlineAdmin user = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		if(user.getAirline().getAirports().size() == 0)
			return new ResponseEntity("No airports were found.", HttpStatus.NOT_FOUND);
		else
			return new ResponseEntity(user.getAirline().getAirports(), HttpStatus.OK);
	}
	
	public Airline getAirline() {
		AirlineAdmin user = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		return user.getAirline();
	}
	
	public Set<Luggage> getPricelist() {
		AirlineAdmin user = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		return user.getAirline().getLuggagePricelist();
	}
	
	public List<Airline> getAirlinesFromReservations() {
		RegisteredUser u = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		ArrayList<Airline> all = new ArrayList<Airline>();
		for (FlightReservation fr : u.getFlightReservations()) {
			if (!(all.contains(fr.getFlight().getAirline())))
				all.add(fr.getFlight().getAirline());
		}

		return all;
	}
	
	public Integer getGrade(Integer id) {
		RegisteredUser ru = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		Airline airline = airlineRepository.getOne(id);
		for (Grade g : airline.getGrades())
			if (g.getUser().getEmail().equals(ru.getEmail()))
				return g.getGrade();

		return 0;
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public void setGrade(Integer id, Integer grade) {
		RegisteredUser ru = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		Airline airline = airlineRepository.getOne(id);
		for (Grade g : airline.getGrades())
			if (g.getUser().getEmail().equals(ru.getEmail())) {
				g.setGrade(grade);
				return;
			}

		Grade g = new Grade();
		g.setGrade(grade);
		g.setUser(ru);

		gradeRepository.save(g);
		airline.getGrades().add(g);
	}
	
	public Integer getGradeAirline() {
		AirlineAdmin admin = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		int sum = 0;
		int count = 0;

		for (Grade g : admin.getAirline().getGrades()) {
			sum += g.getGrade();
			count++;
		}

		if (count == 0)
			return 0;
		else
			return sum / count;
	}
	
	public double getIncome(Date start, Date end) {
		AirlineAdmin admin = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		List<FlightReservation> reservations = flightReservationRepository.findAll();
		int sum = 0;
		
		for (FlightReservation fr : reservations)
			if (fr.getFlight().getAirline().getId() == admin.getAirline().getId())
				if (fr.getFlight().getArrivalDate().before(end) && fr.getFlight().getDepartureDate().after(start))
					sum += fr.getPrice() - fr.getPrice() * fr.getDiscount() / 100;
		
		return sum;
	}
	
}
