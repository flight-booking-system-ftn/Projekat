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
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "vehicle_reservation")
public class VehicleReservation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;
	
	@Column(name = "start")
	private Date start;
	
	@Column(name = "end")
	private Date end;
	
	@ManyToMany(mappedBy = "reservations")
	private Set<Vehicle> vehicle;
	
	@ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinTable(name = "vehicles_services", joinColumns = { @JoinColumn(name = "reservation_id") }, inverseJoinColumns = {
			@JoinColumn(name = "service_id") })
	private Set<RentACarService> services;

	public VehicleReservation() {
		super();
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
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


	public Set<Vehicle> getVehicle() {
		return vehicle;
	}

	public void setVehicle(Set<Vehicle> vehicle) {
		this.vehicle = vehicle;
	}

	public Set<RentACarService> getServices() {
		return services;
	}

	public void setServices(Set<RentACarService> services) {
		this.services = services;
	}

}
