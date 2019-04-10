package com.isamrs.tim14.model;

import java.sql.Date;
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
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "flight")
public class Flight {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;
	
	@Column(name = "departure_date")
	private Date departureDate;
	
	@Column(name = "return_date")
	private Date returnDate;
	
	@Column(name = "flight_time")
	private Integer flightTime;
	
	@Column(name = "flight_length")
	private Integer flightLength;
	
	@Column(name = "stop_number")
	private Integer stopNumber;
	
	@Column(name = "business_class_seats")
	private Integer businessClassSeats;
	
	@Column(name = "economy_class_seats")
	private Integer economyClassSeats;
	
	@Column(name = "first_class_seats")
	private Integer firstClassSeats;
	
	
	@ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "Flight_destination", 
             joinColumns = { @JoinColumn(name = "flight_id") }, 
             inverseJoinColumns = { @JoinColumn(name = "destination_id") })
	private Set<Destination> stopDestinations;
	
	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "flight_id")
	private Set<Grade> grades;
	
	@ElementCollection(targetClass = FlightTicket.class)
	private Set<FlightTicket> tickets;
	
	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "flight_id")
	private Set<Luggage> luggages;
	
	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "flight_id")
	private Set<Seat> seats;
	
	@Column(name = "business_class_price")
	private Double businessClassPrice;
	
	@Column(name = "economy_class_price")
	private Double economyClassPrice;
	
	@Column(name = "first_class_price")
	private Double firstClassPrice;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id")
	private Airline airline;

	public Flight() {
		super();
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Date getDepartureDate() {
		return departureDate;
	}

	public void setDepartureDate(Date departureDate) {
		this.departureDate = departureDate;
	}

	public Date getReturnDate() {
		return returnDate;
	}

	public void setReturnDate(Date returnDate) {
		this.returnDate = returnDate;
	}

	public Integer getFlightTime() {
		return flightTime;
	}

	public void setFlightTime(Integer flightTime) {
		this.flightTime = flightTime;
	}

	public Integer getFlightLength() {
		return flightLength;
	}

	public void setFlightLength(Integer flightLength) {
		this.flightLength = flightLength;
	}

	public Integer getStopNumber() {
		return stopNumber;
	}

	public void setStopNumber(Integer stopNumber) {
		this.stopNumber = stopNumber;
	}

	public Integer getBusinessClassSeats() {
		return businessClassSeats;
	}

	public void setBusinessClassSeats(Integer businessClassSeats) {
		this.businessClassSeats = businessClassSeats;
	}

	public Integer getEconomyClassSeats() {
		return economyClassSeats;
	}

	public void setEconomyClassSeats(Integer economyClassSeats) {
		this.economyClassSeats = economyClassSeats;
	}

	public Integer getFirstClassSeats() {
		return firstClassSeats;
	}

	public void setFirstClassSeats(Integer firstClassSeats) {
		this.firstClassSeats = firstClassSeats;
	}

	public Set<Destination> getStopDestinations() {
		return stopDestinations;
	}

	public void setStopDestinations(Set<Destination> stopDestinations) {
		this.stopDestinations = stopDestinations;
	}

	public Set<Grade> getGrades() {
		return grades;
	}

	public void setGrades(Set<Grade> grades) {
		this.grades = grades;
	}

	public Set<FlightTicket> getTickets() {
		return tickets;
	}

	public void setTickets(Set<FlightTicket> tickets) {
		this.tickets = tickets;
	}

	public Set<Luggage> getLuggages() {
		return luggages;
	}

	public void setLuggages(Set<Luggage> luggages) {
		this.luggages = luggages;
	}

	public Set<Seat> getSeats() {
		return seats;
	}

	public void setSeats(Set<Seat> seats) {
		this.seats = seats;
	}

	public Double getBusinessClassPrice() {
		return businessClassPrice;
	}

	public void setBusinessClassPrice(Double businessClassPrice) {
		this.businessClassPrice = businessClassPrice;
	}

	public Double getEconomyClassPrice() {
		return economyClassPrice;
	}

	public void setEconomyClassPrice(Double economyClassPrice) {
		this.economyClassPrice = economyClassPrice;
	}

	public Double getFirstClassPrice() {
		return firstClassPrice;
	}

	public void setFirstClassPrice(Double firstClassPrice) {
		this.firstClassPrice = firstClassPrice;
	}

	public Airline getAirline() {
		return airline;
	}

	public void setAirline(Airline airline) {
		this.airline = airline;
	}

}
