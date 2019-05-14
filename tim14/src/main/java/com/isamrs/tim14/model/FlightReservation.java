package com.isamrs.tim14.model;

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
@Table(name = "flight_reservation")
public class FlightReservation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;
	
	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "flight_reservation_id")
	private Set<FlightTicket> tickets;
	
	@ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinTable(name = "flights_services", joinColumns = { @JoinColumn(name = "reservation_id") }, inverseJoinColumns = {
			@JoinColumn(name = "service_id") })
	private Set<AirlineService> services;

	public FlightReservation() {
		super();
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Set<FlightTicket> getTickets() {
		return tickets;
	}

	public void setTickets(Set<FlightTicket> tickets) {
		this.tickets = tickets;
	}

}
