package com.isamrs.tim14.dao;

import java.util.List;
import java.util.Set;

import org.springframework.http.ResponseEntity;

import com.isamrs.tim14.model.RegisteredUser;

public interface RegisteredUserDAO {

	public ResponseEntity<List<RegisteredUser>> searchUsers(String input);

	public ResponseEntity<Set<RegisteredUser>> getFriendRequests();
	
}
