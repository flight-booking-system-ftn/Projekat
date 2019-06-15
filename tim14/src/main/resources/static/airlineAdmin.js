$(document).ready(function() {
	$.ajax({
		type: 'GET',
		url: '/auth/getInfo',
		headers: createAuthorizationTokenHeader(),
		success: function(data){
			if(data.passwordChanged){
				$('#passwordChangedTRUE').show();
				$('#passwordChangedFALSE').hide();
			}else{
				$('#passwordChangedTRUE').hide();
				$('#passwordChangedFALSE').show();
			}
		},
		error: function (jqXHR) {
        	if (jqXHR.status == 401) {
				showMessage('Login as airline administrator!', "orange");
			}else{
				showMessage('[' + jqXHR.status + "]  ", "red");
			}
        }
	});
	
	$(document).on('click','#firstTimeChangePassword', function(){
		//var currentPass = $('#oldPasswordField').val();
		var newPassword = $('#newPasswordField').val();
		var repNewPassword = $('#reNewPasswordField').val();
		if(newPassword == "" || repNewPassword == ""){
			showMessage("Please fill all the fields!", 'orange');
			return;
		}
		if(newPassword != repNewPassword){
			showMessage('New password and repeat new password fields must be equals!', 'orange');
			return;
		}
		
		$.ajax({
			type: 'POST',
			url: '/auth/initChangePassword',
			headers: createAuthorizationTokenHeader(),
			data : JSON.stringify({
				'currentPassword': '',
				newPassword,
				repNewPassword
			}),
			success: function(check){
				if(check){
					showMessage('Login once again and enjoy!', 'green');
			        $(location).attr('href',"/logout");
				}else{
					showMessage('Old password is not correct!', 'orange');
				}
			},
			error: function (jqXHR, exception) {
				if (jqXHR.status == 401) {
					showMessage('Login as airline administrator!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  ", "red");
				}
			}
		});

	});
	
	var options = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
	
	getFlights();
	
	function getFlights() {
		$.ajax({
			type: "GET",
			url: "/api/airline/flights",
			headers: createAuthorizationTokenHeader(),
			success: function(data) {
				var table = $("table#flightsTable tbody");
				
				$.each(data, function(index, flight) {
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
	
	$(document).on("click", "input.edit", function() {
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
			headers: createAuthorizationTokenHeader(),
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
				
				showMessage("Seat status successfully changed.", "green");
			},
			error: function(jqXHR, exception) {
				showMessage("Reserved seat can't be disabled.", "red");
			}
		});
	});
	
	$(document).on("click", "input#deleteSeat", function() {
		var seatID = previousSeat.find("input[type='hidden']").attr("value");
		
		$.ajax({
			type: "DELETE",
			url: "seats/delete/" + seatID,
			headers: createAuthorizationTokenHeader(),
			success: function(data) {
				showMessage(data);
				previousSeat.remove();
			},
			error: function(jqXHR, exception) {
				showMessage(jqXHR, "red");
			}
		});
	});
	
	var selectedFlight;
	$(document).on("click", "input.makeQuickReservation", function() {
		var seatsDiv = $("div#seatsDiv");
    	seatsDiv.empty();
    	
    	selectedFlight = $(this).parent().parent().attr("id");
    	
    	$.ajax({
			type: "GET",
			url: "/flight/" + selectedFlight + "/seats",
			contentType: "text/html; charset=utf-8",
			headers: createAuthorizationTokenHeader(),
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
	
	$("button#profileBtn").click( function() {
		$.ajax({
			type: "GET",
			url: "/auth/getInfo",
			headers: createAuthorizationTokenHeader(),
			success: function(admin) {
				$("input#firstName").val(admin.firstName);
				$("input#lastName").val(admin.lastName);
				$("input#email").val(admin.email);
				$("input#city").val(admin.city);
				$("input#phone").val(admin.phoneNumber);
				
				$("div#dialogProfile").show();
			},
			error: function(response) {
				showMessage("You have been logged out. Please login again.", "red");
				$(location).attr('href',"/login.html");
			}
		});
	});
	
	$("button#saveProfile").click(function() {
		var newPassword = $("input#newPassword").val();
		var repeatedPassword = $("input#repeatedPassword").val();
		
		var firstName = $("input#firstName").val();
		var lastName = $("input#lastName").val();
		var email = $("input#email").val();
		var city = $("input#city").val();
		var phone = $("input#phone").val();
		
		if(newPassword != "" && repeatedPassword != newPassword) {
			showMessage("Repeated password doesn't match new password.", "orange");
			return;
		}
		
		var admin = {
			"password": newPassword,
			"firstName": firstName,
			"lastName": lastName,
			"email": email,
			"city": city,
			"phoneNumber": phone
		};
		
		$.ajax({
			type: "PUT",
			url: "/api/airlineadmins/updateProfile",
			headers: createAuthorizationTokenHeader(),
			data: JSON.stringify(admin),
			success: function() {
				showMessage("Profile successfully saved.", "green");
			}
		});
		
		$("div#dialogProfile").hide();
	});
	
	$("button#closeProfileDialog").click(function() {
		$("div#dialogProfile").hide();
	});
	
	$("button#addFlightBtn").click(function() {
		$(location).attr('href', "/newFlight.html");
	});
	
	$("button#addAirportBtn").click(function() {
		$(location).attr('href',"/newAirport.html");
	});
	
	$("button#editAirlineBtn").click(function() {
		$(location).attr('href',"/editAirline.html");
	});
	
	$("button#defineLuggagePricelistBtn").click(function(){
        $(location).attr('href',"/luggagePricelist.html");
    });
	
	$("button#logoutBtn").click(function(){
    	removeJwtToken();
        $(location).attr('href',"/logout");
    });
})