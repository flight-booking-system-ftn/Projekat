package com.isamrs.tim14.dao;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.BranchOffice;
import com.isamrs.tim14.model.Grade;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.RentACar;
import com.isamrs.tim14.model.RentACarAdmin;
import com.isamrs.tim14.model.RentACarService;
import com.isamrs.tim14.model.Vehicle;
import com.isamrs.tim14.model.VehicleReservation;

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
			for(RentACarService rs : rent.getServices()) {
				rs.setRentACar(rent);
			}
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
	public List<RentACar> getRentSearch(String rentName, String rentDestination, Long checkIn, Long checkOut) {
		if(rentName.equals("NO_INPUT")) {
			rentName = "";
		}
		if(rentDestination.equals("NO_INPUT")) {
			rentDestination = "";
		}
		Query query = entityManager.createQuery("SELECT rent FROM RentACar rent WHERE rent.name LIKE :rentName");
		query.setParameter("rentName", "%" + rentName + "%");
		List<RentACar> result1 = query.getResultList();
		List<RentACar> result = new ArrayList<RentACar>();
		if(!rentDestination.equals("")) {
		for(RentACar r : result1) {
			for(BranchOffice b : r.getOffices()) {
				if(b.getDestination().getName().toLowerCase().contains(rentDestination.toLowerCase())) {
					result.add(r);
					break;
				}
			}
		}
		}
		else result= result1;
		List<RentACar> fullResult = new ArrayList<RentACar>();
		List<Vehicle> vehicles = new ArrayList<Vehicle>();
		boolean check = true;
		Date arrivalDate = new Date(checkIn);
		Date departureDate =  new Date(checkOut);
		
		for(RentACar rent : result) {
			vehicles.clear();
			for(Vehicle vehicle : rent.getVehicles()) {
				check = true;
				for(VehicleReservation reservation : vehicle.getReservations()) {
					if(!reservation.getEnd().before(arrivalDate) && !reservation.getStart().after(departureDate) && reservation.getRegisteredUser()!=null) {
						check = false;
					}
				}
				if(check) {
					vehicles.add(vehicle);
					break;
				}
			}
			if(!vehicles.isEmpty()) {
				fullResult.add(rent);
			}
		}
		
		return fullResult;
	}
	
	@Override
	public Set<BranchOffice> getRentOffices(int id) {
		Query query = entityManager.createQuery("SELECT rent FROM RentACar rent WHERE rent.id = :rentId");
		query.setParameter("rentId", id);
		List<RentACar> result = query.getResultList();

		if (result.size() == 0) {
			return null;
		}

		return result.get(0).getOffices();
	}
	
	@Override
	@Transactional
	public List<RentACar> getRentsFromReservations() {
		ArrayList<RentACar> allRents = new ArrayList<RentACar>();
		RegisteredUser u = ((RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
		for (VehicleReservation vr : u.getVehicleReservations()) {
				if (!(allRents.contains(vr.getRentACar())))
					allRents.add(vr.getRentACar());
				}
			//}
		return allRents;
	}
	
	@Override
	@Transactional
	public Integer getGrade(Integer id) {
		RentACar rent = entityManager.find(RentACar.class, id);
		RegisteredUser ru =(RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		for(Grade g : rent.getGrades()) {
			if(g.getUser().getEmail().equals(ru.getEmail())) {
				return g.getGrade();
			}
		}
		return 0;
	}

	@Override
	@Transactional
	public Integer getGradeRent() {
		RentACarAdmin admin =(RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		int sum = 0;
		int count = 0;
		for(Grade g : admin.getRentACar().getGrades()) {
			sum+=g.getGrade();
			count++;
		}
		if(count==0)
			return 0;
		else
			return sum/count;
	}
	
	@Override
	@Transactional
	public void setGrade(Integer id, Integer grade) {
		RentACar rent = entityManager.find(RentACar.class, id);
		RegisteredUser ru =(RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		for(Grade g : rent.getGrades()) {
			if(g.getUser().getEmail().equals(ru.getEmail())) {
				g.setGrade(grade);
				return;
				}
		}
		Grade g = new Grade();
		g.setGrade(grade);
		g.setUser(ru);
		entityManager.persist(g);	
		rent.getGrades().add(g);
	}
	
	@Override	
	@Transactional
	public RentACar changeRent(RentACar rent) {
		RentACar managedRent = entityManager.find(RentACar.class, rent.getId());
		RentACarAdmin r = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Query query = entityManager.createQuery("SELECT r FROM RentACar r WHERE r.name = :rentName");
		query.setParameter("rentName", rent.getName());
		List<Vehicle> resultQuery = query.getResultList();
		if(resultQuery.size()!=0 && !rent.getName().equals(r.getRentACar().getName())) {
			return null;
		}
		managedRent.setDescription(rent.getDescription());
		managedRent.getDestination().setAddress(rent.getDestination().getAddress());
		managedRent.setName(rent.getName());
		return managedRent;
		
	}

	@Override
	public double getIncome(Date start, Date end) {
		RentACarAdmin admin = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		int sum = 0;
		for(Vehicle v: admin.getRentACar().getVehicles()) {
			for(VehicleReservation vr: v.getReservations()) {
				if(vr.getStart().before(end) && vr.getStart().after(start)) {
					sum +=  vr.getPrice() - vr.getPrice()*vr.getDiscount()/100;
				}
			}
		}
		return sum;
	}
}
