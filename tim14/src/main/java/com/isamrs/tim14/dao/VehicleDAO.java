package com.isamrs.tim14.dao;

import java.util.List;

import com.isamrs.tim14.model.Vehicle;

public interface VehicleDAO {
	public Vehicle save(Vehicle vehcle);
	public List<Vehicle> getVehiclesSearch(Integer vehicleID, String arriveDate, Integer dayNum, Boolean cars, Boolean motocycles);

}
