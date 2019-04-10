package com.isamrs.tim14.model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "airline_service")
public class AirlineService extends Service {
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "airline_id")
	Airline airline;

	public AirlineService() {
		super();
	}

	public Airline getAirline() {
		return airline;
	}

	public void setAirline(Airline airline) {
		this.airline = airline;
	}

}
