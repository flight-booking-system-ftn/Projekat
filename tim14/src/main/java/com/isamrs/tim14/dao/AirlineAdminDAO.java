package com.isamrs.tim14.dao;

import java.util.List;

import com.isamrs.tim14.model.AirlineAdmin;


public interface AirlineAdminDAO {

	public List<AirlineAdmin> getAirlineAdmins();
	
	public AirlineAdmin save(AirlineAdmin airlineAdmin);
	
	public AirlineAdmin getAirlineAdmin(int id);
		
}
