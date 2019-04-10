package com.isamrs.tim14.model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "hotel_service")
public class HotelService extends Service {

	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id")
	private Hotel hotel;

	public HotelService() {
		super();
	}

	public Hotel getHotel() {
		return hotel;
	}

	public void setHotel(Hotel hotel) {
		this.hotel = hotel;
	}

}
