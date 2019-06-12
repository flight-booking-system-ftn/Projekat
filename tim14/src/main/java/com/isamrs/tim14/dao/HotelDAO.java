package com.isamrs.tim14.dao;

import java.util.List;

import com.isamrs.tim14.model.Hotel;
import com.isamrs.tim14.model.RentACar;


public interface HotelDAO {

	public List<Hotel> getHotels();
	
	public Hotel save(Hotel hotel);
	
	public Hotel getHotel(int id);
	
	public void deleteHotel(int id);
	
	public List<Hotel> getHotelsSearch(String hotelName, String hotelDestination, long checkIn, long checkOut);
	
	public Hotel changeHotel(Hotel hotel);
	
	public Integer getGrade(Integer id);
	
	public void setGrade(Integer id, Integer grade);
	
	public List<Hotel> getHotelsFromReservations();
}
