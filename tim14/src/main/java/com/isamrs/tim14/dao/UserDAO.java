package com.isamrs.tim14.dao;

import com.isamrs.tim14.dto.InitChangePassword;
import com.isamrs.tim14.model.Sales;

public interface UserDAO {

	public boolean initChangePassword(InitChangePassword pass);
	public Sales getDiscount();
	public Sales changeDiscount(Sales sale);
}
