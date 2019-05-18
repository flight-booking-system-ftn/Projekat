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
					var tripType = $("<td>" + (flight.flightType == "ONE_WAY" ? "One way" : "Round trip") + "</td>");
					var from = $("<td>" + flight.from.name + " - " + flight.from.address + "</td>");
					var to = $("<td>" + flight.to.name + " - " + flight.to.address + "</td>");
					var stops = $("<td>" + flight.stops.length + "</td>");
					var departureDate = $("<td>" + formatDate(new Date(flight.departureDate)) + "</td>");
					var arrivalDate = $("<td>" + formatDate(new Date(flight.arrivalDate)) + "</td>");
					var returnDepartureDate = $("<td>" + (flight.returnDepartureDate == null ? "" : formatDate(new Date(flight.returnDepartureDate))) + "</td>");
					var returnArrivalDate = $("<td>" + (flight.returnArrivalDate == null ? "" : formatDate(new Date(flight.returnArrivalDate))) + "</td>");
					var luggageQuantity = $("<td>" + flight.luggageQuantity + "</td>");
					var ticketPrice = $("<td>" + flight.ticketPrice + "</td>");
					var actions = $("<td><input type='button' class='edit' value='Edit seats'></td>");
					
					tr.append(id);
					tr.append(tripType);
					tr.append(from);
					tr.append(to);
					tr.append(stops);
					tr.append(departureDate);
					tr.append(arrivalDate);
					tr.append(returnDepartureDate);
					tr.append(returnArrivalDate);
					tr.append(luggageQuantity);
					tr.append(ticketPrice);
					tr.append(actions);
					
					table.append(tr);
				});
			}
		});
	}
	
	function formatDate(date) {
		return date.toLocaleDateString("en", options) + " " + (date.getHours() < 10 ? "0" + (date.getHours()) : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
	}
	
	var seats;
	$("input.edit").on("click", function() {
		var flightID = $(this).parent().parent().find("input[type='hidden']").attr("value");
		
		$.ajax({
			type: "GET",
			url: "/flight/" + flightID + "/seats",
			async: false,
			contentType: "text/html; charset=utf-8",
			dataType: "json",
			success: function(data) {
				seats = data;
				var table = $("<table id='seats' border='5px solid gray' width='100%' height='500px'></table>");
				var tr = $("<tr></tr>");
				
				$.each(data, function(index, seat) {
					var bgcolor;
					if(seat.enabled == false)
						bgcolor = "#a3a3a3";
					else if(seat.busy == true)
						bgcolor = "#ff0000";
					else if(seat.type == "FIRST_CLASS")
						bgcolor = "#fffc77";
					else if(seat.type == "BUSINESS")
						bgcolor = "#77c8ff";
					else
						bgcolor = "#b8ff82";
					
					var td = $("<td bgcolor='" + bgcolor + "'><input type='hidden' value='" + seat.id + "'></td>");
					tr.append(td);
					
					if(index % 3 == 2) {
						table.append(tr);
						
						tr = $("<tr></tr>");
					}
				});
				
				if(tr.children().length > 0) {
					table.append(tr);
				}
				
				var dialog = $("<div id='myDialog' class='modal'></div>");
				var dialogContent = $("<div class='modal-content'><h4>Edit seats</h4><span class='close'>&times;</span></div>");
				
				dialogContent.append(table);
				dialogContent.append($("<br>"));
				
				var toggleBtn = $("<input type='button' id='toggleSeat' value='Enable/Disable'>");
				toggleBtn.prop("disabled", true);
				
				var deleteBtn = $("<input type='button' id='deleteSeat' value='Delete'>");
				deleteBtn.prop("disabled", true);
				
				dialogContent.append(toggleBtn);
				dialogContent.append("   ");
				dialogContent.append(deleteBtn);
				
				dialog.append(dialogContent);
				$("body").append(dialog);
			}
		});
	});
	
	$(document).on("click", "span.close", function() {
		$("div.modal").remove();
	});
	
	var previousSeat = undefined; //Ujedno i trenutno selektovano mesto
	$(document).on("click", "table#seats td", function() {
		$(this).css("border", "1px solid red");
		if(previousSeat != undefined) {
			previousSeat.css("border", "1px solid transparent");
		}
		previousSeat = $(this);
		
		$("input#toggleSeat").prop("disabled", false);
		$("input#deleteSeat").prop("disabled", false);
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
						bgcolor = "#fffc77";
					else if(data.type == "BUSINESS")
						bgcolor = "#77c8ff";
					else
						bgcolor = "#b8ff82";
				} else {
					bgcolor = "#a3a3a3";
				}
				
				previousSeat.attr("bgcolor", bgcolor);
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
	
	$(document).on('click', '#addAirlineBtn', function() {
		$(location).attr('href', "/airline.html");
	});
	
	$(document).on('click', '#editAirlineBtn', function() {
		$(location).attr('href', "/editAirline.html");
	});
	
	$(document).on('click', '#addFlightBtn', function() {
		$(location).attr('href', "/newFlight.html");
	});
	
	$(document).on('click', '#addDestinationBtn', function() {
		$(location).attr('href', "/destination.html");
	});
	
	$(document).on('click','#logoutBtn',function(){
    	removeJwtToken();
        $(location).attr('href',"/logout");
    });
})