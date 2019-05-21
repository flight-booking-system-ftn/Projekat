package com.isamrs.tim14.others;

import java.sql.Timestamp;

import com.isamrs.tim14.model.Airport;

public class FlightPathAndDate {
	public Airport from, to;
	public Timestamp departureDate, returnDate;
	
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
