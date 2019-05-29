package com.isamrs.tim14.dao;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.AirlineAdmin;
import com.isamrs.tim14.model.Authority;
import com.isamrs.tim14.model.User;
import com.isamrs.tim14.model.UserType;
import com.isamrs.tim14.service.CustomUserDetailsService;

@Repository
public class AirlineAdminDAOImpl implements AirlineAdminDAO{
	
	private EntityManager entityManager;
	
	@Autowired
	private CustomUserDetailsService customService;
	
	
	@Autowired
	public AirlineAdminDAOImpl(EntityManager entity) {
		this.entityManager = entity;
	}

	@Override
	@Transactional
	public List<AirlineAdmin> getAirlineAdmins() {
		Query query = entityManager.createQuery("SELECT a FROM User a");
		List<AirlineAdmin> result = query.getResultList();
		return result;
	}

	@Override
	@Transactional
	public AirlineAdmin save(AirlineAdmin airlineAdmin) {
		Query query = entityManager.createQuery("SELECT a FROM User a WHERE lower(a.username) LIKE :aUsername OR lower(a.email) LIKE :aEmail");
		query.setParameter("aUsername", airlineAdmin.getUsername());
		query.setParameter("aEmail", airlineAdmin.getEmail());
		List<User> result = query.getResultList();
		
		if(result.size() == 0) {
			List<Authority> authorities = new ArrayList<Authority>();
			Authority a = new Authority();
			a.setUserType(UserType.ROLE_AIRLINEADMIN);
			authorities.add(a);
			airlineAdmin.setAuthorities(authorities);
			airlineAdmin.setPassword(customService.encodePassword(airlineAdmin.getPassword()));
			entityManager.persist(airlineAdmin);
			return airlineAdmin;
		}else {
			return null;
		}
	}

	@Override
	@Transactional
	public AirlineAdmin getAirlineAdmin(int id) {
		Query query = entityManager.createQuery("SELECT a FROM User a WHERE a.id = :aId");
		query.setParameter("aId",id);
		List<AirlineAdmin> result = query.getResultList();
		
		if(result.size() == 0) {
			return null;
		}
		
		return result.get(0);
	}
	
	@Override
	@Transactional
	public ResponseEntity<String> updateProfile(AirlineAdmin admin) {
		AirlineAdmin loggedIn = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		AirlineAdmin managedLoggedIn = entityManager.find(AirlineAdmin.class, loggedIn.getId());
		
		if(admin.getPassword() != "") {
			managedLoggedIn.setPassword(customService.encodePassword(admin.getPassword()));
		}
		
		managedLoggedIn.setFirstName(admin.getFirstName());
		managedLoggedIn.setLastName(admin.getLastName());
		managedLoggedIn.setEmail(admin.getEmail());
		managedLoggedIn.setCity(admin.getCity());
		managedLoggedIn.setPhoneNumber(admin.getPhoneNumber());
		
		return new ResponseEntity("Profile informations successfully changed.", HttpStatus.OK);
	}

}
