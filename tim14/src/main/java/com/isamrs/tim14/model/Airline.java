package com.isamrs.tim14.model;

import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "airline")
public class Airline {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;

	@Column(name = "name")
	private String name;
	
	@JoinColumn(name = "destination_id")
    @OneToOne(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH })
	private Destination destination;
	
	@Column(name = "description")
	private String description;
	
	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "airline_id")
	private Set<Destination> destinations;
	
	@ElementCollection(targetClass = Flight.class)
	private Set<Flight> flights;
	
	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "airline_id")
	private Set<FlightTicket> quickReservationTickets;
	
	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "airline_id")
	private List<Seat> flightConfiguration;
	
	@ElementCollection(targetClass = AirlineService.class)
	private Set<AirlineService> services;
	
	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "airline_id")
	private Set<Grade> grades;
	
	@ElementCollection(targetClass = AirlineAdmin.class)
	private Set<AirlineAdmin> admins;

	public Airline() {
		super();
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Destination getDestination() {
		return destination;
	}

	public void setDestination(Destination destination) {
		this.destination = destination;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Set<Destination> getDestinations() {
		return destinations;
	}

	public void setDestinations(Set<Destination> destinations) {
		this.destinations = destinations;
	}

	public Set<Flight> getFlights() {
		return flights;
	}

	public void setFlights(Set<Flight> flights) {
		this.flights = flights;
	}

	public Set<FlightTicket> getQuickReservationTickets() {
		return quickReservationTickets;
	}

	public void setQuickReservationTickets(Set<FlightTicket> quickReservationTickets) {
		this.quickReservationTickets = quickReservationTickets;
	}

	public List<Seat> getFlightConfiguration() {
		return flightConfiguration;
	}

	public void setFlightConfiguration(List<Seat> flightConfiguration) {
		this.flightConfiguration = flightConfiguration;
	}

	public Set<AirlineService> getServices() {
		return services;
	}

	public void setServices(Set<AirlineService> services) {
		this.services = services;
	}

	public Set<Grade> getGrades() {
		return grades;
	}

	public void setGrades(Set<Grade> grades) {
		this.grades = grades;
	}

	public Set<AirlineAdmin> getAdmins() {
		return admins;
	}

	public void setAdmins(Set<AirlineAdmin> admins) {
		this.admins = admins;
	}
	
}