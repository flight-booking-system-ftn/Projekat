package com.isamrs.tim14.dao;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.Authority;
import com.isamrs.tim14.model.HotelAdmin;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.User;
import com.isamrs.tim14.model.UserType;
import com.isamrs.tim14.service.CustomUserDetailsService;

@Repository
public class HotelAdminDAOImpl implements HotelAdminDAO {

	private EntityManager entityManager;
	
	@Autowired
	private CustomUserDetailsService customService;
	
	@Autowired
	public HotelAdminDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
	

	@Override
	@Transactional
	public List<HotelAdmin> getHotelAdmins() {
		Query query = entityManager.createQuery("SELECT hot FROM User hot");
		List<HotelAdmin> result = query.getResultList();
		return result;
	}

	@Override
	@Transactional
	public HotelAdmin save(HotelAdmin hotelAdmin) {
		Query query = entityManager.createQuery("SELECT h FROM User h WHERE lower(h.username) LIKE :hUsername OR lower(h.email) LIKE :hEmail");
		query.setParameter("hUsername", hotelAdmin.getUsername());
		query.setParameter("hEmail", hotelAdmin.getEmail());
		List<User> result = query.getResultList();
		
		if(result.size() == 0) {
			List<Authority> authorities = new ArrayList<Authority>();
			Authority a = new Authority();
			a.setUserType(UserType.ROLE_HOTELADMIN);
			authorities.add(a);
			hotelAdmin.setAuthorities(authorities);
			hotelAdmin.setPassword(customService.encodePassword(hotelAdmin.getPassword()));
			entityManager.persist(hotelAdmin);
			return hotelAdmin;
		}else {
			return null;
		}
	}

	@Override
	@Transactional
	public HotelAdmin getHotelAdmin(int id) {
		Query query = entityManager.createQuery("SELECT h FROM User h WHERE h.id = :hId");
		query.setParameter("hId",id);
		List<HotelAdmin> result = query.getResultList();
		
		if(result.size() == 0) {
			return null;
		}
		return result.get(0);
	}

	
	
}
