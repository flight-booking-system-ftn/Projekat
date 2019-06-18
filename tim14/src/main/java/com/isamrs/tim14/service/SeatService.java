package com.isamrs.tim14.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.model.Seat;
import com.isamrs.tim14.repository.ISeatRepository;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class SeatService {
	
	@Autowired
	private ISeatRepository seatRepository;
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public void toggle(Integer id) {
		Seat seat = seatRepository.getOne(id);
		
		if(!seat.getBusy())
			seat.setEnabled(!seat.getEnabled());
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public void delete(Integer id) {
		Seat seat = seatRepository.getOne(id);
		
		if(!seat.getBusy())
			seatRepository.delete(seat);
	}
	
	public List<Seat> getSeats(List<Integer> seats) {
		List<Seat> result = new ArrayList<Seat>();
		
		for(Integer seatID : seats)
			result.add(seatRepository.getOne(seatID));
		
		return result;
	}
	
	public Seat getSeat(Integer id) {
		return seatRepository.getOne(id);
	}

}
