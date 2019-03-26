package com.isamrs.tim14.model;

import java.util.HashSet;

public class RegisteredUser extends User{

	private HashSet<User> friendlist;

	public RegisteredUser() {
		super();
	}

	public RegisteredUser(Integer id, String username, String password, String firstName, String lastName,
			String email) {
		super(id, username, password, firstName, lastName, email);
	}

	public RegisteredUser(HashSet<User> friendlist) {
		super();
		this.friendlist = friendlist;
	}

	public HashSet<User> getFriendlist() {
		return friendlist;
	}

	public void setFriendlist(HashSet<User> friendlist) {
		this.friendlist = friendlist;
	}
	
	
	
	
}
