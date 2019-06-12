package com.isamrs.tim14.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class RegisteredUser extends User {

	@ManyToMany(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH }, fetch = FetchType.EAGER)
	@JoinTable(name = "friend_table", joinColumns = { @JoinColumn(name = "friend1") }, inverseJoinColumns = {
			@JoinColumn(name = "friend2") })
	@JsonBackReference(value="friends")
	private Set<RegisteredUser> friends;

	@ManyToMany(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH }, fetch = FetchType.EAGER)
	@JoinTable(name = "friendship_request", joinColumns = { @JoinColumn(name = "request_for") }, inverseJoinColumns = {
			@JoinColumn(name = "request_from") })
	@JsonBackReference(value="friendship-request")
	private Set<RegisteredUser> friendshipRequests;

	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "user_id")
	@JsonBackReference(value="user-flightReservation")
	private Set<FlightReservation> flightReservations;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy="registeredUser")
	@JsonBackReference(value="user-roomReservation")
	private Set<RoomReservation> roomReservations;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy="registeredUser")
	@JsonBackReference(value="user-vehicleReservation")
	private Set<VehicleReservation> vehicleReservations;

	@Column(name = "bonus_points")
	private Integer bonusPoints;

	@Column(name = "verified")
	private boolean verified;
	
	public RegisteredUser() {
		super();
		this.friends = new HashSet<RegisteredUser>();
		this.friendshipRequests = new HashSet<RegisteredUser>();
		this.flightReservations = new HashSet<FlightReservation>();
		this.roomReservations = new HashSet<RoomReservation>();
		this.vehicleReservations = new HashSet<VehicleReservation>();
		this.bonusPoints = 0;
		this.verified = false;
	}

	public Set<RegisteredUser> getFriends() {
		return friends;
	}

	public void setFriends(Set<RegisteredUser> friends) {
		this.friends = friends;
	}

	public Set<RegisteredUser> getFriendshipRequests() {
		return friendshipRequests;
	}

	public void setFriendshipRequests(Set<RegisteredUser> friendshipRequests) {
		this.friendshipRequests = friendshipRequests;
	}

	public Set<FlightReservation> getFlightReservations() {
		return flightReservations;
	}

	public void setFlightReservations(Set<FlightReservation> flightReservations) {
		this.flightReservations = flightReservations;
	}

	public Set<RoomReservation> getRoomReservations() {
		return roomReservations;
	}

	public void setRoomReservations(Set<RoomReservation> roomReservations) {
		this.roomReservations = roomReservations;
	}

	public Set<VehicleReservation> getVehicleReservations() {
		return vehicleReservations;
	}

	public void setVehicleReservations(Set<VehicleReservation> vehicleReservations) {
		this.vehicleReservations = vehicleReservations;
	}

	public Integer getBonusPoints() {
		return bonusPoints;
	}

	public void setBonusPoints(Integer bonusPoints) {
		this.bonusPoints = bonusPoints;
	}
	
	public boolean isVerified() {
		return verified;
	}

	public void setVerified(boolean verified) {
		this.verified = verified;
	}

    
}
