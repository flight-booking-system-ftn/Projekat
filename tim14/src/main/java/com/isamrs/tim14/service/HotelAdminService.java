package com.isamrs.tim14.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.dto.UserDTO;
import com.isamrs.tim14.model.Hotel;
import com.isamrs.tim14.model.HotelAdmin;
import com.isamrs.tim14.model.User;
import com.isamrs.tim14.repository.IHotelAdminRepository;
import com.isamrs.tim14.repository.IUserRepository;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class HotelAdminService {
	
	@Autowired
	private IHotelAdminRepository hotelAdminRepository;
	
	@Autowired
	private IUserRepository userRepository;
	
	@Autowired
	private CustomUserDetailsService userDetailsService;
	
	public HotelAdmin getHotelAdmin(int id) {
		return hotelAdminRepository.findOneById(id);
	}
	
	public Hotel getCurrentHotel() {
		HotelAdmin admin = (HotelAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return admin.getHotel();
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public HotelAdmin updateAdmin(UserDTO user) {
		HotelAdmin admin = (HotelAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		HotelAdmin managedHotelAdmin = hotelAdminRepository.findOneById(admin.getId());
		
		if(!user.getPassword().equals("")) {
			managedHotelAdmin.setPassword(this.userDetailsService.encodePassword(user.getPassword()));
		}
		
		managedHotelAdmin.setFirstName(user.getFirstName());
		managedHotelAdmin.setLastName(user.getLastName());
		managedHotelAdmin.setEmail(user.getEmail());
		managedHotelAdmin.setPhoneNumber(user.getPhone());
		managedHotelAdmin.setCity(user.getCity());
		
		return managedHotelAdmin;
	}
	

}
