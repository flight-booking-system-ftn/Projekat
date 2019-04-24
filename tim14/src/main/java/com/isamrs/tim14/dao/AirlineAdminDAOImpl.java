package com.isamrs.tim14.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.AirlineAdmin;
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
		Query query = entityManager.createQuery("SELECT a FROM AirlineAdmin a");
		List<AirlineAdmin> result = query.getResultList();
		return result;
	}

	@Override
	@Transactional
	public AirlineAdmin save(AirlineAdmin airlineAdmin) {
		Query query = entityManager.createQuery("SELECT a FROM AirlineAdmin a WHERE lower(a.username) LIKE :aUsername OR lower(a.email) LIKE :aEmail");
		query.setParameter("aUsername", airlineAdmin.getUsername());
		query.setParameter("aEmail", airlineAdmin.getEmail());
		List<AirlineAdmin> result = query.getResultList();
		System.out.println("Result: " + result);
		System.out.println("Admin: " + airlineAdmin);
		
		if(result.size() == 0) {
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
		Query query = entityManager.createQuery("SELECT a FROM AirlineAdmin a WHERE a.id = :aId");
		query.setParameter("aId",id);
		List<AirlineAdmin> result = query.getResultList();
		
		if(result.size() == 0) {
			return null;
		}
		
		return result.get(0);
	}

}
