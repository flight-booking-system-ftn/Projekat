package com.isamrs.tim14.model;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "room")
public class Room {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;
	
	@Column(name = "room_number")
	private Integer roomNumber;
	
	@Column(name = "bed_number")
	private Integer bedNumber;
	
	@Column(name = "floor")
	private Integer floor;
	
	@Column(name = "price")
	private Double price;
	
	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "room_id")
	private Set<Grade> grades;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id")
	private Hotel hotel;
	
	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "room_id")
	private Set<ReservationInterval> priceIntervals;

	public Room() {
		super();
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getRoomNumber() {
		return roomNumber;
	}

	public void setRoomNumber(Integer roomNumber) {
		this.roomNumber = roomNumber;
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

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Set<Grade> getGrades() {
		return grades;
	}

	public void setGrades(Set<Grade> grades) {
		this.grades = grades;
	}

	public Hotel getHotel() {
		return hotel;
	}

	public void setHotel(Hotel hotel) {
		this.hotel = hotel;
	}

	public Set<ReservationInterval> getPriceIntervals() {
		return priceIntervals;
	}

	public void setPriceIntervals(Set<ReservationInterval> priceIntervals) {
		this.priceIntervals = priceIntervals;
	}

}
