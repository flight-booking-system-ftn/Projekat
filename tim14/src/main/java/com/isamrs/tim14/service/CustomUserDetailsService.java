package com.isamrs.tim14.service;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.isamrs.tim14.model.AirlineAdmin;
import com.isamrs.tim14.model.HotelAdmin;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.RentACarAdmin;
import com.isamrs.tim14.model.SystemAdmin;
import com.isamrs.tim14.model.User;
import com.isamrs.tim14.repository.IAirlineAdminRepository;
import com.isamrs.tim14.repository.IHotelAdminRepository;
import com.isamrs.tim14.repository.IRegistrationRepository;
import com.isamrs.tim14.repository.IRentACarAdminRepository;
import com.isamrs.tim14.repository.ISystemAdminRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	protected final Log LOGGER = LogFactory.getLog(getClass());

	@Autowired
	private IHotelAdminRepository hotelAdminRepository;
	
	@Autowired
	private IRentACarAdminRepository rentACarAdminRepository;
	
	@Autowired
	private IAirlineAdminRepository airlineAdminRepository;
	
	@Autowired
	private IRegistrationRepository registeredUserRepository;
	
	@Autowired
	private ISystemAdminRepository systemAdminRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private AuthenticationManager authenticationManager;

	// Funkcija koja na osnovu username-a iz baze vraca objekat User-a
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		List<RegisteredUser> users = registeredUserRepository.findAll();
		if (users != null) {
			for(User u : users) {
				if(u.getUsername().equals(username)) {
					return u;
					}
				}
			}
		
		List<HotelAdmin> hotelAdmins = hotelAdminRepository.findAll();
		if (hotelAdmins != null) {
			for(User u : hotelAdmins) {
				if(u.getUsername().equals(username)) {
					return u;
					}
				}
			}
		List<AirlineAdmin> airlineAdmins = airlineAdminRepository.findAll();
		if (airlineAdmins != null) {
			for(User u : airlineAdmins) {
				if(u.getUsername().equals(username)) {
					return u;
					}
				}
			}
		
		List<RentACarAdmin> rentAdmin = rentACarAdminRepository.findAll();
		if (rentAdmin != null) {
			for(User u : rentAdmin) {
				if(u.getUsername().equals(username)) {
					return u;
					}
				}
			}
		
		List<SystemAdmin> sysAdmin = systemAdminRepository.findAll();
		if (sysAdmin != null) {
			for(User u : sysAdmin) {
				if(u.getUsername().equals(username)) {
					return u;
					}
				}
			}
		
		
		throw new UsernameNotFoundException(String.format("No user found with username '%s'.", username));
	}
	
	
	public String encodePassword(String password) {
		return this.passwordEncoder.encode(password);
	}
	
	
	// Funkcija pomocu koje korisnik menja svoju lozinku
	public void changePassword(String oldPassword, String newPassword) {

		Authentication currentUser = SecurityContextHolder.getContext().getAuthentication();
		String username = currentUser.getName();

		if (authenticationManager != null) {
			LOGGER.debug("Re-authenticating user '" + username + "' for password change request.");

			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, oldPassword));
		} else {
			LOGGER.debug("No authentication manager set. can't change Password!");

			return;
		}

		LOGGER.debug("Changing password for user '" + username + "'");

		User user = (User) loadUserByUsername(username);

		// pre nego sto u bazu upisemo novu lozinku, potrebno ju je hesirati
		// ne zelimo da u bazi cuvamo lozinke u plain text formatu
		user.setPassword(passwordEncoder.encode(newPassword));
		//userRepository.save(user);

	}
}
