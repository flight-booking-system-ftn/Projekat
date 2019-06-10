package com.isamrs.tim14.dao;

import java.util.List;

import com.isamrs.tim14.dto.UserDTO;
import com.isamrs.tim14.model.RentACar;
import com.isamrs.tim14.model.RentACarAdmin;


public interface RentAdminDAO {

	public List<RentACarAdmin> getRentAdmins();
	
	public RentACarAdmin save(RentACarAdmin rentAdmin);
	
	public RentACarAdmin getRentAdmin(int id);
	
	public RentACar getCurrentRent();
	
	public RentACarAdmin updateAdmin(UserDTO user);
}
