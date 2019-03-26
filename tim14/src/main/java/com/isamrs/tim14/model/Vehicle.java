package com.isamrs.tim14.model;

public class Vehicle {

	private String registration;
	private VehicleType type;
	
	public Vehicle() {
		
	}
	
	public Vehicle(String registration, VehicleType type) {
		super();
		this.registration = registration;
		this.type = type;
	}

	public String getRegistration() {
		return registration;
	}

	public void setRegistration(String registration) {
		this.registration = registration;
	}

	public VehicleType getType() {
		return type;
	}

	public void setType(VehicleType type) {
		this.type = type;
	}

	@Override
	public String toString() {
		return "Vehicle [registration=" + registration + ", type=" + type + "]";
	}
	
	
	
}
