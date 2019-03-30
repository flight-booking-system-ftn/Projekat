package com.isamrs.tim14.model;

import java.sql.Date;
import java.util.HashSet;

public class Flight {

	private Date departureDate;
	private Date returnDate;
	private Integer flightTime;
	private Integer flightLength;
	private Integer price;
	private Integer stopNumber;
	private HashSet<Destination> stopDestinations;
	
}
