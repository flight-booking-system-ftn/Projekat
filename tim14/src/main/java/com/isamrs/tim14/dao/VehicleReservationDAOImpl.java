package com.isamrs.tim14.dao;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.dto.GraphsDTO;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.RentACar;
import com.isamrs.tim14.model.RentACarAdmin;
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
	
	@Override
	@Transactional
	public VehicleReservation getOneQuickReservation(Integer id) {
		VehicleReservation reservation = entityManager.find(VehicleReservation.class, id);
		return reservation;
	}

	@Override
	@Transactional
	public GraphsDTO getVehiclesDaily() throws ParseException {
		GraphsDTO graph = new GraphsDTO();
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		Date start = null;
		Calendar c = Calendar.getInstance();
		c.setTime(new Date()); // Now use today date.
		c.add(Calendar.DATE, -13);
		start = sdf.parse(sdf.format(c.getTime()));
		RentACarAdmin admin = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Set<Vehicle> vehicles = admin.getRentACar().getVehicles();
		for(int i = 0; i<14; i++) {
			start = sdf.parse(sdf.format(c.getTime()));
			String dateX = sdf.format(start);
			graph.getX().add(dateX);
			int sum = 0;
			for(Vehicle v: vehicles) {
				for(VehicleReservation vr : v.getReservations()) {
					if(sdf.parse(sdf.format(vr.getStart())).equals(start)) {
						sum++;
					}
				}
			}
			graph.getY().add(sum);
			c.add(Calendar.DATE, 1);
		}	
		return graph;
	}

	@Override
	@Transactional
	public GraphsDTO getVehiclesWeekly() throws ParseException {
		GraphsDTO graph = new GraphsDTO();
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		SimpleDateFormat sdf2 = new SimpleDateFormat("dd/MM");
		Date end = null;
		Date start = null;
		Calendar c = Calendar.getInstance();
		Calendar c2 = Calendar.getInstance();
		c.setTime(new Date()); // Now use today date.
		c.add(Calendar.WEEK_OF_YEAR, -13);
		start = sdf.parse(sdf.format(c.getTime()));
		c.add(Calendar.WEEK_OF_YEAR, 1);
		end = sdf.parse(sdf.format(c.getTime()));
		RentACarAdmin admin = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Set<Vehicle> vehicles = admin.getRentACar().getVehicles();
		for(int i = 0; i<12; i++) {
			start = end;
			c.add(Calendar.DATE, 7);
			end = sdf.parse(sdf.format(c.getTime()));
			int sum = 0;
			for(Vehicle v: vehicles) {
				for(VehicleReservation vr : v.getReservations()) {
					if(sdf.parse(sdf.format(vr.getStart())).before(end) && sdf.parse(sdf.format(vr.getStart())).after(start) || sdf.parse(sdf.format(vr.getStart())).equals(end)) {
						sum++;
					}
				}
			}
			c2.setTime(start);
			c2.add(Calendar.DATE, 1);
			start = sdf.parse(sdf.format(c2.getTime()));
			String dateX = sdf2.format(start)+"-"+sdf2.format(end);
			graph.getX().add(dateX);
			graph.getY().add(sum);
		}
		return graph;
	}

	@Override
	@Transactional
	public GraphsDTO getVehiclesMonthly() throws ParseException {
		GraphsDTO graph = new GraphsDTO();
		SimpleDateFormat sdf = new SimpleDateFormat("MM/yy");
		Date date = null;
		Calendar c = Calendar.getInstance();
		c.add(Calendar.MONTH, -11);
		date = sdf.parse(sdf.format(c.getTime()));
		RentACarAdmin admin = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Set<Vehicle> vehicles = admin.getRentACar().getVehicles();
		for(int i = 0; i<12; i++) {
			String dateX = sdf.format(c.getTime());
			date = sdf.parse(sdf.format(c.getTime()));
			int sum = 0;
			for(Vehicle v: vehicles) {
				for(VehicleReservation vr : v.getReservations()) {
					if(sdf.parse(sdf.format(vr.getStart())).equals(date)) {
						sum++;}
					}
			}
			graph.getX().add(dateX);
			graph.getY().add(sum);
			c.add(Calendar.MONTH, 1);
		}
		return graph;
	}
	
	
}
