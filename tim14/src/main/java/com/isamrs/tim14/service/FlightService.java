package com.isamrs.tim14.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.model.AirlineAdmin;
import com.isamrs.tim14.model.Flight;
import com.isamrs.tim14.model.Grade;
import com.isamrs.tim14.model.Luggage;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.Seat;
import com.isamrs.tim14.model.SeatType;
import com.isamrs.tim14.others.FlightPathAndDate;
import com.isamrs.tim14.others.FlightsSearch;
import com.isamrs.tim14.repository.IAirportRepository;
import com.isamrs.tim14.repository.IFlightRepository;
import com.isamrs.tim14.repository.IGradeRepository;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class FlightService {

	@Autowired
	private IFlightRepository flightRepository;
	
	@Autowired
	private IAirportRepository airportRepository;
	
	@Autowired
	private IGradeRepository gradeRepository;
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public Flight save(Flight flight) {
		AirlineAdmin user = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		flight.setAirline(user.getAirline());
		flight.setFrom(airportRepository.getOne(flight.getFrom().getId()));
		flight.setTo(airportRepository.getOne(flight.getTo().getId()));
		
		return flightRepository.save(flight);
	}
	
	public Set<Luggage> getLuggagePricelist(Integer id) {
		Flight flight = flightRepository.getOne(id);
		
		return flight.getAirline().getLuggagePricelist();
	}
	
	public List<Seat> getSeats(Integer id) {
		Flight flight = flightRepository.getOne(id);
		
		return flight.getSeats();
	}
	
	public ResponseEntity<List<List<Flight>>> search(FlightsSearch values) {
		List<List<Flight>> result = new ArrayList<List<Flight>>();
		
		int freeSeats;
		List<Flight> flights;
		
		for(FlightPathAndDate data : values.getData()) {
			if(values.getAirlineID() == -999)
				flights = flightRepository.findGlobalFlights(data.getFrom().getId(), data.getTo().getId(), values.getBags(), values.getDurationRange());
			else
				flights = flightRepository.findFlightsByAirline(values.getAirlineID(), data.getFrom().getId(), data.getTo().getId(), values.getBags(), values.getDurationRange());

			List<Flight> flightResult = new ArrayList<Flight>();
			
			for(Flight flight : flights) {
				if(flight.getDepartureDate().getYear() == data.getDepartureDate().getYear() && flight.getDepartureDate().getMonth() == data.getDepartureDate().getMonth()
						&& flight.getDepartureDate().getDate() == data.getDepartureDate().getDate()) {
					freeSeats = 0;
					for(Seat seat : flight.getSeats()) {
						if(seat.getEnabled() == true && seat.getBusy() == false) {
							if(values.getSeatClass().equals("Economy") && seat.getType() == SeatType.ECONOMY && flight.getTicketPriceEconomyClass() <= values.getPriceRange()) {
								freeSeats++;
								if(freeSeats >= values.getPassengers()) {
									flightResult.add(flight);
									freeSeats = 0;
									break;
								}
							} else if(values.getSeatClass().equals("Business") && seat.getType() == SeatType.BUSINESS && flight.getTicketPriceBusinessClass() <= values.getPriceRange()) {
								freeSeats++;
								if(freeSeats >= values.getPassengers()) {
									flightResult.add(flight);
									freeSeats = 0;
									break;
								}
							} else if(values.getSeatClass().equals("First Class") && seat.getType() == SeatType.FIRST_CLASS && flight.getTicketPriceFirstClass() <= values.getPriceRange()) {
								freeSeats++;
								if(freeSeats >= values.getPassengers()) {
									flightResult.add(flight);
									freeSeats = 0;
									break;
								}
							}
						}
					}
				}
			}
			
			if(flightResult.size() == 0)
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			
			result.add(flightResult);
		}
		
		if(values.getTripType().equals("Round trip")) {
			if(values.getAirlineID() == -999)
				flights = flightRepository.findGlobalFlights(values.getData().get(0).getTo().getId(), values.getData().get(0).getFrom().getId(), values.getBags(), values.getDurationRange());
			else
				flights = flightRepository.findFlightsByAirline(values.getAirlineID(), values.getData().get(0).getTo().getId(), values.getData().get(0).getFrom().getId(), values.getBags(), values.getDurationRange());
			
			List<Flight> returningFlightResult = new ArrayList<Flight>();
			
			for(Flight flight : flights) {
				if(flight.getDepartureDate().getYear() == values.getData().get(0).getReturnDate().getYear() && flight.getDepartureDate().getMonth() == values.getData().get(0).getReturnDate().getMonth()
						&& flight.getDepartureDate().getDate() == values.getData().get(0).getReturnDate().getDate()) {
					freeSeats = 0;
					for(Seat seat : flight.getSeats()) {
						if(seat.getEnabled() == true && seat.getBusy() == false) {
							if(values.getSeatClass().equals("Economy") && seat.getType() == SeatType.ECONOMY && flight.getTicketPriceEconomyClass() <= values.getPriceRange()) {
								freeSeats++;
								if(freeSeats >= values.getPassengers()) {
									returningFlightResult.add(flight);
									freeSeats = 0;
									break;
								}
							} else if(values.getSeatClass().equals("Business") && seat.getType() == SeatType.BUSINESS && flight.getTicketPriceBusinessClass() <= values.getPriceRange()) {
								freeSeats++;
								if(freeSeats >= values.getPassengers()) {
									returningFlightResult.add(flight);
									freeSeats = 0;
									break;
								}
							} else if(values.getSeatClass().equals("First Class") && seat.getType() == SeatType.FIRST_CLASS && flight.getTicketPriceFirstClass() <= values.getPriceRange()) {
								freeSeats++;
								if(freeSeats >= values.getPassengers()) {
									returningFlightResult.add(flight);
									freeSeats = 0;
									break;
								}
							}
						}
					}
				}
			}
			
			if(returningFlightResult.size() == 0)
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			
			result.add(returningFlightResult);
		}
		
		return new ResponseEntity(result, HttpStatus.OK);
	}
	
	public Flight findById(Integer id) {
		return flightRepository.getOne(id);
	}
	
	public Integer getGrade(Integer id) {
		Flight flight = flightRepository.getOne(id);
		RegisteredUser ru = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		for (Grade g : flight.getGrades())
			if (g.getUser().getEmail().equals(ru.getEmail()))
				return g.getGrade();

		return 0;
	}
	
	public void setGrade(Integer id, Integer grade) {
		Flight flight = flightRepository.getOne(id);
		RegisteredUser ru = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		for (Grade g : flight.getGrades()) {
			if (g.getUser().getEmail().equals(ru.getEmail())) {
				g.setGrade(grade);
				return;
			}
		}

		Grade g = new Grade();
		g.setGrade(grade);
		g.setUser(ru);

		gradeRepository.save(g);
		flight.getGrades().add(g);
	}
	
	public Integer getIntermediateGrade(Integer id) {
		Flight flight = flightRepository.getOne(id);
		int sum = 0;
		int count = 0;

		for (Grade g : flight.getGrades()) {
			sum += g.getGrade();
			count++;
		}

		if (count == 0)
			return 0;
		else
			return sum / count;
	}
	
}
