package com.isamrs.tim14.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.isamrs.tim14.model.User;
import com.isamrs.tim14.repository.IUserRepository;

@Service
public class UserService {
	@Autowired
	private IUserRepository userRepository;

	public List<User> findAll() {
		return userRepository.findAll();
	}
}
