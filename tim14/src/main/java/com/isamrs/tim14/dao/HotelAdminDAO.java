package com.isamrs.tim14.dao;

import java.util.List;

import com.isamrs.tim14.dto.UserDTO;
import com.isamrs.tim14.model.Hotel;
import com.isamrs.tim14.model.HotelAdmin;

public interface HotelAdminDAO {

public List<HotelAdmin> getHotelAdmins();
	
	public HotelAdmin save(HotelAdmin hotelAdmin);
	
	public HotelAdmin getHotelAdmin(int id);
	
	public Hotel getCurrentHotel();
	
	public HotelAdmin updateAdmin(UserDTO user);
	
}
