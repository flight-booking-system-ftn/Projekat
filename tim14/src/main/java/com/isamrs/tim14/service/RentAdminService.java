package com.isamrs.tim14.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.dto.UserDTO;
import com.isamrs.tim14.model.Authority;
import com.isamrs.tim14.model.RentACar;
import com.isamrs.tim14.model.RentACarAdmin;
import com.isamrs.tim14.model.UserType;
import com.isamrs.tim14.repository.IRentACarAdminRepository;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class RentAdminService {
	
	@Autowired
	private IRentACarAdminRepository rentACarAdminRepository;
	
	@Autowired
	private CustomUserDetailsService customService;
	
	public List<RentACarAdmin> getRentAdmins() {
		return rentACarAdminRepository.findAll();
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public RentACarAdmin save(RentACarAdmin rentAdmin) {
		RentACarAdmin result = rentACarAdminRepository.findOneByUsernameAndEmail(rentAdmin.getUsername(), rentAdmin.getEmail());

		if (result == null) {
			List<Authority> authorities = new ArrayList<Authority>();

			Authority a = new Authority();
			a.setUserType(UserType.ROLE_RENTACARADMIN);
			authorities.add(a);
			rentAdmin.setAuthorities(authorities);
			rentAdmin.setPassword(customService.encodePassword(rentAdmin.getPassword()));

			return rentACarAdminRepository.save(rentAdmin);
		} else {
			return null;
		}
	}
	
	public RentACarAdmin findById(int id) {
		return rentACarAdminRepository.getOne(id);
	}
	
	public RentACar getCurrentRent() {
		RentACarAdmin admin = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		return admin.getRentACar();
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public RentACarAdmin updateAdmin(UserDTO user) {
		RentACarAdmin admin = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		RentACarAdmin managedRentACarAdmin = rentACarAdminRepository.getOne(admin.getId());
		
		if(!user.getPassword().equals("")) {
			managedRentACarAdmin.setPassword(this.customService.encodePassword(user.getPassword()));
		}
		
		managedRentACarAdmin.setFirstName(user.getFirstName());
		managedRentACarAdmin.setLastName(user.getLastName());
		managedRentACarAdmin.setEmail(user.getEmail());
		managedRentACarAdmin.setPhoneNumber(user.getPhone());
		managedRentACarAdmin.setCity(user.getCity());
		
		return managedRentACarAdmin;
	}

}
