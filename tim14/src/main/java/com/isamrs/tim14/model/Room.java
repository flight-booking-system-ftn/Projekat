package com.isamrs.tim14.model;

public class Room {

	private Integer number;
	private Integer bedNumber;
	private Integer floor;
	
	public Room() {
		
	}

	public Room(Integer number, Integer bedNumber, Integer floor) {
		super();
		this.number = number;
		this.bedNumber = bedNumber;
		this.floor = floor;
	}

	public Integer getNumber() {
		return number;
	}

	public void setNumber(Integer number) {
		this.number = number;
	}

	public Integer getBedNumber() {
		return bedNumber;
	}

	public void setBedNumber(Integer bedNumber) {
		this.bedNumber = bedNumber;
	}

	public Integer getFloor() {
		return floor;
	}

	public void setFloor(Integer floor) {
		this.floor = floor;
	}

	@Override
	public String toString() {
		return "Room [number=" + number + ", bedNumber=" + bedNumber + ", floor=" + floor + "]";
	}
	
	
	
}
