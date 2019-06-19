package com.isamrs.tim14.dto;

import java.util.List;

import com.isamrs.tim14.model.FlightReservation;
import com.isamrs.tim14.model.RoomReservation;
import com.isamrs.tim14.model.VehicleReservation;

public class ReservationsDTO {

	private List<FlightReservation> flightReservation;
	private String flightQuick;
	
	private RoomReservation roomReservation;
	private String roomQuick;
	
	private VehicleReservation vehicleReservation;
	private String vehicleQuick;
	
	public ReservationsDTO() {
		super();
	}

	public List<FlightReservation> getFlightReservation() {
		return flightReservation;
	}

	public void setFlightReservation(List<FlightReservation> flightReservation) {
		this.flightReservation = flightReservation;
	}

	public String getFlightQuick() {
		return flightQuick;
	}

	public void setFlightQuick(String flightQuick) {
		this.flightQuick = flightQuick;
	}

	public RoomReservation getRoomReservation() {
		return roomReservation;
	}

	public void setRoomReservation(RoomReservation roomReservation) {
		this.roomReservation = roomReservation;
	}

	public String getRoomQuick() {
		return roomQuick;
	}

	public void setRoomQuick(String roomQuick) {
		this.roomQuick = roomQuick;
	}

	public VehicleReservation getVehicleReservation() {
		return vehicleReservation;
	}

	public void setVehicleReservation(VehicleReservation vehicleReservation) {
		this.vehicleReservation = vehicleReservation;
	}

	public String getVehicleQuick() {
		return vehicleQuick;
	}

	public void setVehicleQuick(String vehicleQuick) {
		this.vehicleQuick = vehicleQuick;
	}
	
}
