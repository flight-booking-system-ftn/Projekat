package com.isamrs.tim14.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.Destination;

@Repository
public class DestinationDAOImpl implements DestinationDAO {
	private EntityManager entityManager;
	
	@Autowired
	public DestinationDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
	
	@Override
	@Transactional
	public Destination save(Destination destination) {
		entityManager.persist(destination);
		
		return destination;
	}

	@Override
	@Transactional
	public Destination getDestination(int id) {
		Query query = entityManager.createQuery("SELECT d FROM Destination d WHERE d.id = :dId");
		query.setParameter("dId", id);
		List<Destination> result = query.getResultList();
		
		if(result.size() == 0) {
			return null;
		}else {
			return result.get(0);
		}
	}

	@Override
	public List<Destination> getDestinations() {
		Query query = entityManager.createQuery("SELECT d FROM Destination d");
		List<Destination> result = query.getResultList();
		return result;
	}
}
