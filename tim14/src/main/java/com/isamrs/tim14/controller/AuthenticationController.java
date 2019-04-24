package com.isamrs.tim14.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.isamrs.tim14.model.AirlineAdmin;
import com.isamrs.tim14.model.HotelAdmin;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.RentACarAdmin;
import com.isamrs.tim14.model.User;
import com.isamrs.tim14.model.UserTokenState;
import com.isamrs.tim14.model.UserType;
import com.isamrs.tim14.security.TokenUtils;
import com.isamrs.tim14.security.auth.JwtAuthenticationRequest;
import com.isamrs.tim14.service.CustomUserDetailsService;

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
		String jwt = tokenUtils.generateToken(user.getUsername());
		int expiresIn = tokenUtils.getExpiredIn();

		UserType ut = null;
		String redirectionURL = "#";
		
		if (user instanceof RegisteredUser) {
			ut = UserType.REGISTERED_USER;
			redirectionURL = "index.html";}
			
		else if (user instanceof AirlineAdmin) {
			ut = UserType.AIRLINE_ADMIN;
			redirectionURL = "airlineAdmin.html";
			}
		else if (user instanceof HotelAdmin) {
			ut = UserType.HOTEL_ADMIN;
			redirectionURL = "hotelAdmin.html";
			}
		else if (user instanceof RentACarAdmin) {
			ut = UserType.RENT_A_CAR_ADMIN;
			redirectionURL = "rentACarAdmin.html";
			}
		else {
			ut = UserType.SYSTEM_ADMIN;
			redirectionURL = "systemAdmin.html";
		}
		
		ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
		attr.getRequest().getSession().setAttribute("user", user);
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