package com.isamrs.tim14.model;

import java.sql.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "room_reservation")
public class RoomReservation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;
	
	@Column(name = "start")
	private Date start;
	
	@Column(name = "end")
	private Date end;
	
	@ManyToMany(mappedBy = "reservations")
	private Set<Room> rooms;
	
	@ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinTable(name = "rooms_services", joinColumns = { @JoinColumn(name = "reservation_id") }, inverseJoinColumns = {
			@JoinColumn(name = "service_id") })
	private Set<HotelService> services;

	public RoomReservation() {
		super();
	}
	
	public Date getStart() {
		return start;
	}

	public void setStart(Date start) {
		this.start = start;
	}

	public Date getEnd() {
		return end;
	}

	public void setEnd(Date end) {
		this.end = end;
	}
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}


	public Set<Room> getRooms() {
		return rooms;
	}

	public void setRooms(Set<Room> rooms) {
		this.rooms = rooms;
	}

	public Set<HotelService> getServices() {
		return services;
	}

	public void setServices(Set<HotelService> services) {
		this.services = services;
	}

}
