package com.isamrs.tim14.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.model.AirlineAdmin;
import com.isamrs.tim14.model.Luggage;
import com.isamrs.tim14.repository.ILuggageRepository;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class LuggageService {
	
	@Autowired
	private ILuggageRepository luggageRepository;
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public ResponseEntity<String> add(Luggage luggage) {
		AirlineAdmin user = (AirlineAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		for(Luggage l : user.getAirline().getLuggagePricelist()) {
			if(l.getDimensions().equals(luggage.getDimensions()) && l.getWeight() == luggage.getWeight()) {
				return new ResponseEntity<String>("Item with same values already exists.", HttpStatus.NOT_ACCEPTABLE);
			}
		}
		
		luggage.setAirline(user.getAirline());
		
		luggageRepository.save(luggage);
		
		return new ResponseEntity<String>("Item successfully added.", HttpStatus.CREATED);
	}
	
	public Luggage getLuggage(Integer id) {
		return luggageRepository.getOne(id);
	}

}
