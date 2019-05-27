package com.isamrs.tim14.dto;

public class UserDTO {

	private int id;
	private String password;
	private String firstName;
	private String lastName;
	private String email;
	private String city;
	private String phone;
	
	public UserDTO() {
		
	}

	public UserDTO(int id, String password, String firstName, String lastName, String email, String city, String phone) {
		super();
		this.id = id;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.city = city;
		this.phone = phone;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Override
	public String toString() {
		return "UserDTO [id=" + id + ", password=" + password + ", firstName=" + firstName + ", lastName=" + lastName
				+ ", email=" + email + ", city=" + city + ", phone=" + phone + "]";
	}

	
	
	
	
}
