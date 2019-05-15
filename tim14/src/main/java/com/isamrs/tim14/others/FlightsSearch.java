package com.isamrs.tim14.others;

import java.sql.Timestamp;

import com.isamrs.tim14.model.Airport;

public class FlightsSearch {
	public String tripType, seatClass;
	public Integer passengers, bags;
	public Airport from, to;
	public Timestamp departureDate, returnDate;
	
	public FlightsSearch() {
		super();
	}

	public String getTripType() {
		return tripType;
	}

	public void setTripType(String tripType) {
		this.tripType = tripType;
	}

	public String getSeatClass() {
		return seatClass;
	}

	public void setSeatClass(String seatClass) {
		this.seatClass = seatClass;
	}

	public Integer getPassengers() {
		return passengers;
	}

	public void setPassengers(Integer passengers) {
		this.passengers = passengers;
	}

	public Integer getBags() {
		return bags;
	}

	public void setBags(Integer bags) {
		this.bags = bags;
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

	public Timestamp getReturnDate() {
		return returnDate;
	}

	public void setReturnDate(Timestamp returnDate) {
		this.returnDate = returnDate;
	}
}
