package com.isamrs.tim14.dao;

import java.util.HashSet;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.User;
import com.isamrs.tim14.model.Vehicle;
import com.isamrs.tim14.model.VehicleReservation;

@Repository
public class VehicleReservationDAOImpl implements VehicleReservationDAO {

	private EntityManager entityManager;

	@Autowired
	public VehicleReservationDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
	
	@Override
	@Transactional
	public VehicleReservation save(VehicleReservation vehicleReservation) {
		if(vehicleReservation.getRentACar().getReservations() == null) {
			vehicleReservation.getRentACar().setReservations(new HashSet<VehicleReservation>());
		}
		vehicleReservation.getRentACar().getReservations().add(vehicleReservation);
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if(user instanceof RegisteredUser) {
			RegisteredUser registered = (RegisteredUser) user;
			if(registered.getVehicleReservations() == null) {
				registered.setVehicleReservations(new HashSet<VehicleReservation>());
			}
			registered.getVehicleReservations().add(vehicleReservation);
			vehicleReservation.setRegisteredUser(registered);
		}else {
			vehicleReservation.setRegisteredUser(null);
		}
		
		entityManager.persist(vehicleReservation);
		
		for(Vehicle v : vehicleReservation.getVehicles()) {
			Vehicle managedvehicleEntity = entityManager.find(Vehicle.class, v.getId());
			if(managedvehicleEntity.getReservations() == null) {
				managedvehicleEntity.setReservations(new HashSet<VehicleReservation>());
			}
			managedvehicleEntity.getReservations().add(vehicleReservation);
		}
		
		return vehicleReservation;
	}

	
}
