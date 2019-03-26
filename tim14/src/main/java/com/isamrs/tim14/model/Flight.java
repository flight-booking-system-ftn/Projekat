package com.isamrs.tim14.model;

import java.sql.Date;
import java.util.HashSet;

public class Flight {

	private Date departureDate;
	private Date returnDate;
	private Integer flightTime;
	private Integer flightLength;
	private Integer price;
	private Integer stopNumber;
	private HashSet<Destination> stopDestinations;
	
	
	public Flight() {
		super();
		stopDestinations = new HashSet<Destination>();
	}


	public Flight(Date departureDate, Date returnDate, Integer flightTime, Integer flightLength, Integer price,
			Integer stopNumber, HashSet<Destination> stopDestinations) {
		super();
		this.departureDate = departureDate;
		this.returnDate = returnDate;
		this.flightTime = flightTime;
		this.flightLength = flightLength;
		this.price = price;
		this.stopNumber = stopNumber;
		this.stopDestinations = stopDestinations;
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


	public Integer getPrice() {
		return price;
	}


	public void setPrice(Integer price) {
		this.price = price;
	}


	public Integer getStopNumber() {
		return stopNumber;
	}


	public void setStopNumber(Integer stopNumber) {
		this.stopNumber = stopNumber;
	}


	public HashSet<Destination> getStopDestinations() {
		return stopDestinations;
	}


	public void setStopDestinations(HashSet<Destination> stopDestinations) {
		this.stopDestinations = stopDestinations;
	}


	@Override
	public String toString() {
		return "Flight [departureDate=" + departureDate + ", returnDate=" + returnDate + ", flightTime=" + flightTime
				+ ", flightLength=" + flightLength + ", price=" + price + ", stopNumber=" + stopNumber
				+ ", stopDestinations=" + stopDestinations + "]";
	}
	
	
	
	
	
	
	
	
}
