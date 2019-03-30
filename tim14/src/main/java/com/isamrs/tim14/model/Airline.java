package com.isamrs.tim14.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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
	
	@Column(name = "address")
	private String address;
	
	@Column(name = "description")
	private String description;
	
	@Column(name = "destinations")
	private String destinations;
	
	@Column(name = "flights")
	private String flights;
	
	@Column(name = "quick_reservation_tickets")
	private String quickReservationTickets;
	
	@Column(name = "flight_configuration")
	private String flightConfiguration;
	
	@Column(name = "pricelist")
	private String pricelist;
	
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

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDestinations() {
		return destinations;
	}

	public void setDestinations(String destinations) {
		this.destinations = destinations;
	}

	public String getFlights() {
		return flights;
	}

	public void setFlights(String flights) {
		this.flights = flights;
	}

	public String getQuickReservationTickets() {
		return quickReservationTickets;
	}

	public void setQuickReservationTickets(String quickReservationTickets) {
		this.quickReservationTickets = quickReservationTickets;
	}

	public String getFlightConfiguration() {
		return flightConfiguration;
	}

	public void setFlightConfiguration(String flightConfiguration) {
		this.flightConfiguration = flightConfiguration;
	}

	public String getPricelist() {
		return pricelist;
	}

	public void setPricelist(String pricelist) {
		this.pricelist = pricelist;
	}
	
}