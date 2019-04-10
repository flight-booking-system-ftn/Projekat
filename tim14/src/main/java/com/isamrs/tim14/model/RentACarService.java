package com.isamrs.tim14.model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "rent_a_car_service")
public class RentACarService extends Service {

	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rent_a_car_id")
	private RentACar rentACar;

	public RentACarService() {
		super();
	}

	public RentACar getRentACar() {
		return rentACar;
	}

	public void setRentACar(RentACar rentACar) {
		this.rentACar = rentACar;
	}

	
}
