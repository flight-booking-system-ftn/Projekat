package com.isamrs.tim14.model;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "rent_a_car")
public class RentACar {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;
	
	@Column(name = "name")
	private String name;
	
	@JoinColumn(name = "destination_id")
    @OneToOne(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH })
	private Destination destination;
	
	@Column(name = "description")
	private String description;
	
	@ElementCollection(targetClass = RentACarService.class)
	private Set<RentACarService> services;
	
	@ElementCollection(targetClass = Vehicle.class)
	private Set<Vehicle> vehicles;
	
	@ElementCollection(targetClass = BranchOffice.class)
	private Set<BranchOffice> offices;
	
	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "rent_a_car_id")
	private Set<Grade> grades;
	
	@ElementCollection(targetClass = RentACarAdmin.class)
	private Set<RentACarAdmin> admins;
	
	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "rent_a_car_id")
	private Set<VehicleReservation> reservations;

	public RentACar() {
		super();
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Destination getDestination() {
		return destination;
	}

	public void setDestination(Destination destination) {
		this.destination = destination;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Set<RentACarService> getServices() {
		return services;
	}

	public void setServices(Set<RentACarService> services) {
		this.services = services;
	}

	public Set<Vehicle> getVehicles() {
		return vehicles;
	}

	public void setVehicles(Set<Vehicle> vehicles) {
		this.vehicles = vehicles;
	}

	public Set<BranchOffice> getOffices() {
		return offices;
	}

	public void setOffices(Set<BranchOffice> offices) {
		this.offices = offices;
	}

	public Set<Grade> getGrades() {
		return grades;
	}

	public void setGrades(Set<Grade> grades) {
		this.grades = grades;
	}

	public Set<RentACarAdmin> getAdmins() {
		return admins;
	}

	public void setAdmins(Set<RentACarAdmin> admins) {
		this.admins = admins;
	}

	public Set<VehicleReservation> getReservations() {
		return reservations;
	}

	public void setReservations(Set<VehicleReservation> reservations) {
		this.reservations = reservations;
	}
	
}
