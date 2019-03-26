package com.isamrs.tim14.model;

import java.util.HashSet;

public class RentACar {

	private String name;
	
	private Address address;
	
	private String description;
	
	private HashSet<Service> services;
	
	private HashSet<Vehicle> vehicles;
	
	private HashSet<Destination> offices;
	
	public RentACar() {
		services = new HashSet<Service>();
		vehicles = new HashSet<Vehicle>();
		offices = new HashSet<Destination>();
	}

	public RentACar(String name, Address address, String description, HashSet<Service> services,
			HashSet<Vehicle> vehicles, HashSet<Destination> offices) {
		super();
		this.name = name;
		this.address = address;
		this.description = description;
		this.services = services;
		this.vehicles = vehicles;
		this.offices = offices;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public HashSet<Service> getServices() {
		return services;
	}

	public void setServices(HashSet<Service> services) {
		this.services = services;
	}

	public HashSet<Vehicle> getVehicles() {
		return vehicles;
	}

	public void setVehicles(HashSet<Vehicle> vehicles) {
		this.vehicles = vehicles;
	}

	public HashSet<Destination> getOffices() {
		return offices;
	}

	public void setOffices(HashSet<Destination> offices) {
		this.offices = offices;
	}

	
	
	
	
}
