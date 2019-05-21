$(document).ready(function() {
	var flights;
	var options = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
	
	getFlights();
	
	function getFlights() {
		$.ajax({
			type: "GET",
			url: "/flight/flightsOfAirline",
			async: false,
			success: function(data) {
				flights = data;
				var table = $("table#flightsTable tbody");
				
				$.each(flights, function(index, flight) {
					var tr = $("<tr id='" + flight.id + "'></tr>");
					var id = $("<input type='hidden' value='" + flight.id + "'>");
					var from = $("<td>" + flight.from.name + " - " + flight.from.destination.name + ", " + flight.from.destination.country + "</td>");
					var to = $("<td>" + flight.to.name + " - " + flight.to.destination.name + ", " + flight.to.destination.country + "</td>");
					var stops = $("<td>" + flight.stops.length + "</td>");
					var departureDate = $("<td>" + formatDate(new Date(flight.departureDate)) + "</td>");
					var arrivalDate = $("<td>" + formatDate(new Date(flight.arrivalDate)) + "</td>");
					var luggageQuantity = $("<td>" + flight.luggageQuantity + "</td>");
					var ticketPriceFirstClass = $("<td>" + flight.ticketPriceFirstClass + "</td>");
					var ticketPriceBusinessClass = $("<td>" + flight.ticketPriceBusinessClass + "</td>");
					var ticketPriceEconomyClass = $("<td>" + flight.ticketPriceEconomyClass + "</td>");
					var actions = $("<td><input type='button' class='edit' value='Edit seats'> &nbsp; &nbsp; &nbsp; &nbsp; <input type='button' class='makeQuickReservation' value='Make quick reservation'></td>");
					
					tr.append(id);
					tr.append(from);
					tr.append(to);
					tr.append(stops);
					tr.append(departureDate);
					tr.append(arrivalDate);
					tr.append(luggageQuantity);
					tr.append(ticketPriceFirstClass);
					tr.append(ticketPriceBusinessClass);
					tr.append(ticketPriceEconomyClass);
					tr.append(actions);
					
					table.append(tr);
				});
			}
		});
	}
	
	function formatDate(date) {
		return date.toLocaleDateString("en", options) + " " + (date.getHours() < 10 ? "0" + (date.getHours()) : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
	}
	
	$("input.edit").on("click", function() {
		var seatsTableDiv = $("div#seatsTableDiv");
		var flightID = $(this).parent().parent().find("input[type='hidden']").attr("value");
		
		$.ajax({
			type: "GET",
			url: "/flight/" + flightID + "/seats",
			contentType: "text/html; charset=utf-8",
			dataType: "json",
			success: function(data) {
				
				seatsTableDiv.css("height", ((data.length / 3) * 55 + (data.length % 3 > 0 ? 20 : 0)) + "px");
				$.each(data, function(index, seat) {
					var bgcolor;
					if(seat.enabled == false)
						bgcolor = "#3a3a3a";
					else if(seat.busy == true)
						bgcolor = "#ff0000";
					else if(seat.type == "FIRST_CLASS")
						bgcolor = "#ffd700";
					else if(seat.type == "BUSINESS")
						bgcolor = "#0000ff";
					else
						bgcolor = "#00ff00";
					
					var seatDiv = $("<div style='background-color: " + bgcolor + ";' class='seatDivForEdit'><input type='hidden' value='" + seat.id + "'></div>");
					
					if(index % 3 == 0)
						seatDiv.css("clear", "left");
					
					seatsTableDiv.append(seatDiv);
				});
				
				$("div#editSeatsModal").show();
			}
		});
	});
	
	var previousSeat = undefined; //Ujedno i trenutno selektovano mesto
	$(document).on("click", "div.seatDivForEdit", function() {
		if($(this).css("background-color") == "rgb(255, 0, 0)")
			return;
		
		if(previousSeat != undefined) {
			previousSeat.css("border", "0");
		}
		$(this).css("border", "2px solid red");
		previousSeat = $(this);
		
		$("input#toggleSeat").removeAttr("disabled");
		$("input#deleteSeat").removeAttr("disabled");
	});
	
	$(document).on("click", "input#toggleSeat", function() {
		var seatID = previousSeat.find("input[type='hidden']").attr("value");
		
		$.ajax({
			type: "PUT",
			url: "seats/toggle/" + seatID,
			contentType: "text/html; charset=utf-8",
			success: function(data) {
				var bgcolor;
				if(data.enabled == true) {
					if(data.type == "FIRST_CLASS")
						bgcolor = "#ffd700";
					else if(data.type == "BUSINESS")
						bgcolor = "#0000ff";
					else
						bgcolor = "#00ff00";
				} else {
					bgcolor = "#3a3a3a";
				}
				
				previousSeat.css("background-color", bgcolor);
			},
			error: function() {
				showMessage("Reserved seat can't be disabled.", "red");
			}
		});
	});
	
	$(document).on("click", "input#deleteSeat", function() {
		var seatID = previousSeat.find("input[type='hidden']").attr("value");
		
		$.ajax({
			type: "DELETE",
			url: "seats/delete/" + seatID,
			contentType: "text/html; charset=utf-8",
			success: function(data) {
				previousSeat.remove();
			},
			error: function() {
				showMessage("Reserved seat can't be deleted.", "red");
			}
		});
	});
	
	var selectedFlight;
	$("input.makeQuickReservation").on("click", function() {
		var seatsDiv = $("div#seatsDiv");
    	seatsDiv.empty();
    	
    	selectedFlight = $(this).parent().parent().attr("id");
    	
    	$.ajax({
			type: "GET",
			url: "/flight/" + selectedFlight + "/seats",
			contentType: "text/html; charset=utf-8",
			dataType: "json",
			success: function(data) {
				seatsDiv.css("height", ((data.length / 3) * 55 + (data.length % 3 > 0 ? 20 : 0)) + "px");
				
				$.each(data, function(index, seat) {
					var bgcolor;
					if(seat.enabled == false)
						bgcolor = "#3a3a3a";
					else if(seat.busy == true)
						bgcolor = "#ff0000";
					else if(seat.type == "FIRST_CLASS")
						bgcolor = "#ffd700";
					else if(seat.type == "BUSINESS")
						bgcolor = "#0000ff";
					else
						bgcolor = "#00ff00";
					
					var seatDiv = $("<div style='background-color: " + bgcolor + ";' class='seatDivForReservation' id='" + seat.id + "'><input type='hidden' value='" + seat.id + "'></div>");
					
					if(index % 3 == 0)
						seatDiv.css("clear", "left");
					
					seatsDiv.append(seatDiv);
				});
				
				$("div#reservationSeatsModal").show();
			}
		});
	});
	
	var selectedSeats = [];
	$(document).on("click", "div.seatDivForReservation", function() {
		if($(this).css("background-color") == "rgb(58, 58, 58)" || $(this).css("background-color") == "rgb(255, 0, 0)")
			return;
		
		var seatId = $($(this).children("input")[0]).attr("value");
		
		var exists = false;
		for(var i = 0; i < selectedSeats.length; i++) {
			if(selectedSeats[i] == seatId) {
				selectedSeats.splice(i, 1);
				$(this).css("border", "0");
				
				exists = true;
				
				if(selectedSeats.length == 0) {
					$("input#makeQuickReservation").attr("disabled", "disabled");
				}
				
				break;
			}
		}
		
		if(!exists) {
			selectedSeats.push(parseInt(seatId));
			$(this).css("border", "2px solid red");
			
			$("input#makeQuickReservation").removeAttr("disabled");
		}
	});
	
	$("input#makeQuickReservation").click(function() {
		$.ajax({
			type: "GET",
			url: "/flight/" + selectedFlight,
			headers: createAuthorizationTokenHeader(),
			success: function(flight) {
				var reservations = [];
				console.log(selectedSeats);
				$.ajax({
					type: "POST",
					url: "/seats/getSelectedSeats",
					headers: createAuthorizationTokenHeader(),
					data: JSON.stringify(selectedSeats),
					success: function(seats) {
						seats.forEach(function(seat) {
							var price = 0;
							if(seat.type == "FIRST_CLASS")
								price = flight.ticketPriceFirstClass;
							else if(seat.type == "BUSINESS")
								price = flight.ticketPriceBusinessClass;
							else
								price = flight.ticketPriceEconomyClass;
							
							var reservation = {
								"flight": flight,
								"seat": seat,
								"price": price,
								"discount": parseInt($("input#discount").val())
							};
							
							reservations.push(reservation);
						});
						
						console.log(reservations);
						
						$.ajax({
							type: "POST",
							url: "/api/flightReservation/makeQuick",
							headers: createAuthorizationTokenHeader(),
				    		data: JSON.stringify(reservations),
				    		success: function(data) {
				    			showMessage(data, "green");
				    			
				    			selectedSeats.forEach(function(seatID) {
				    				$("div.seatDivForReservation#" + seatID).css("background-color", "red");
				    				$("div.seatDivForReservation#" + seatID).css("border", "0");
				    			});
				    			
				    			selectedSeats = [];
				    			$("input#makeQuickReservation").attr("disabled", "disabled");
				    		},
				    		error: function (jqXHR, exception) {
				    			if (jqXHR.status == 401) {
				    				showMessage("Not authenticated!", "red");
				    			} else{
				    				showMessage(jqXHR, "red");
				    			}
							}
						});
					}
				});
			}
		});
	});
	
	$(document).on("click", "span.close", function() {
		$("div#seatsTableDiv").empty();
		$("div#seatsDiv").empty();
		
		previousSeat = undefined;
		selectedSeats = [];
		
		$("input#toggleSeat").attr("disabled", "disabled");
		$("input#deleteSeat").attr("disabled", "disabled");
		$("input#makeQuickReservation").attr("disabled", "disabled");
		
		$("div#editSeatsModal").hide();
		$("div#reservationSeatsModal").hide();
	});
	
	$("button#addFlightBtn").click(function() {
		$(location).attr('href', "/newFlight.html");
	});
	
	$("button#addOfficeBtn").click(function() {
		$(location).attr('href', "/newAirlineOffice.html");
	});
	
	$("button#logoutBtn").click(function(){
    	removeJwtToken();
        $(location).attr('href',"/logout");
    });
})