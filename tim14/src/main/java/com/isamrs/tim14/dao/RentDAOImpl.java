package com.isamrs.tim14.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.RentACar;

@Repository
public class RentDAOImpl implements RentDAO {

	private EntityManager entityManager;

	@Autowired
	public RentDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	@Override
	@Transactional
	public List<RentACar> getRents() {

		Query query = entityManager.createQuery("SELECT rent FROM RentACar rent");
		List<RentACar> result = query.getResultList();
		return result;
	}

	@Override
	@Transactional
	public RentACar save(RentACar rent) {
		Query query = entityManager.createQuery("SELECT rent FROM RentACar rent WHERE lower(rent.name) LIKE :rentName");
		query.setParameter("rentName", rent.getName());
		List<RentACar> result = query.getResultList();

		if (result.size() == 0) {
			entityManager.persist(rent);
			return rent;
		} else {
			return null;
		}
	}

	@Override
	@Transactional
	public RentACar getRent(int id) {
		Query query = entityManager.createQuery("SELECT rent FROM RentACar rent WHERE rent.id = :rentId");
		query.setParameter("rentId", id);
		List<RentACar> result = query.getResultList();

		if (result.size() == 0) {
			return null;
		}

		return result.get(0);
	}

	@Override
	@Transactional
	public void deleteRent(int id) {

	}

	@Override
	@Transactional
	public List<RentACar> getRentSearch(String search) {
		Query query = entityManager.createQuery("SELECT r FROM RentACar r WHERE r.name LIKE :rentName");
		query.setParameter("rentName", "%" + search + "%");
		List<RentACar> result = query.getResultList();
		return result;
	}

}
