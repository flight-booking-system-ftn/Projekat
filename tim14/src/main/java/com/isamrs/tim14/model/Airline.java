package com.isamrs.tim14.model;

import java.util.HashSet;

public class Airline {

	private String name;
	private String address;
	private String description;
	private HashSet<Destination> destinations;
	private HashSet<Flight> flights;
	private HashSet<Ticket> quickReservationTickets;
	//TODO: change1
	private String flightConfiguration;
	//TODO: change2
	private String pricelist;
	
	public Airline() {
		destinations = new HashSet<Destination>();
		flights = new HashSet<Flight>();
		quickReservationTickets = new HashSet<Ticket>();
	}

	public Airline(String name, String address, String description, HashSet<Destination> destinations,
			HashSet<Flight> flights, HashSet<Ticket> quickReservationTickets, String flightConfiguration,
			String pricelist) {
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

	public HashSet<Destination> getDestinations() {
		return destinations;
	}

	public void setDestinations(HashSet<Destination> destinations) {
		this.destinations = destinations;
	}

	public HashSet<Flight> getFlights() {
		return flights;
	}

	public void setFlights(HashSet<Flight> flights) {
		this.flights = flights;
	}

	public HashSet<Ticket> getQuickReservationTickets() {
		return quickReservationTickets;
	}

	public void setQuickReservationTickets(HashSet<Ticket> quickReservationTickets) {
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
