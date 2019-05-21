package com.isamrs.tim14.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.RentACarAdmin;
import com.isamrs.tim14.model.Room;
import com.isamrs.tim14.model.Vehicle;

@Repository
public class VehicleDAOImpl implements VehicleDAO {
	private EntityManager entityManager;

	@Autowired
	public VehicleDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	@Override
	@Transactional
	public Vehicle save(Vehicle vehicle) {
		RentACarAdmin admin = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		vehicle.setRentACar(admin.getRentACar());
		entityManager.persist(vehicle);
		return vehicle;
	}

	@Override
	@Transactional
	public List<Vehicle> getVehiclesSearch(Integer rentID, Long arriveDate, Long dayNum, Boolean cars, Boolean motocycles, String startDest) {
		String queryPlus = " AND 1=2 ";
		boolean check = false;
		if(cars || motocycles) {
			queryPlus = " AND (";
			if(cars) {
				queryPlus += " v.type = 'CAR' ";
				check = true;
			}
			if(motocycles && !check) {
				queryPlus += " v.type = 'MOTOCYCLE' ";
				check = true;
			}else if(motocycles) {
				queryPlus += " OR v.type = 'MOTOCYCLE' ";
			}
			queryPlus += ")";
		}
		System.out.println(">>> " + queryPlus);
		Query query = entityManager.createQuery("SELECT v FROM Vehicle v WHERE v.rentACar.id = :rentId" + queryPlus);
		query.setParameter("rentId", rentID);
		List<Vehicle> result = query.getResultList();
		return result;
	}
}
