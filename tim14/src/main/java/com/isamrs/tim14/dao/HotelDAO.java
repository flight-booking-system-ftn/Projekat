package com.isamrs.tim14.dao;

import java.util.List;

import com.isamrs.tim14.model.Hotel;


public interface HotelDAO {

	public List<Hotel> getHotels();
	
	public Hotel save(Hotel hotel);
	
	public Hotel getHotel(int id);
	
	public void deleteHotel(int id);
	
	public List<Hotel> getHotelsSearch(String hotelName, String hotelDestination, long checkIn, long checkOut);
	
	public Hotel changeHotel(Hotel hotel);
}
