package com.isamrs.tim14.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.model.Hotel;
import com.isamrs.tim14.model.HotelAdmin;
import com.isamrs.tim14.model.HotelService;
import com.isamrs.tim14.repository.IHotelRepository;
import com.isamrs.tim14.repository.IHotelServiceRepository;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class HotelServiceService {

	@Autowired
	private IHotelServiceRepository hotelServiceRepository;
	
	@Autowired
	private IHotelRepository hotelRepository;
	
	public List<HotelService> getHotelServicesSearch(Integer hotelID) {
		return hotelServiceRepository.findServicesByHotelID(hotelID);
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public HotelService save(HotelService service) {
		HotelAdmin admin = (HotelAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		boolean check = true;
		
		for(HotelService hs : admin.getHotel().getServices()) {
			if(hs.getName().equals(service.getName())) {
				check = false;
				break;
			}
		}
		
		if(!check) {
			return null;
		}
		
		Hotel managedHotel = hotelRepository.getHotelById(admin.getHotel().getId());
		service.setHotel(managedHotel);
		service.setId(null);
		hotelServiceRepository.save(service);
		managedHotel.getServices().add(service);
		
		return service;
	}
	
	public HotelService getHotelServiceByID(int id) {
		return hotelServiceRepository.findOneById(id);
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public HotelService changeService(HotelService service) {
		HotelService managedHotelService = hotelServiceRepository.findOneById(service.getId());
		managedHotelService.setPrice(service.getPrice());
		return managedHotelService;
	}
	
	
	
	
	
}
