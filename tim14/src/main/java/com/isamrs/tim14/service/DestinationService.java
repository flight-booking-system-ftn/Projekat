package com.isamrs.tim14.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.model.Destination;
import com.isamrs.tim14.repository.IDestinationRepository;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class DestinationService {
	
	@Autowired
	private IDestinationRepository destinationRepository;

	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public Destination save(Destination destination) {
		destination.setId(null);
		destinationRepository.save(destination);
		return destination;
	}
	
	public Destination getDestination(int id) {
		return destinationRepository.findOneById(id);
	}
	
	public List<Destination> getDestinations(){
		return destinationRepository.findAll();
	}
	
	
}
