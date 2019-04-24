package com.isamrs.tim14.model;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "airline")
public class Airline {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;

	@Column(name = "name")
	private String name;

	@OneToOne(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH }, fetch = FetchType.LAZY)
	@JoinColumn(name = "destination_id")
	private Destination destination;

	@Column(name = "description")
	private String description;

	@ManyToMany(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH }, fetch = FetchType.LAZY)
	@JoinTable(name = "airline_airport", joinColumns = { @JoinColumn(name = "airline_id") }, inverseJoinColumns = {
			@JoinColumn(name = "airport_id") })
	private Set<Airport> airports;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "airline")
	private Set<Flight> flights;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private Set<FlightTicket> quickReservationTickets;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "airline")
	private Set<AirlineService> services;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private Set<Grade> grades;

	@ElementCollection(targetClass = AirlineAdmin.class)
	private Set<AirlineAdmin> admins;

	public Airline() {
		super();
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
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

	public Set<Airport> getAirports() {
		return airports;
	}

	public void setAirports(Set<Airport> airports) {
		this.airports = airports;
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