package com.isamrs.tim14.others;

import java.util.List;

public class FlightsSearch {
	public String tripType, seatClass;
	public Integer passengers, bags;
	public List<FlightPathAndDate> data;
	
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

	public List<FlightPathAndDate> getData() {
		return data;
	}

	public void setData(List<FlightPathAndDate> data) {
		this.data = data;
	}
}
