package com.isamrs.tim14.dao;

import java.util.List;

import com.isamrs.tim14.model.RentACar;

public interface RentDAO {

	public List<RentACar> getRents();
	
	public RentACar save(RentACar rent);
	
	public RentACar getRent(int id);
	
	public void deleteRent(int id);

	public List<RentACar> getRentSearch(String rentName, String rentDestination, String checkIn, String checkOut);

}
