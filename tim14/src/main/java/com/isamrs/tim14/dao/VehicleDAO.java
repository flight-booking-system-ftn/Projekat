package com.isamrs.tim14.dao;

import java.util.List;

import com.isamrs.tim14.model.Vehicle;

public interface VehicleDAO {
	public Vehicle save(Vehicle vehcle);
	public List<Vehicle> getVehiclesSearch(Integer rentID, Long arriveDate, Long dayNum, Boolean cars, Boolean motocycles,  String startDest);
	public List<Vehicle> getUnreservedVehicles();
	public void removeVehicle(Integer id);
}
