package com.isamrs.tim14.dao;

import java.util.List;

import com.isamrs.tim14.model.Destination;

public interface DestinationDAO {
	
	public Destination save(Destination destination);
	public Destination getDestination(int id);
	public List<Destination> getDestinations();
	
}
