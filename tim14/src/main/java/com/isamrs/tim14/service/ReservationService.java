package com.isamrs.tim14.service;

import javax.persistence.OptimisticLockException;
import javax.persistence.PessimisticLockException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.dto.ReservationsDTO;
import com.isamrs.tim14.model.FlightReservation;
import com.isamrs.tim14.model.RoomReservation;
import com.isamrs.tim14.model.VehicleReservation;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class ReservationService {
	
	@Autowired
	private FlightReservationService flightReservationService;
	
	@Autowired
	private RoomReservationService roomReservationService;
	
	@Autowired
	private VehicleReservationService vehicleReservationService;
	
	@Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = false, rollbackFor = { PessimisticLockException.class, OptimisticLockException.class })
	public ReservationsDTO saveReservations(ReservationsDTO reservations) {
		VehicleReservation vReservation = null;
		RoomReservation rReservation = null;
		
		if(reservations.getVehicleReservation() != null) {
			if(reservations.getVehicleQuick().equals("quick")) {
				vReservation = vehicleReservationService.saveQuickVehicleReservation("" + reservations.getVehicleReservation().getId());
			}
			else {
				vReservation = vehicleReservationService.save(reservations.getVehicleReservation());
			}
		}
		if(reservations.getRoomReservation() != null) {
			if(reservations.getRoomQuick().equals("quick")) {
				rReservation = roomReservationService.saveQuick("" + reservations.getRoomReservation().getId());
			}
			else {
				rReservation = roomReservationService.save(reservations.getRoomReservation());
			}
		}
		if(reservations.getFlightReservation() != null) {
			for(FlightReservation fr : reservations.getFlightReservation()) {
				fr.setRoomReservation(rReservation);
				fr.setVehicleReservation(vReservation);
			}
			
			if(reservations.getFlightQuick().equals("quick")) {
				flightReservationService.buyQuickTicket(reservations.getFlightReservation().get(0));
			}
			else {
				flightReservationService.saveReservation(reservations.getFlightReservation());
			}
		}
		
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return reservations;
	}

}
