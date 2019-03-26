package com.isamrs.tim14.model;

import java.util.HashSet;

public class Hotel {

	private String name;
	
	private Address address;
	
	private String description;
	
	private HashSet<Service> services;
	
	private HashSet<Room> rooms;
	
	public Hotel() {
		rooms = new HashSet<Room>();
		services = new HashSet<Service>();
	}
	
	

	public Hotel(String name, Address address, String description, HashSet<Service> services,
			HashSet<Room> rooms) {
		super();
		this.name = name;
		this.address = address;
		this.description = description;
		this.services = services;
		this.rooms = rooms;
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

	public HashSet<Room> getRooms() {
		return rooms;
	}

	public void setRooms(HashSet<Room> rooms) {
		this.rooms = rooms;
	}



	@Override
	public String toString() {
		return "Hotel [name=" + name + ", address=" + address + ", description=" + description + ", services="
				+ services + ", rooms=" + rooms + "]";
	}
	
	
	
	
	
	
	
	
}
