package com.isamrs.tim14.others;

import java.util.List;

public class FlightsSearch {
	public int airlineID;
	public String tripType, seatClass;
	public Integer passengers, bags, priceRange;
	public Double durationRange;
	public List<FlightPathAndDate> data;
	
	public FlightsSearch() {
		super();
	}

	public int getAirlineID() {
		return airlineID;
	}

	public void setAirlineID(int airlineID) {
		this.airlineID = airlineID;
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

	public Integer getPriceRange() {
		return priceRange;
	}

	public void setPriceRange(Integer priceRange) {
		this.priceRange = priceRange;
	}

	public Double getDurationRange() {
		return durationRange;
	}

	public void setDurationRange(Double durationRange) {
		this.durationRange = durationRange;
	}

	public List<FlightPathAndDate> getData() {
		return data;
	}

	public void setData(List<FlightPathAndDate> data) {
		this.data = data;
	}
}
