package com.isamrs.tim14.service;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.model.BranchOffice;
import com.isamrs.tim14.model.RentACar;
import com.isamrs.tim14.model.RentACarAdmin;
import com.isamrs.tim14.repository.IBranchOfficeRepository;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class BranchOfficeService {
	
	@Autowired
	private IBranchOfficeRepository branchOfficeRepository;
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public BranchOffice save(BranchOffice bo) {
		RentACar rent = ((RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getRentACar();
		
		BranchOffice branch = new BranchOffice();
		branch.setDestination(bo.getDestination());
		branch.setName(bo.getName());
		branch.setRentACar(rent);
		rent.getOffices().add(branch);

		List<BranchOffice> result = branchOfficeRepository.findByName(rent.getName());
		if (result.size() > 0)
			for (BranchOffice b : result)
				if (b.getDestination().getLatitude().equals(bo.getDestination().getLatitude())
						&& b.getDestination().getLongitude().equals(bo.getDestination().getLongitude()))
					return null;

		return branchOfficeRepository.save(branch);
	}
	
	public BranchOffice getOffice(int id) {
		return branchOfficeRepository.getOne(id);
	}
	
	public Set<BranchOffice> getOffices() {
		RentACarAdmin rent = (RentACarAdmin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return rent.getRentACar().getOffices();
	}
	
	public List<BranchOffice> getBranchesByRent(int id) {
		return branchOfficeRepository.findByRent(id);
	}

}
