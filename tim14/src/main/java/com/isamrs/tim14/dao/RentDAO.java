package com.isamrs.tim14.dao;

import java.util.Date;
import java.util.List;
import java.util.Set;

import com.isamrs.tim14.model.BranchOffice;
import com.isamrs.tim14.model.RentACar;

public interface RentDAO {

	public List<RentACar> getRents();
	public RentACar save(RentACar rent);
	public RentACar getRent(int id);
	public void deleteRent(int id);
	public Set<BranchOffice> getRentOffices(int id);
	public List<RentACar> getRentSearch(String rentName, String rentDestination, Long checkIn, Long checkOut);
	public List<RentACar> getRentsFromReservations();
	public Integer getGrade(Integer id);
	public Integer getGradeRent();
	public void setGrade(Integer id, Integer grade);	
	public RentACar changeRent(RentACar rent);
	public double getIncome(Date start, Date end);
	
}
