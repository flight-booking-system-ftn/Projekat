package com.isamrs.tim14.dao;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
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
import com.isamrs.tim14.service.CustomUserDetailsService;

@Repository
public class RegisteredUserDAOImpl implements RegisteredUserDAO {
	
	private EntityManager entityManager;
	
	@Autowired
	private CustomUserDetailsService customService;
	
	@Autowired
	public RegisteredUserDAOImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	@Override
	@Transactional
	public ResponseEntity<List<RegisteredUser>> searchUsers(String input) {
		Query query = null;
		if(input.split(" ").length > 1) {
			String[] tokens = input.split(" ");
			
			query = entityManager.createQuery("SELECT u FROM User u WHERE u.firstName LIKE :first_name AND u.lastName LIKE :last_name");
			query.setParameter("first_name", tokens[0] + "%");
			query.setParameter("last_name", tokens[1] + "%");
		} else {
			query = entityManager.createQuery("SELECT u FROM User u WHERE u.firstName LIKE :input OR u.lastName LIKE :input");
			query.setParameter("input", input + "%");
		}
		
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
		
		for(RegisteredUser user : result)
			System.out.println("PRONADJENI KORISNIK: " + user.getFirstName() + " " + user.getLastName());
		
		return new ResponseEntity<List<RegisteredUser>>(result, HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<Set<RegisteredUser>> getFriendRequests() {
		RegisteredUser loggedIn = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		return new ResponseEntity(loggedIn.getFriendshipRequests(), HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<String> sendFriendshipRequest(Integer id) {
		RegisteredUser loggedIn = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		RegisteredUser managedUser = entityManager.find(RegisteredUser.class, id);
		
		managedUser.getFriendshipRequests().add(loggedIn);
		
		return new ResponseEntity<String>("Friendship request is sent.", HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<Set<RegisteredUser>> getFriendRequestsOfUser(Integer id) {
		RegisteredUser managedUser = entityManager.find(RegisteredUser.class, id);
				
		return new ResponseEntity<Set<RegisteredUser>>(managedUser.getFriendshipRequests(), HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<String> cancelFriendshipRequest(Integer id) {
		RegisteredUser loggedIn = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		RegisteredUser managedUser = entityManager.find(RegisteredUser.class, id);
		
		Iterator<RegisteredUser> iterator = managedUser.getFriendshipRequests().iterator();
		while(iterator.hasNext()) {
			RegisteredUser user = iterator.next();
			
			if(user.getId() == loggedIn.getId()) {
				iterator.remove();
				
				break;
			}
		}
		
		return new ResponseEntity<String>("Friendship request has been canceled.", HttpStatus.OK);
	}
	
	@Override
	@Transactional
	public ResponseEntity<String> acceptFriendshipRequest(Integer id) {
		RegisteredUser logged = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		RegisteredUser managedUser = entityManager.find(RegisteredUser.class, id);
		RegisteredUser loggedIn = entityManager.find(RegisteredUser.class, logged.getId());
		
		Iterator<RegisteredUser> iterator = loggedIn.getFriendshipRequests().iterator();
		while(iterator.hasNext()) {
			RegisteredUser user = iterator.next();
			
			if(user.getId() == managedUser.getId()) {
				iterator.remove();
				
				break;
			}
		}
		loggedIn.getFriends().add(managedUser);
		managedUser.getFriends().add(loggedIn);
		return new ResponseEntity<String>("Friendship request has been accepted.", HttpStatus.OK);
	}
	
	@Override
	@Transactional
	public ResponseEntity<String> deleteFriendshipRequest(Integer id) {
		RegisteredUser logged= (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		RegisteredUser managedUser = entityManager.find(RegisteredUser.class, id);
		RegisteredUser loggedIn = entityManager.find(RegisteredUser.class, logged.getId()); 
		Iterator<RegisteredUser> iterator = loggedIn.getFriendshipRequests().iterator();
		while(iterator.hasNext()) {
			RegisteredUser user = iterator.next();
			
			if(user.getId() == managedUser.getId()) {
				iterator.remove();
				
				break;
			}
		}
		
		return new ResponseEntity<String>("Friendship request has been deleted.", HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<String> updateProfile(RegisteredUser user) {
		RegisteredUser loggedIn = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		RegisteredUser managedLoggedIn = entityManager.find(RegisteredUser.class, loggedIn.getId());
		
		if(user.getPassword() != "") {
			managedLoggedIn.setPassword(customService.encodePassword(user.getPassword()));
		}
		
		managedLoggedIn.setFirstName(user.getFirstName());
		managedLoggedIn.setLastName(user.getLastName());
		managedLoggedIn.setEmail(user.getEmail());
		managedLoggedIn.setCity(user.getCity());
		managedLoggedIn.setPhoneNumber(user.getPhoneNumber());
		
		return new ResponseEntity("Profile informations successfully changed.", HttpStatus.OK);
	}

	@Override
	@Transactional
	public Collection<RegisteredUser> getUsersFriends() {
		RegisteredUser loggedIn = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Set<RegisteredUser> friends = loggedIn.getFriends();
		return friends;
	}

	@Override
	@Transactional
	public ResponseEntity<String> removeFriend(Integer id) {
		RegisteredUser loggedIn = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		RegisteredUser managedLoggedIn = entityManager.find(RegisteredUser.class, loggedIn.getId());
		RegisteredUser managedFriend = entityManager.find(RegisteredUser.class, id);
		
		Iterator<RegisteredUser> iterator = managedLoggedIn.getFriends().iterator();
		while(iterator.hasNext()) {
			RegisteredUser friend = iterator.next();
			
			if(friend.getId() == id) {
				iterator.remove();
				
				break;
			}
		}
		
		iterator = managedFriend.getFriends().iterator();
		while(iterator.hasNext()) {
			RegisteredUser friend = iterator.next();
			
			if(friend.getId() == managedLoggedIn.getId()) {
				iterator.remove();
				
				break;
			}
		}
		
		return null;
	}
	
	@Override
	@Transactional
	public ResponseEntity<Integer> getBonusPoints() {
		RegisteredUser loggedIn = (RegisteredUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		return new ResponseEntity<Integer>(loggedIn.getBonusPoints(), HttpStatus.OK);
	}

}
