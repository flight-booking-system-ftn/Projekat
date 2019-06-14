package com.isamrs.tim14.dao;

import java.util.List;
import java.util.Set;

import com.isamrs.tim14.model.BranchOffice;
import com.isamrs.tim14.model.Destination;

public interface BranchOfficeDAO {

	public BranchOffice save(Destination dest);
	public BranchOffice getOffice(int id);
	public Set<BranchOffice> getOffices();
	public List<BranchOffice> getBranchesByRent(int id);
}
