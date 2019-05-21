package com.isamrs.tim14.dao;

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
import com.isamrs.tim14.model.AirlineOffice;

@Repository
public class AirlineOfficeDAOImpl implements AirlineOfficeDAO {
	
	private EntityManager entityManager;

	@Autowired
	public AirlineOfficeDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	@Override
	@Transactional
	public ResponseEntity<String> save(AirlineOffice office) {
		Query query = entityManager.createQuery("SELECT a FROM AirlineOffice a WHERE a.name LIKE :office_name AND a.address LIKE :office_address");
		query.setParameter("office_name", office.getName());
		query.setParameter("office_address", office.getAddress());
		
		List<AirlineOffice> result = query.getResultList();
		
		if(result.size() > 0) {
			return new ResponseEntity("Office already exists.", HttpStatus.FORBIDDEN);
		}
		
		//AirlineAdmin admin = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		//admin.getAirline().getOffices().add(office);
		
		entityManager.persist(office);
		
		return new ResponseEntity("Office successfully saved.", HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<List<AirlineOffice>> allOffices() {
		Query query = entityManager.createQuery("SELECT a FROM AirlineOffice a");
		List<AirlineOffice> result = query.getResultList();
		
		return new ResponseEntity(result, HttpStatus.OK);
	}

}
