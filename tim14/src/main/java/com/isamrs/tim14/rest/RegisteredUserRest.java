package com.isamrs.tim14.rest;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dao.RegisteredUserDAO;
import com.isamrs.tim14.model.RegisteredUser;

@RestController
@RequestMapping("/api")
public class RegisteredUserRest {
	
	private RegisteredUserDAO registeredUserDAO;
	
	@Autowired
	public RegisteredUserRest(RegisteredUserDAO registeredUserDAO) {
		this.registeredUserDAO = registeredUserDAO;
	}

	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@GetMapping("/registeredUser/search/{input}")
	public ResponseEntity<List<RegisteredUser>> searchUsers(@PathVariable String input) {
		return registeredUserDAO.searchUsers(input);
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@GetMapping("/registeredUser/getFriendRequests")
	public ResponseEntity<Set<RegisteredUser>> getFriendRequests() {
		return registeredUserDAO.getFriendRequests();
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@PostMapping("/registeredUser/sendFriendshipRequest/{id}")
	public ResponseEntity<String> sendFriendshipRequest(@PathVariable Integer id) {
		return registeredUserDAO.sendFriendshipRequest(id);
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@GetMapping("/registeredUser/getFriendRequests/{id}")
	public ResponseEntity<Set<RegisteredUser>> getFriendRequestsOfUser(@PathVariable Integer id) {
		return registeredUserDAO.getFriendRequestsOfUser(id);
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@DeleteMapping("/registeredUser/cancelFriendshipRequest/{id}")
	public ResponseEntity<String> cancelFriendshipRequest(@PathVariable Integer id) {
		return registeredUserDAO.cancelFriendshipRequest(id);
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@PostMapping("/registeredUser/acceptFriendshipRequest/{id}")
	public ResponseEntity<String> acceptFriendshipRequest(@PathVariable Integer id) {
		return registeredUserDAO.acceptFriendshipRequest(id);
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@DeleteMapping("/registeredUser/deleteFriendshipRequest/{id}")
	public ResponseEntity<String> deleteFriendshipRequest(@PathVariable Integer id) {
		return registeredUserDAO.deleteFriendshipRequest(id);
	}

	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@PutMapping("/registeredUser/updateProfile")
	public ResponseEntity<String> updateProfile(@RequestBody RegisteredUser user) {
		return registeredUserDAO.updateProfile(user);
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@GetMapping("/registeredUser/allFriends")
	public ResponseEntity<Collection<RegisteredUser>> friends() {
		return new ResponseEntity<Collection<RegisteredUser>>(registeredUserDAO.getUsersFriends(), HttpStatus.OK);

	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@DeleteMapping("/registeredUser/removeFriend/{id}")
	public ResponseEntity<String> removeFriend(@PathVariable Integer id) {
		return registeredUserDAO.removeFriend(id);
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@GetMapping("/registeredUser/getBonusPoints")
	public ResponseEntity<Integer> getBonusPoints() {
		return registeredUserDAO.getBonusPoints();
	}
	
	@PreAuthorize("hasRole('ROLE_REGISTEREDUSER')")
	@GetMapping("/registeredUser/{id}")
	public ResponseEntity<RegisteredUser> getUser(@PathVariable Integer id) {
		return registeredUserDAO.getUser(id);
	}
	
}
