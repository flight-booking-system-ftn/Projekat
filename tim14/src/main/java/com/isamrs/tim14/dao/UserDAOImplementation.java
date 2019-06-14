package com.isamrs.tim14.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.dto.InitChangePassword;
import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.Room;
import com.isamrs.tim14.model.Sales;
import com.isamrs.tim14.model.User;
import com.isamrs.tim14.service.CustomUserDetailsService;

@Repository
public class UserDAOImplementation implements UserDAO{

	private EntityManager entityManager;

	@Autowired
	public UserDAOImplementation(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
	
	@Autowired
	private CustomUserDetailsService userDetailsService;
	
	@Override
	@Transactional
	public boolean initChangePassword(InitChangePassword pass) {
		User ru =(User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		boolean check = false;
		User managedUser = entityManager.find(User.class, ru.getId());
		System.out.println(ru.getPassword());
		System.out.println(this.userDetailsService.encodePassword(pass.getCurrentPassword()));
		//if(ru.getPassword().equals(this.userDetailsService.encodePassword(pass.getCurrentPassword()))) {
		managedUser.setPassword(this.userDetailsService.encodePassword(pass.getNewPassword()));
		managedUser.setPasswordChanged(true);
		check = true;
		//}
		return check;
	}

	@Override
	@Transactional
	public Sales getDiscount() {
		Sales sale = entityManager.find(Sales.class, 1);
		return sale;
	}

	@Override
	@Transactional
	public Sales changeDiscount(Sales sale) {
		Sales modifiedSale = entityManager.find(Sales.class, 1);
		modifiedSale.setDiscountPercentage(sale.getDiscountPercentage());
		return modifiedSale;
	}

}
