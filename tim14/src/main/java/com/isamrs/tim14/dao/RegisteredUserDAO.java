package com.isamrs.tim14.dao;

import java.util.List;
import java.util.Set;

import org.springframework.http.ResponseEntity;

import com.isamrs.tim14.model.RegisteredUser;

public interface RegisteredUserDAO {

	public ResponseEntity<List<RegisteredUser>> searchUsers(String input);

	public ResponseEntity<Set<RegisteredUser>> getFriendRequests();

	public ResponseEntity<String> sendFriendshipRequest(Integer id);

	public ResponseEntity<Set<RegisteredUser>> getFriendRequestsOfUser(Integer id);

	public ResponseEntity<String> cancelFriendshipRequest(Integer id);
	
	public ResponseEntity<String> acceptFriendshipRequest(Integer id);
	
	public ResponseEntity<String> deleteFriendshipRequest(Integer id);
	
}
