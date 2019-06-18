package com.isamrs.tim14.dao;

import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.BranchOffice;
import com.isamrs.tim14.model.Destination;
import com.isamrs.tim14.model.RentACar;
import com.isamrs.tim14.model.RentACarAdmin;


@Repository
public class BranchOfficeDAOImpl implements BranchOfficeDAO {

	private EntityManager entityManager;

	@Autowired
	public BranchOfficeDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
	
	@Override
	@Transactional
	public BranchOffice save(BranchOffice bo) {
		BranchOffice branch = new BranchOffice();
		branch.setDestination(bo.getDestination());
		branch.setName(bo.getName());
		RentACar rent =((RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getRentACar();
		branch.setRentACar(rent);
		rent.getOffices().add(branch);
		System.out.println("++++++++"+ rent.getName());
		Query query = entityManager.createQuery("SELECT branch FROM BranchOffice branch WHERE lower(branch.rentACar.name) LIKE :rentName");
		query.setParameter("rentName", rent.getName());
		System.out.println("Query: "+ query);
		List<BranchOffice> result = query.getResultList();
		System.out.println("VElicina :"+ result.size()+ "dest" + rent.getDestination());
		if (result.size() != 0) {
			for(BranchOffice b : result) {
				System.out.println("EEEEEEEE");
				if(b.getDestination().getLatitude().equals(bo.getDestination().getLatitude()) &&
						b.getDestination().getLongitude().equals(bo.getDestination().getLongitude()))
				return null;
				}
			}
			entityManager.persist(branch);
			return branch;
		}
	
	@Override
	@Transactional
	public BranchOffice getOffice(int id) {
		Query query = entityManager.createQuery("SELECT d FROM BranchOffice d WHERE d.id = :dId");
		query.setParameter("dId", id);
		List<BranchOffice> result = query.getResultList();

		if (result.size() == 0) {
			return null;
		} else {
			return result.get(0);
		}
	}

	@Override
	@Transactional
	public Set<BranchOffice> getOffices() {
		RentACarAdmin rent = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return rent.getRentACar().getOffices();
	}

	@Override
	@Transactional
	public List<BranchOffice> getBranchesByRent(int id) {
		Query query = entityManager.createQuery("SELECT d FROM BranchOffice d WHERE d.rentACar.id = :dId");
		query.setParameter("dId", id);
		List<BranchOffice> result = query.getResultList();

		if (result.size() == 0) {
			return null;
		} else {
			return result;
		}
	}
	
}
