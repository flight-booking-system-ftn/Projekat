package com.isamrs.tim14.dao;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.RentACar;
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

	@Override
	@Transactional
	public Collection<VehicleReservation> getQuickVehicleReservations(String rentID) {
		RentACar rent = entityManager.find(RentACar.class, Integer.parseInt(rentID));
		Collection<VehicleReservation> result = new ArrayList<VehicleReservation>();
		for(VehicleReservation res : rent.getReservations()) {
			if(res.getRegisteredUser() == null) {
				result.add(res);
			}
		}
		return result;
	}

	@Override
	@Transactional
	public VehicleReservation saveQuickVehicleReservation(String reservationID) {
		VehicleReservation res = entityManager.find(VehicleReservation.class, Integer.parseInt(reservationID));
		RegisteredUser user = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		res.setRegisteredUser(user);
		return res;
	}
	
	@Override
	@Transactional
	public Collection<Vehicle> getVehicleHistory() {
		ArrayList<Vehicle> allVehicles = new ArrayList<Vehicle>();
		RegisteredUser u = ((RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
		for (VehicleReservation vr : u.getVehicleReservations()) {
			//if (vr.getEnd().after(new Date(System.currentTimeMillis()))) {
				for (Vehicle v : vr.getVehicles()) {
					if (!allVehicles.contains(v))
						allVehicles.add(v);
				}
			//}
		}
		return allVehicles;
	}
}
