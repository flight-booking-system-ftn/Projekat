package com.isamrs.tim14.model;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "flight")
public class Flight {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;
	
	@ManyToOne(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH }, fetch = FetchType.LAZY)
	@JoinColumn(name = "airline_id")
	@JsonIgnoreProperties("flights")
	private Airline airline;
	
	@JoinColumn(name = "start_airport_id")
	@OneToOne(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH }, fetch = FetchType.LAZY)
	private Airport from;
	
	@JoinColumn(name = "end_airport_id")
	@OneToOne(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH }, fetch = FetchType.LAZY)
	private Airport to;

	@Column(name = "departure_date")
	private Timestamp departureDate;

	@Column(name = "arrival_date")
	private Timestamp arrivalDate;

	@Column(name = "flight_length")
	private Integer flightLength;
	
	@Column(name = "luggage_quantity")
	private Integer luggageQuantity;
	
	@Column(name = "flight_duration")
	private Double flightDuration;
	
	@Column(name = "ticket_price_first_class")
	private Double ticketPriceFirstClass;
	
	@Column(name = "ticket_price_business_class")
	private Double ticketPriceBusinessClass;
	
	@Column(name = "ticket_price_economy_class")
	private Double ticketPriceEconomyClass;
	
	@ManyToMany(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH }, fetch = FetchType.LAZY)
	@JoinTable(name = "flight_stopover", joinColumns = { @JoinColumn(name = "flight_id") }, inverseJoinColumns = {
			@JoinColumn(name = "stopover_id") })
	private Set<Airport> stops;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private Set<Grade> grades;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinColumn(name = "flight_id")
	private List<Seat> seats;

	public Flight() {
		super();
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Airline getAirline() {
		return airline;
	}

	public void setAirline(Airline airline) {
		this.airline = airline;
	}

	public Airport getFrom() {
		return from;
	}

	public void setFrom(Airport from) {
		this.from = from;
	}

	public Airport getTo() {
		return to;
	}

	public void setTo(Airport to) {
		this.to = to;
	}

	public Timestamp getDepartureDate() {
		return departureDate;
	}

	public void setDepartureDate(Timestamp departureDate) {
		this.departureDate = departureDate;
	}

	public Timestamp getArrivalDate() {
		return arrivalDate;
	}

	public void setArrivalDate(Timestamp arrivalDate) {
		this.arrivalDate = arrivalDate;
	}

	public Integer getFlightLength() {
		return flightLength;
	}

	public void setFlightLength(Integer flightLength) {
		this.flightLength = flightLength;
	}

	public Integer getLuggageQuantity() {
		return luggageQuantity;
	}

	public void setLuggageQuantity(Integer luggageQuantity) {
		this.luggageQuantity = luggageQuantity;
	}

	public Double getFlightDuration() {
		return flightDuration;
	}

	public void setFlightDuration(Double flightDuration) {
		this.flightDuration = flightDuration;
	}

	public Double getTicketPriceFirstClass() {
		return ticketPriceFirstClass;
	}

	public void setTicketPriceFirstClass(Double ticketPriceFirstClass) {
		this.ticketPriceFirstClass = ticketPriceFirstClass;
	}

	public Double getTicketPriceBusinessClass() {
		return ticketPriceBusinessClass;
	}

	public void setTicketPriceBusinessClass(Double ticketPriceBusinessClass) {
		this.ticketPriceBusinessClass = ticketPriceBusinessClass;
	}

	public Double getTicketPriceEconomyClass() {
		return ticketPriceEconomyClass;
	}

	public void setTicketPriceEconomyClass(Double ticketPriceEconomyClass) {
		this.ticketPriceEconomyClass = ticketPriceEconomyClass;
	}

	public Set<Airport> getStops() {
		return stops;
	}

	public void setStops(Set<Airport> stops) {
		this.stops = stops;
	}

	public Set<Grade> getGrades() {
		return grades;
	}

	public void setGrades(Set<Grade> grades) {
		this.grades = grades;
	}

	public List<Seat> getSeats() {
		return seats;
	}

	public void setSeats(List<Seat> seats) {
		this.seats = seats;
	}

}
