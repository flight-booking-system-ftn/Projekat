package com.isamrs.tim14.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.persistence.OptimisticLockException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.model.BranchOffice;
import com.isamrs.tim14.model.Destination;
import com.isamrs.tim14.model.Grade;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.RentACar;
import com.isamrs.tim14.model.RentACarAdmin;
import com.isamrs.tim14.model.RentACarService;
import com.isamrs.tim14.model.Vehicle;
import com.isamrs.tim14.model.VehicleReservation;
import com.isamrs.tim14.repository.IDestinationRepository;
import com.isamrs.tim14.repository.IGradeRepository;
import com.isamrs.tim14.repository.IRentACarRepository;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class RentService {
	
	@Autowired
	private IRentACarRepository rentACarRepository;
	
	@Autowired
	private IGradeRepository gradeRepository;
	
	@Autowired
	private IDestinationRepository destinationRepository;
	
	public List<RentACar> findAll() {
		return rentACarRepository.findAll();
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public RentACar save(RentACar rent) {
		RentACar result = rentACarRepository.findOneByName(rent.getName());
		
		if (result == null) {
			for(RentACarService rs : rent.getServices())
				rs.setRentACar(rent);
			
			return rentACarRepository.save(rent);
		} else
			return null;
	}
	
	public RentACar findById(int id) {
		return rentACarRepository.getOne(id);
	}
	
	public List<RentACar> getRentSearch(String rentName, String rentDestination, long checkIn, long checkOut) {
		if(rentName.equals("NO_INPUT")) {
			rentName = "";
		}
		if(rentDestination.equals("NO_INPUT")) {
			rentDestination = "";
		}
		
		List<RentACar> result1 = rentACarRepository.findRentByNameContain(rentName);
		System.out.println(result1.size());
		List<RentACar> result = new ArrayList<RentACar>();
		if (!rentDestination.equals("")) {
			for (RentACar r : result1) {
				for (BranchOffice b : r.getOffices()) {
					if (b.getDestination().getName().toLowerCase().contains(rentDestination.toLowerCase())) {
						result.add(r);
						break;
					}
				}
			}
		} else
			result = result1;
		
		List<RentACar> fullResult = new ArrayList<RentACar>();
		List<Vehicle> vehicles = new ArrayList<Vehicle>();
		boolean check = true;
		Date arrivalDate = new Date(checkIn);
		Date departureDate = new Date(checkOut);
		System.out.println(" ---> " + result.size());
		for (RentACar rent : result) {
			vehicles.clear();
			for (Vehicle vehicle : rent.getVehicles()) {
				check = true;
				for (VehicleReservation reservation : vehicle.getReservations()) {
					if (!reservation.getEnd().before(arrivalDate) && !reservation.getStart().after(departureDate)) {
						if(reservation.getRegisteredUser() != null) {
							check = false;
						}
					}
				}
				if (check) {
					vehicles.add(vehicle);
					break;
				}
			}
			if (!vehicles.isEmpty()) {
				fullResult.add(rent);
			}
		}
		System.out.println(">>>>    " + fullResult.size());
		return fullResult;
	}
	
	public Set<BranchOffice> getRentOffices(int id) {
		return rentACarRepository.findByRent(id);
	}
	
	public List<RentACar> getRentsFromReservations() {
		RegisteredUser u = ((RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
		ArrayList<RentACar> allRents = new ArrayList<RentACar>();

		for (VehicleReservation vr : u.getVehicleReservations())
			if (!(allRents.contains(vr.getRentACar())))
				allRents.add(vr.getRentACar());

		return allRents;
	}
	
	public Integer getGrade(Integer id) {
		RegisteredUser ru = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		RentACar rent = rentACarRepository.getOne(id);

		for (Grade g : rent.getGrades())
			if (g.getUser().getEmail().equals(ru.getEmail()))
				return g.getGrade();

		return 0;
	}
	
	public Integer getGradeRent() {
		RentACarAdmin admin = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		int sum = 0;
		int count = 0;

		for (Grade g : admin.getRentACar().getGrades()) {
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
		RentACar rent = rentACarRepository.getOne(id);

		for (Grade g : rent.getGrades())
			if (g.getUser().getEmail().equals(ru.getEmail())) {
				g.setGrade(grade);
				return;
			}

		Grade g = new Grade();
		g.setGrade(grade);
		g.setUser(ru);

		gradeRepository.save(g);
		rent.getGrades().add(g);
	}
	
	@Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = false, rollbackFor = OptimisticLockException.class)
	public RentACar changeRent(RentACar rent) {
		RentACarAdmin r = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		RentACar managedRent = rentACarRepository.findOneById(rent.getId());

		RentACar result = rentACarRepository.findOneByName(rent.getName());
		if (result != null && !rent.getName().equals(r.getRentACar().getName())) {
			try {
				Thread.sleep(2000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			return null;
		}
			

		managedRent.setDescription(rent.getDescription());
		Destination managedDestination = destinationRepository.findOneById(rent.getDestination().getId());
		managedDestination.setAddress(rent.getDestination().getAddress());
		managedRent.setName(rent.getName());

		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		return managedRent;
	}
	
	public double getIncome(Date start, Date end) {
		RentACarAdmin admin = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		int sum = 0;

		for (Vehicle v : admin.getRentACar().getVehicles())
			for (VehicleReservation vr : v.getReservations())
				if (vr.getStart().before(end) && vr.getStart().after(start))
					sum += vr.getPrice() - vr.getPrice() * vr.getDiscount() / 100;

		return sum;
	}

}
