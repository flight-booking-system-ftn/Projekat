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

	@ManyToMany(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH })
	@JoinTable(name = "friend_table", joinColumns = { @JoinColumn(name = "friend1") }, inverseJoinColumns = {
			@JoinColumn(name = "friend2") })
	@JsonBackReference(value="user-user1")
	private Set<RegisteredUser> friendList1;

	@ManyToMany(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH })
	@JoinTable(name = "friend_table", joinColumns = { @JoinColumn(name = "friend2") }, inverseJoinColumns = {
			@JoinColumn(name = "friend1") })
	@JsonBackReference(value="user-user2")
	private Set<RegisteredUser> friendList2;

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

	public RegisteredUser() {
		super();
		this.friendList1 = new HashSet<RegisteredUser>();
		this.friendList2 = new HashSet<RegisteredUser>();
		this.flightReservations = new HashSet<FlightReservation>();
		this.roomReservations = new HashSet<RoomReservation>();
		this.vehicleReservations = new HashSet<VehicleReservation>();
		this.bonusPoints = 0;
	}

	public Set<RegisteredUser> getFriendList1() {
		return friendList1;
	}

	public void setFriendList1(Set<RegisteredUser> friendList1) {
		this.friendList1 = friendList1;
	}

	public Set<RegisteredUser> getFriendList2() {
		return friendList2;
	}

	public void setFriendList2(Set<RegisteredUser> friendList2) {
		this.friendList2 = friendList2;
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

}
