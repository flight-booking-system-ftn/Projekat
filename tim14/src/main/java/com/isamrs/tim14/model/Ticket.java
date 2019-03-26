package com.isamrs.tim14.model;

public class Ticket {

	private String name;

	public Ticket() {
		super();
	}

	public Ticket(String name) {
		super();
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "Ticket [name=" + name + "]";
	}
	
	
	
}
