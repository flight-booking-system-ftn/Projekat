package com.isamrs.tim14.model;

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
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "airline")
public class Airline {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;

	@Column(name = "name")
	private String name;

	@OneToOne(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH }, fetch = FetchType.LAZY)
	@JoinColumn(name = "destination_id")
	private Destination destination;

	@Column(name = "description")
	private String description;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "airline")
	@JsonIgnoreProperties("airline")
	//@JsonBackReference(value="airline-flights")
	private Set<Flight> flights;
	
	@ManyToMany(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH }, fetch = FetchType.LAZY)
	@JoinTable(name = "airline_airport", joinColumns = { @JoinColumn(name = "airline_id") }, inverseJoinColumns = {
			@JoinColumn(name = "airport_id") })
	private Set<Airport> airports;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "airline")
	//@JsonBackReference(value="airline-services")
	@JsonIgnoreProperties("airline")
	private Set<AirlineService> services;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinColumn(name = "airline_id")
	private Set<Grade> grades;

	@OneToMany(cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH }, fetch = FetchType.LAZY, mappedBy = "airline")
	//@JsonBackReference(value="airline-admins")
	@JsonIgnoreProperties("airline")
	private Set<AirlineAdmin> admins;
	
	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "airline")
	@JsonIgnoreProperties("airline")
	//@JsonBackReference(value="airline-luggages")
	private Set<Luggage> luggagePricelist;

	public Airline() {
		super();
		
		this.flights = new HashSet<Flight>();
		this.services = new HashSet<AirlineService>();
		this.grades = new HashSet<Grade>();
		this.admins = new HashSet<AirlineAdmin>();
		this.luggagePricelist = new HashSet<Luggage>();
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

	public Set<Flight> getFlights() {
		return flights;
	}

	public void setFlights(Set<Flight> flights) {
		this.flights = flights;
	}

	public Set<Airport> getAirports() {
		return airports;
	}

	public void setAirports(Set<Airport> airports) {
		this.airports = airports;
	}

	public Set<AirlineService> getServices() {
		return services;
	}

	public void setServices(Set<AirlineService> services) {
		this.services = services;
	}

	public Set<Grade> getGrades() {
		return grades;
	}

	public void setGrades(Set<Grade> grades) {
		this.grades = grades;
	}

	public Set<AirlineAdmin> getAdmins() {
		return admins;
	}

	public void setAdmins(Set<AirlineAdmin> admins) {
		this.admins = admins;
	}

	public Set<Luggage> getLuggagePricelist() {
		return luggagePricelist;
	}

	public void setLuggagePricelist(Set<Luggage> luggagePricelist) {
		this.luggagePricelist = luggagePricelist;
	}

}