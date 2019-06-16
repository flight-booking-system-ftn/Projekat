package com.isamrs.tim14.dao;

import java.util.Collection;

import com.isamrs.tim14.model.Vehicle;
import com.isamrs.tim14.model.VehicleReservation;

public interface VehicleReservationDAO {
	public VehicleReservation save(VehicleReservation vehicleReservation);
	public Collection<VehicleReservation> getQuickVehicleReservations(String hotelID);
	public VehicleReservation saveQuickVehicleReservation(String reservationID);
	public Collection<Vehicle> getVehicleHistory();
	public VehicleReservation getOneQuickReservation(Integer id);
}
