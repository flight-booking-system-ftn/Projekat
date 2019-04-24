package com.isamrs.tim14.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.RentACarAdmin;
import com.isamrs.tim14.service.CustomUserDetailsService;


@Repository
public class RentAdminDAOImpl implements RentAdminDAO{

	private EntityManager entityManager;
	
	@Autowired
	private CustomUserDetailsService customService;

	@Autowired
	public RentAdminDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	@Override
	@Transactional
	public List<RentACarAdmin> getRentAdmins() {
		Query query = entityManager.createQuery("SELECT r FROM RentACarAdmin r");
		List<RentACarAdmin> result = query.getResultList();
		return result;
	}

	@Override
	@Transactional
	public RentACarAdmin save(RentACarAdmin rentAdmin) {
		Query query = entityManager.createQuery("SELECT r FROM RentACarAdmin r WHERE lower(r.username) LIKE :rUsername OR lower(r.email) LIKE :rEmail");
		query.setParameter("rUsername", rentAdmin.getUsername());
		query.setParameter("rEmail", rentAdmin.getEmail());

		List<RentACarAdmin> result = query.getResultList();
		
		if(result.size() == 0) {
			rentAdmin.setPassword(customService.encodePassword(rentAdmin.getPassword()));
			entityManager.persist(rentAdmin);
			return rentAdmin;
		}else {
			return null;
		}
	}

	@Override
	@Transactional
	public RentACarAdmin getRentAdmin(int id) {
		Query query = entityManager.createQuery("SELECT r FROM RentACarAdmin r WHERE r.id = :rId");
		query.setParameter("rId",id);
		List<RentACarAdmin> result = query.getResultList();
		
		if(result.size() == 0) {
			return null;
		}
		
		return result.get(0);
	}
	
	

}
