package com.isamrs.tim14.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.isamrs.tim14.model.Authority;
import com.isamrs.tim14.model.RegisteredUser;

@Repository
public class RegisteredUserDAOImpl implements RegisteredUserDAO {
	
	private EntityManager entityManager;
	
	@Autowired
	public RegisteredUserDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	@Override
	@Transactional
	public ResponseEntity<List<RegisteredUser>> searchUsers(String input) {
		Query query = entityManager.createQuery("SELECT u FROM User u WHERE u.username LIKE :username OR u.firstName LIKE :username OR u.lastName LIKE :username");
		query.setParameter("username", input + "%");
		
		List<RegisteredUser> users = query.getResultList();
		
		List<RegisteredUser> result = new ArrayList<RegisteredUser>();
		
		for(RegisteredUser u : users) {
			if(u.getUsername().equals(((RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername()))
				continue;
			
			for(Object o : u.getAuthorities()) {
				Authority a = (Authority)o;
				
				if(a.getUserType().equals("ROLE_REGISTEREDUSER")) {
					result.add(u);
					break;
				}
			}
		}
		
		return new ResponseEntity<List<RegisteredUser>>(result, HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<Set<RegisteredUser>> getFriendRequests() {
		RegisteredUser loggedIn = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		return new ResponseEntity(loggedIn.getFriendshipRequests(), HttpStatus.OK);
	}

}
