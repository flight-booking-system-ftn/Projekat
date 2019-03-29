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
	
	//TODO: change1
	@Column(name = "flight_configuration")
	private String flightConfiguration;
	
	//TODO: change2
	@Column(name = "pricelist")
	private String pricelist;
	
	public Airline() {
		
	}

	public Airline(String name, String address, String description, String destinations, String flights,
			String quickReservationTickets, String flightConfiguration, String pricelist) {
		super();
		this.name = name;
		this.address = address;
		this.description = description;
		this.destinations = destinations;
		this.flights = flights;
		this.quickReservationTickets = quickReservationTickets;
		this.flightConfiguration = flightConfiguration;
		this.pricelist = pricelist;
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

	@Override
	public String toString() {
		return "Airline [id=" + id + ", name=" + name + ", address=" + address + ", description=" + description
				+ ", destinations=" + destinations + ", flights=" + flights + ", quickReservationTickets="
				+ quickReservationTickets + ", flightConfiguration=" + flightConfiguration + ", pricelist=" + pricelist
				+ "]";
	}
}