package com.isamrs.tim14.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.model.AirlineAdmin;
import com.isamrs.tim14.model.Authority;
import com.isamrs.tim14.model.UserType;
import com.isamrs.tim14.repository.IAirlineAdminRepository;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class AirlineAdminService {
	
	@Autowired
	private IAirlineAdminRepository airlineAdminRepository;

	@Autowired
	private CustomUserDetailsService customService;
	
	public List<AirlineAdmin> getAirlineAdmins() {
		return airlineAdminRepository.findAll();
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public AirlineAdmin save(AirlineAdmin airlineAdmin) {
		AirlineAdmin result = airlineAdminRepository.findOneByUsernameAndEmail(airlineAdmin.getUsername(), airlineAdmin.getEmail());
		
		if(result == null) {
			List<Authority> authorities = new ArrayList<Authority>();
			
			Authority a = new Authority();
			a.setUserType(UserType.ROLE_AIRLINEADMIN);
			authorities.add(a);
			airlineAdmin.setAuthorities(authorities);
			airlineAdmin.setPassword(customService.encodePassword(airlineAdmin.getPassword()));
			
			return airlineAdminRepository.save(airlineAdmin);
		}else {
			return null;
		}
	}
	
	public AirlineAdmin findById(int id) {
		return airlineAdminRepository.getOne(id);
	}
	
	public void updateProfile(AirlineAdmin admin) {
		AirlineAdmin loggedIn = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		AirlineAdmin managedLoggedIn = airlineAdminRepository.getOne(loggedIn.getId());
		
		if(admin.getPassword() != "") {
			managedLoggedIn.setPassword(customService.encodePassword(admin.getPassword()));
		}
		
		managedLoggedIn.setFirstName(admin.getFirstName());
		managedLoggedIn.setLastName(admin.getLastName());
		managedLoggedIn.setEmail(admin.getEmail());
		managedLoggedIn.setCity(admin.getCity());
		managedLoggedIn.setPhoneNumber(admin.getPhoneNumber());
	}
	
}
