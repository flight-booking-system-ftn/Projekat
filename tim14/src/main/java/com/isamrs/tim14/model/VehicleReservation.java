package com.isamrs.tim14.model;

import java.sql.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;

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
	
	@ManyToMany(fetch = FetchType.EAGER, mappedBy = "reservations")
	private Set<Vehicle> vehicles;
	
	@OneToMany(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH }, fetch = FetchType.LAZY)
	@JoinColumn(name = "vehicle_reservation_id")
	@JsonBackReference(value="vehicle-services")
	private Set<RentACarService> services;
	
	@ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH },fetch = FetchType.EAGER)
    @JoinColumn(name = "rent_a_car_id")
	private RentACar rentACar;
	
	@ManyToOne(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH }, fetch = FetchType.EAGER)
    @JoinColumn(name = "branch_office_id")
	private BranchOffice endBranchOffice;

	@ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH },fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
	private RegisteredUser registeredUser;
	
	@Column(name = "price")
	private Double price;
	
	@Column(name = "discount")
	private Integer discount;
	
	public VehicleReservation() {
		super();
		this.vehicles = new HashSet<Vehicle>();
		this.services = new HashSet<RentACarService>();
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


	public Set<Vehicle> getVehicles() {
		return vehicles;
	}

	public void setVehicles(Set<Vehicle> vehicle) {
		this.vehicles = vehicle;
	}

	public Set<RentACarService> getServices() {
		return services;
	}

	public void setServices(Set<RentACarService> services) {
		this.services = services;
	}

	public RentACar getRentACar() {
		return rentACar;
	}

	public void setRentACar(RentACar rentACar) {
		this.rentACar = rentACar;
	}

	public RegisteredUser getRegisteredUser() {
		return registeredUser;
	}

	public void setRegisteredUser(RegisteredUser registeredUser) {
		this.registeredUser = registeredUser;
	}

	public BranchOffice getEndBranchOffice() {
		return endBranchOffice;
	}

	public void setEndBranchOffice(BranchOffice endBranchOffice) {
		this.endBranchOffice = endBranchOffice;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
	}

	public void setPrice(Double price) {
		this.price = price;
	}
	
	

}
