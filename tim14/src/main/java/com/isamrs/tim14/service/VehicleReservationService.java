package com.isamrs.tim14.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.OptimisticLockException;
import javax.persistence.PessimisticLockException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.dto.GraphsDTO;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.RentACar;
import com.isamrs.tim14.model.RentACarAdmin;
import com.isamrs.tim14.model.User;
import com.isamrs.tim14.model.Vehicle;
import com.isamrs.tim14.model.VehicleReservation;
import com.isamrs.tim14.repository.IRentACarRepository;
import com.isamrs.tim14.repository.IVehicleRepository;
import com.isamrs.tim14.repository.IVehicleReservationRepository;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class VehicleReservationService {
	
	@Autowired
	private IVehicleReservationRepository vehicleReservationRepository;
	
	@Autowired
	private IVehicleRepository vehicleRepository;
	
	@Autowired
	private IRentACarRepository rentACarRepository;
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false, rollbackFor = PessimisticLockException.class)
	public VehicleReservation save(VehicleReservation vehicleReservation) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		List<Vehicle> vehicles = new ArrayList<Vehicle>();
		for (Vehicle v : vehicleReservation.getVehicles()) {
			vehicles.add(vehicleRepository.findOneById(v.getId()));
		}

		if (vehicleReservation.getRentACar().getReservations() == null) {
			vehicleReservation.getRentACar().setReservations(new HashSet<VehicleReservation>());
		}

		vehicleReservation.getRentACar().getReservations().add(vehicleReservation);
		if (user instanceof RegisteredUser) {
			RegisteredUser registered = (RegisteredUser) user;

			if (registered.getVehicleReservations() == null)
				registered.setVehicleReservations(new HashSet<VehicleReservation>());

			registered.getVehicleReservations().add(vehicleReservation);
			vehicleReservation.setRegisteredUser(registered);
		} else
			vehicleReservation.setRegisteredUser(null);

		vehicleReservationRepository.save(vehicleReservation);

		for (Vehicle v : vehicles) {
			if (v.getReservations() == null)
				v.setReservations(new HashSet<VehicleReservation>());

			v.getReservations().add(vehicleReservation);
		}

		return vehicleReservation;
	}
	
	public Collection<VehicleReservation> getQuickVehicleReservations(String rentID) {
		RentACar rent = rentACarRepository.getOne(Integer.parseInt(rentID));
		Collection<VehicleReservation> result = new ArrayList<VehicleReservation>();

		for (VehicleReservation res : rent.getReservations()) {
			if (res.getRegisteredUser() == null) {
				result.add(res);
			}
		}

		return result;
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false, rollbackFor = OptimisticLockException.class)
	public VehicleReservation saveQuickVehicleReservation(String reservationID) {
		RegisteredUser user = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		VehicleReservation res = vehicleReservationRepository.findOneById(Integer.parseInt(reservationID));

		res.setRegisteredUser(user);

		return res;
	}
	
	public Collection<Vehicle> getVehicleHistory() {
		RegisteredUser u = ((RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
		ArrayList<Vehicle> allVehicles = new ArrayList<Vehicle>();
		
		for (VehicleReservation vr : u.getVehicleReservations())
			for (Vehicle v : vr.getVehicles())
				if (!allVehicles.contains(v))
					allVehicles.add(v);
		
		return allVehicles;
	}
	
	public VehicleReservation findById(Integer id) {
		return vehicleReservationRepository.getOne(id);
	}
	
	public GraphsDTO getVehiclesDaily() throws ParseException {
		RentACarAdmin admin = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		GraphsDTO graph = new GraphsDTO();
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		Date start = null;

		Calendar c = Calendar.getInstance();
		c.setTime(new Date()); // Now use today date.
		c.add(Calendar.DATE, -13);
		start = sdf.parse(sdf.format(c.getTime()));

		Set<Vehicle> vehicles = admin.getRentACar().getVehicles();
		for (int i = 0; i < 14; i++) {
			start = sdf.parse(sdf.format(c.getTime()));
			String dateX = sdf.format(start);
			graph.getX().add(dateX);
			int sum = 0;
			for (Vehicle v : vehicles)
				for (VehicleReservation vr : v.getReservations())
					if (sdf.parse(sdf.format(vr.getStart())).equals(start))
						sum++;

			graph.getY().add(sum);
			c.add(Calendar.DATE, 1);
		}

		return graph;
	}
	
	public GraphsDTO getVehiclesWeekly() throws ParseException {
		RentACarAdmin admin = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
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
		Set<Vehicle> vehicles = admin.getRentACar().getVehicles();

		for (int i = 0; i < 12; i++) {
			start = end;
			c.add(Calendar.DATE, 7);
			end = sdf.parse(sdf.format(c.getTime()));
			int sum = 0;
			for (Vehicle v : vehicles)
				for (VehicleReservation vr : v.getReservations())
					if (sdf.parse(sdf.format(vr.getStart())).before(end)
							&& sdf.parse(sdf.format(vr.getStart())).after(start)
							|| sdf.parse(sdf.format(vr.getStart())).equals(end))
						sum++;

			c2.setTime(start);
			c2.add(Calendar.DATE, 1);
			start = sdf.parse(sdf.format(c2.getTime()));
			String dateX = sdf2.format(start) + "-" + sdf2.format(end);
			graph.getX().add(dateX);
			graph.getY().add(sum);
		}

		return graph;
	}
	
	public GraphsDTO getVehiclesMonthly() throws ParseException {
		RentACarAdmin admin = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		GraphsDTO graph = new GraphsDTO();
		SimpleDateFormat sdf = new SimpleDateFormat("MM/yy");
		Date date = null;

		Calendar c = Calendar.getInstance();
		c.add(Calendar.MONTH, -11);
		date = sdf.parse(sdf.format(c.getTime()));
		Set<Vehicle> vehicles = admin.getRentACar().getVehicles();

		for (int i = 0; i < 12; i++) {
			String dateX = sdf.format(c.getTime());
			date = sdf.parse(sdf.format(c.getTime()));
			int sum = 0;
			for (Vehicle v : vehicles)
				for (VehicleReservation vr : v.getReservations())
					if (sdf.parse(sdf.format(vr.getStart())).equals(date))
						sum++;

			graph.getX().add(dateX);
			graph.getY().add(sum);
			c.add(Calendar.MONTH, 1);
		}

		return graph;
	}
	
}
