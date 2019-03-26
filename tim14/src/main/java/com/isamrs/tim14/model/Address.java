package com.isamrs.tim14.model;

public class Address {

	private String name;
	private Double longitude;
	private Double latitude;
	
	public Address() {
		super();
	}

	public Address(String name, Double longitude, Double latitude) {
		super();
		this.name = name;
		this.longitude = longitude;
		this.latitude = latitude;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	@Override
	public String toString() {
		return "Address [name=" + name + ", longitude=" + longitude + ", latitude=" + latitude + "]";
	}
	
	
	
}
