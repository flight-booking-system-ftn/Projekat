package com.isamrs.tim14.controller;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.model.AirlineAdmin;
import com.isamrs.tim14.model.Authority;
import com.isamrs.tim14.model.FlightReservation;
import com.isamrs.tim14.model.HotelAdmin;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.RentACarAdmin;
import com.isamrs.tim14.model.RoomReservation;
import com.isamrs.tim14.model.User;
import com.isamrs.tim14.model.UserTokenState;
import com.isamrs.tim14.model.UserType;
import com.isamrs.tim14.model.VehicleReservation;
import com.isamrs.tim14.security.TokenUtils;
import com.isamrs.tim14.security.auth.JwtAuthenticationRequest;
import com.isamrs.tim14.service.CustomUserDetailsService;
import com.isamrs.tim14.service.EmailService;

//Kontroler zaduzen za autentifikaciju korisnika
@RestController
@RequestMapping(value = "/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthenticationController {

	@Autowired
	TokenUtils tokenUtils;
	
	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private CustomUserDetailsService userDetailsService;

	@Autowired
	private EmailService mailService;
	
	@RequestMapping(value = "/registration", method = RequestMethod.POST)
	public ResponseEntity<?> register(@RequestBody RegisteredUser user) {
		User u = userDetailsService.findByUsername(user.getUsername());
		if(u != null) {
			return new ResponseEntity<Boolean>(true, HttpStatus.OK);
		}
		u = userDetailsService.findByEmail(user.getEmail());
		if(u != null) {
			return new ResponseEntity<Boolean>(true, HttpStatus.OK);
		}
		RegisteredUser ru = new RegisteredUser();
		ru.setEmail(user.getEmail());
		ru.setPassword(this.userDetailsService.encodePassword(user.getPassword()));
		ru.setBonusPoints(0);
		ru.setFirstName(user.getFirstName());
		List<Authority> authorities = new ArrayList<Authority>();
		Authority a = new Authority();
		a.setUserType(UserType.ROLE_REGISTEREDUSER);
		authorities.add(a);
		ru.setAuthorities(authorities);
		ru.setEnabled(true);
		ru.setFriendList1(new HashSet<RegisteredUser>());
		ru.setFriendList2(new HashSet<RegisteredUser>());
		ru.setLastName(user.getLastName());
		ru.setLastPasswordResetDate(new Timestamp(System.currentTimeMillis()));
		ru.setPhoneNumber(user.getPhoneNumber());
		ru.setCity(user.getCity());
		ru.setUsername(user.getUsername());
		ru.setRoomReservations(new HashSet<RoomReservation>());
		ru.setFlightReservations(new HashSet<FlightReservation>());
		ru.setVehicleReservations(new HashSet<VehicleReservation>());
		
		this.userDetailsService.saveUser(ru);
		
		/*try {
			mailService.sendNotificaitionAsync(ru);
		} catch (MailException | InterruptedException e) {
			e.printStackTrace();
		}*/
		return new ResponseEntity<Boolean>(false, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtAuthenticationRequest authenticationRequest,
			HttpServletResponse response) throws AuthenticationException, IOException {

		final Authentication authentication;
		try {
		 authentication = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(),
						authenticationRequest.getPassword()));
		}
		catch(BadCredentialsException e) {
			return new ResponseEntity<String>("",HttpStatus.OK);
		}
		// Ubaci username + password u kontext
		SecurityContextHolder.getContext().setAuthentication(authentication);

		// Kreiraj token
		User user = (User) authentication.getPrincipal();
		System.out.println(user.getFirstName());
		for(GrantedAuthority gt : user.getAuthorities()) {
			Authority a = (Authority)gt;
			System.out.println(a.getUserType());
			
		}
		String jwt = tokenUtils.generateToken(user.getUsername());
		int expiresIn = tokenUtils.getExpiredIn();

		UserType ut = null;
		String redirectionURL = "#";
		
		if (user instanceof RegisteredUser) {
			ut = UserType.ROLE_REGISTEREDUSER;
			redirectionURL = "index.html";}
			
		else if (user instanceof AirlineAdmin) {
			ut = UserType.ROLE_AIRLINEADMIN;
			redirectionURL = "airlineAdmin.html";
			}
		else if (user instanceof HotelAdmin) {
			ut = UserType.ROLE_HOTELADMIN;
			redirectionURL = "hotelAdmin.html";
			}
		else if (user instanceof RentACarAdmin) {
			ut = UserType.ROLE_RENTACARADMIN;
			redirectionURL = "rentACarAdmin.html";
			}
		else {
			ut = UserType.ROLE_SYSTEMADMIN;
			redirectionURL = "systemAdmin.html";
		}
		UserDetails ud = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		System.out.println(ud.getAuthorities());
		// Vrati token kao odgovor na uspesno autentifikaciju
		return ResponseEntity.ok(new UserTokenState(jwt, expiresIn, ut, redirectionURL));
	}


	@RequestMapping(value = "/change-password", method = RequestMethod.POST)
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<?> changePassword(@RequestBody PasswordChanger passwordChanger) {
		userDetailsService.changePassword(passwordChanger.oldPassword, passwordChanger.newPassword);

		Map<String, String> result = new HashMap<>();
		result.put("result", "success");
		return ResponseEntity.accepted().body(result);
	}

	static class PasswordChanger {
		public String oldPassword;
		public String newPassword;
	}
}