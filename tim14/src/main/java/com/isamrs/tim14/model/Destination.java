package com.isamrs.tim14.model;

public class Destination {

	private String name;
	private String country;
	private Double longitude;
	private Double latitude;
	
	public Destination() {
		super();
	}
	
	public Destination(String name, String country, Double longitude, Double latitude) {
		super();
		this.name = name;
		this.country = country;
		this.longitude = longitude;
		this.latitude = latitude;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
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
		return "Destination [name=" + name + ", country=" + country + ", longitude=" + longitude + ", latitude="
				+ latitude + "]";
	}

	
	
    	
	
	
	
	
}
