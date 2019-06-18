package com.isamrs.tim14.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.isamrs.tim14.model.User;
import com.isamrs.tim14.repository.IUserRepository;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class UserService {
	
	
	@Autowired
	private IUserRepository userRepository;
	
	@Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

	public List<User> findAll() {
		return userRepository.findAll();
	}
	
	public User findByUsername(String username){
		User u = userRepository.findByUsername(username);
		return u;
	}
	
	public User findByEmail(String email){
		User u = userRepository.findByUsername(email);
		return u;
	}
	
	public User save(User user) {
        return userRepository.save(user);
	}

}
