package com.isamrs.tim14.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.model.Grade;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.RentACarAdmin;
import com.isamrs.tim14.model.Vehicle;
import com.isamrs.tim14.model.VehicleReservation;
import com.isamrs.tim14.repository.IGradeRepository;
import com.isamrs.tim14.repository.IVehicleRepository;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class VehicleService {
	
	@Autowired
	private IVehicleRepository vehicleRepository;
	
	@Autowired
	private IGradeRepository gradeRepository;
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public Vehicle save(Vehicle vehicle) {
		RentACarAdmin admin = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		vehicle.setRentACar(admin.getRentACar());
		
		return vehicleRepository.save(vehicle);
	}
	
	public List<Vehicle> getVehiclesSearch(Integer rentID, Long start, Long end, Boolean cars, Boolean motocycles,
			String startDest) {
		String carType = (cars) ? "CAR" : "ship";
		String motoType = (motocycles) ? "MOTOCYCLE" : "truck";

		List<Vehicle> resultQuery = vehicleRepository.findVehiclesByTypes(rentID, carType, motoType);
		
		List<Vehicle> result = new ArrayList<Vehicle>();
		boolean check = true;
		Date arrivalDate = new Date(start);
		Date departureDate = new Date(end);
		boolean mycheck = false;

		if (startDest.equals("NO_INPUT")) {
			mycheck = true;
		}

		for (Vehicle selectedVehicle : resultQuery) {
			check = true;
			if (mycheck || selectedVehicle.getBranchOffice().getName().equalsIgnoreCase(startDest)) {
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

		return result;
	}
	
	public List<Vehicle> getUnreservedVehicles() {
		RentACarAdmin admin = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		List<Vehicle> unreservedVehicles = new ArrayList<Vehicle>();
		List<Vehicle> reservedVehicles = new ArrayList<Vehicle>();

		for (VehicleReservation res : admin.getRentACar().getReservations()) {
			if (res.getEnd().getTime() + 24 * 60 * 60 * 1000 > new Date().getTime()) {
				for (Vehicle vehicle : res.getVehicles()) {
					reservedVehicles.add(vehicle);
				}
			}
		}

		boolean check = true;
		for (Vehicle vehicle : admin.getRentACar().getVehicles()) {
			check = true;
			for (Vehicle resVehicle : reservedVehicles) {
				if (resVehicle.getId() == vehicle.getId()) {
					check = false;
					break;
				}
			}
			if (check) {
				unreservedVehicles.add(vehicle);
			}
		}
		
		return unreservedVehicles;
	}
	
	public void removeVehicle(Integer id) {
		vehicleRepository.deleteById(id);
	}
	
	public List<Vehicle> getAllVehiclesSearch(String rentName, String destination, Long start, Long end, String name, Boolean cars, Boolean motocycles, Double minPrice, Double maxPrice) {
		String carType = (cars) ? "CAR" : "ship";
		String motoType = (motocycles) ? "MOTOCYCLE" : "truck";

		List<Vehicle> resultQuery = vehicleRepository.findVehiclesByTypesAndPrice(carType, motoType, minPrice, maxPrice);
		List<Vehicle> result = new ArrayList<Vehicle>();

		if (name.equals("NO_INPUT")) {
			name = "";
		}
		
		boolean check = true;

		Date arrivalDate = new Date(start);
		Date departureDate = new Date(end);
		for (Vehicle selectedVehicle : resultQuery) {
			check = true;
			if (!selectedVehicle.getBranchOffice().getName().toLowerCase().contains(destination.toLowerCase())) {
				continue;
			}
			if (!selectedVehicle.getRentACar().getName().toLowerCase().contains(rentName.toLowerCase())) {
				continue;
			}
			for (VehicleReservation reservation : selectedVehicle.getReservations()) {
				if (!reservation.getEnd().before(arrivalDate) && !reservation.getStart().after(departureDate)) {
					check = false;
				}
			}
			if (check) {
				if (selectedVehicle.getBrand().toLowerCase().contains(name.toLowerCase())
						|| selectedVehicle.getModel().toLowerCase().contains(name.toLowerCase())) {
					if (selectedVehicle.getPrice() >= minPrice && selectedVehicle.getPrice() <= maxPrice) {
						result.add(selectedVehicle);
					}
				}
			}

		}

		return result;
	}
	
	public Integer getGrade(Integer id) {
		RegisteredUser ru = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Vehicle vehicle = vehicleRepository.getOne(id);

		for (Grade g : vehicle.getGrades())
			if (g.getUser().getEmail().equals(ru.getEmail()))
				return g.getGrade();

		return 0;
	}
	
	public Integer getIntermediateGrade(Integer id) {
		Vehicle vehicle = vehicleRepository.getOne(id);
		int sum = 0;
		int count = 0;

		for (Grade g : vehicle.getGrades()) {
			sum += g.getGrade();
			count++;
		}
		if (count == 0)
			return 0;
		else
			return sum / count;
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public void setGrade(Integer id, Integer grade) {
		RegisteredUser ru = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Vehicle vehicle = vehicleRepository.getOne(id);

		for (Grade g : vehicle.getGrades())
			if (g.getUser().getEmail().equals(ru.getEmail())) {
				g.setGrade(grade);
				return;
			}

		Grade g = new Grade();
		g.setGrade(grade);
		g.setUser(ru);

		gradeRepository.save(g);
		vehicle.getGrades().add(g);
	}
	
	public Vehicle findById(Integer id) {
		return vehicleRepository.getOne(id);
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public Vehicle changeVehicle(Vehicle vehicle) {
		Vehicle managedVehicle = vehicleRepository.getOne(vehicle.getId());

		managedVehicle.setBranchOffice(vehicle.getBranchOffice());
		managedVehicle.setPrice(vehicle.getPrice());
		return managedVehicle;
	}
	
	public Collection<Vehicle> getAllRentsVehicles() {
		RentACarAdmin admin = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		return admin.getRentACar().getVehicles();
	}

}
