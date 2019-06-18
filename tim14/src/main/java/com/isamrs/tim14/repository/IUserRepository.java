package com.isamrs.tim14.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.isamrs.tim14.model.User;

public interface IUserRepository extends JpaRepository<User, Long> {
	List<User> findAll();
	User findByUsername(String username);
	User findOneByUsername(String username);
	User findByEmail(String email);
	User save(User user);
	
	@Query(value = "select * from users u where u.id =(select t.user from verification_tokens t where t.token = ?1)", nativeQuery = true)
	User findByToken(String token);
	
	@Query(value = "select * from users u where u.username = %?1% or u.email = %?2%", nativeQuery = true)
	List<User> findOneByUsernameOrEmail(String username, String email);
}
