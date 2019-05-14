package com.isamrs.tim14.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.isamrs.tim14.model.User;

public interface IUserRepository extends JpaRepository<User, Long> {
	List<User> findAll();
	User findByUsername(String username);
	User findByEmail(String email);
	User save(User user);
}
