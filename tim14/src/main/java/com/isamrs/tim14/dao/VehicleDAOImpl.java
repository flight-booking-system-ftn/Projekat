package com.isamrs.tim14.dao;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.RentACarAdmin;
import com.isamrs.tim14.model.Vehicle;
import com.isamrs.tim14.model.VehicleReservation;

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
	public List<Vehicle> getVehiclesSearch(Integer rentID, Long start, Long end, Boolean cars, Boolean motocycles,
			String startDest) {
		String queryPlus = " AND 1=2 ";
		boolean check = false;
		if (cars || motocycles) {
			queryPlus = " AND (";
			if (cars) {
				queryPlus += " v.type = 'CAR' ";
				check = true;
			}
			if (motocycles && !check) {
				queryPlus += " v.type = 'MOTOCYCLE' ";
				check = true;
			} else if (motocycles) {
				queryPlus += " OR v.type = 'MOTOCYCLE' ";
			}
			queryPlus += ")";
		}
		System.out.println(">>> " + queryPlus);
		Query query = entityManager.createQuery("SELECT v FROM Vehicle v WHERE v.rentACar.id = :rentId" + queryPlus);
		query.setParameter("rentId", rentID);
		List<Vehicle> resultQuery = query.getResultList();
		List<Vehicle> result = new ArrayList<Vehicle>();
		check = true;
		Date arrivalDate = new Date(start);
		Date departureDate = new Date(start);
		boolean mycheck = false;
		if(startDest.equals("NO_INPUT")) {
			mycheck = true;
		}
		for (Vehicle selectedVehicle : resultQuery) {
			check = true;
			System.out.println(selectedVehicle.getBranchOffice().getDestination().getName() + startDest);
			if (mycheck || selectedVehicle.getBranchOffice().getDestination().getName().equalsIgnoreCase(startDest)) {
				for (VehicleReservation reservation : selectedVehicle.getReservations()) {
					if (!reservation.getEnd().before(arrivalDate) && !reservation.getStart().after(departureDate)) {
						check = false;
					}
				}
				if (check) {
					result.add(selectedVehicle);
				}
			}
		}
		System.out.println(result.size());
		return result;
	}
	
	@Override
	@Transactional
	public List<Vehicle> getUnreservedVehicles() {
		RentACarAdmin admin = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		List<Vehicle> unreservedVehicles = new ArrayList<Vehicle>();
		List<Vehicle> reservedVehicles = new ArrayList<Vehicle>();
		for(VehicleReservation res : admin.getRentACar().getReservations()) {
			if(res.getEnd().getTime() + 24*60*60*1000 > new Date().getTime()) {
				for(Vehicle vehicle : res.getVehicles()) {
					reservedVehicles.add(vehicle);
				}
			}
		}
		boolean check = true;
		for(Vehicle vehicle : admin.getRentACar().getVehicles()) {
			check = true;
			for(Vehicle resVehicle : reservedVehicles) {
				if(resVehicle.getId() == vehicle.getId()) {
					check = false;
					break;
				}
			}
			if(check) {
				unreservedVehicles.add(vehicle);
			}
		}
		return unreservedVehicles;
	}

	@Override
	@Transactional
	public void removeVehicle(Integer id) {
		Vehicle managedVehicle = entityManager.find(Vehicle.class, id);
		entityManager.remove(managedVehicle);
	}

	@Override
	@Transactional
	public List<Vehicle> getAllVehiclesSearch(String name, Boolean cars, Boolean motocycles, Double minPrice, Double maxPrice) {
		String queryPlus = " 1=2 ";
		boolean check = false;
		if (cars || motocycles) {
			queryPlus = " (";
			if (cars) {
				queryPlus += " v.type = 'CAR' ";
				check = true;
			}
			if (motocycles && !check) {
				queryPlus += " v.type = 'MOTOCYCLE' ";
				check = true;
			} else if (motocycles) {
				queryPlus += " OR v.type = 'MOTOCYCLE' ";
			}
			queryPlus += ")";
		}
		
		Query query = entityManager.createQuery("SELECT v FROM Vehicle v WHERE " + queryPlus);
		List<Vehicle> resultQuery = query.getResultList();
		System.out.println("SIZE" + resultQuery.size() + " ... " + queryPlus);
		List<Vehicle> result = new ArrayList<Vehicle>();
		
		if(name.equals("NO_INPUT")) {
			name = "";
		}
		
		for (Vehicle selectedVehicle : resultQuery) {
			if(selectedVehicle.getBrand().toLowerCase().contains(name.toLowerCase()) || selectedVehicle.getModel().toLowerCase().contains(name.toLowerCase())) {
				if(selectedVehicle.getPrice() >= minPrice && selectedVehicle.getPrice() <= maxPrice) {
					result.add(selectedVehicle);
				}
			}
		}
		System.out.println(result.size());
		return result;
	}

}
