package com.isamrs.tim14.model;

public class Service {

	private String name;
	private Integer price;
	
	public Service() {
		super();
	}

	public Service(String name, Integer price) {
		super();
		this.name = name;
		this.price = price;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
	}

	@Override
	public String toString() {
		return "HotelService [name=" + name + ", price=" + price + "]";
	}
	
	
	
	
}
