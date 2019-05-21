all_rooms = [];
selected_rooms = [];
all_hotel_services = [];
selected_hotel_services = [];

$(document).ready(function(){
    
    renderAirlineTable();
    renderHotelTable();
    renderRentACarTable();

    $(document).on('click','#addAirlineBtn',function(){
        $(location).attr('href',"/airline.html");
    });
    $(document).on('click','#addHotelBtn',function(){
        $(location).attr('href',"/hotel.html");
    });
    $(document).on('click','#addRentACarBtn',function(){
        $(location).attr('href',"/rentacar.html");
    });
    $(document).on('click','#editAirlineBtn',function(){
        $(location).attr('href',"/editAirline.html");
    });
    $(document).on('click','#addFlightBtn',function(){
        $(location).attr('href',"/newFlight.html");
    });
    $(document).on('click','#addAirportBtn',function(){
        $(location).attr('href',"/newAirport.html");
    });
    $(document).on('click','#loginUserBtn',function(){
        $(location).attr('href',"/login.html");
    });
    
    $(document).on('click','#registrationBtn',function(){
        $(location).attr('href',"/registration.html");
    });
    
    $(document).on('click','#addRoomBtn',function(){
        $(location).attr('href',"/room.html");
    });
    
    $(document).on('click','#addVehicleBtn',function(){
        $(location).attr('href',"/vehicle.html");
    });
    
    $(document).on('click','#defineLuggagePricelistBtn',function(){
        $(location).attr('href',"/luggagePricelist.html");
    });

    $(document).on('click','#addAirlineAdminBtn',function(){
        $(location).attr('href',"/newAirlineAdmin.html");
    });
    $(document).on('click','#addHotelAdminBtn',function(){
        $(location).attr('href',"/newHotelAdmin.html");
    });
    $(document).on('click','#addRentACarAdminBtn',function(){
        $(location).attr('href',"/newRentACarAdmin.html");
    });
    
    $(document).on('click','#logoutBtn',function(){
    	removeJwtToken();
        $(location).attr('href',"/logout");
    });
    
    $(document).on('click','#airlineSearchBtn', function(){
        renderAirlineTableSearch();
    });
    
    $(document).on('click','#hotelSearchBtn', function(){
        renderHotelTableSearch();
    });

    $(document).on('click','#rentSearchBtn', function(){
        renderRentACarTableSearch();
    });
    
    $(document).on('click','#roomSearchBtn', function(){
        var hotelId = $('#hotelIdField').val();
        var start = stringToDate($('#roomSearchArrivalDate').val());
		var end = start + $('#roomSearchDayNumber').val()*24*60*60*1000;
		console.log(">>> " + start);
		console.log(">>> " + end);
        var TwoBedRooms = $('#roomSearch2Bed').prop('checked');
        var ThreeBedRooms = $('#roomSearch3Bed').prop('checked');
        var FourBedRooms = $('#roomSearch4Bed').prop('checked');
        console.log('Hotel id: ', hotelId ,'....', start, end, TwoBedRooms, ThreeBedRooms, FourBedRooms);

        renderRoomTable(hotelId, start, end, TwoBedRooms, ThreeBedRooms, FourBedRooms,$('#roomSearchDayNumber').val() );
    });
    
    $(document).on('click','#vehicleSearchBtn', function(){
        var rentId = $('#rentIdField').val();
        var arrivalDate = $('#vehicleSearchArrivalDate').val();
        var numDays = $('#vehicleSearchDayNumber').val();
        var cars = $('#vehicleCars').prop('checked');
        var motocycles = $('#vehicleMotocycles').prop('checked');
        console.log('Rent: ', rentId ,'....', arrivalDate, numDays, cars, motocycles);
        renderVehicleTable(rentId, arrivalDate, numDays, cars, motocycles);
    });
    
    $(document).on('click','#quitDialogHotelView',function(){
        $('#selectedHotelRoomsTable').html(`<tr><th>Floor number</th><th>Number of beds</th><th>Grade</th><th>Full price</th><th>Select</th></tr>`);
        $('#dialogHotelView').css("display","none");
    });

    $(document).on('click','table button',function(e){
        if(e.target.id.startsWith("hotelDetailViewBtn")){
            var message = e.target.id.substr(18);
            console.log("PORUKA JE ", message);
            $.get('/api/hotels/'+ message, function(data){
                console.log("MY DATA: ", data);
                $('#hotelIdField').val(message);
                $('#pNameOfChosenHotel').text(data.name);
                $('#pDescriptionOfChosenHotel').text(data.description);
                $('#pDestinationOfChosenHotel').text(data.destination.name +
                    ", " + data.destination.country);
                $('#roomSearchArrivalDate').val(formatDate(new Date()));
                $.get('/api/quickRoomReservations/' + message, function(data){
                	console.log("quick reservations: ", data);
                    renderHotelServiceTable(message);
                    renderQuickRoomReservations(data);
                });
            });
        }else if(e.target.id.startsWith('quickRoomReservationNumber')){
        	var message = e.target.id.substr(26);
        	$.ajax({
    			type : 'GET',
    			url : "/api/reserveQuickRoomReservation/"+message,
    			headers: createAuthorizationTokenHeader(),
    			success: function(){
    				showMessage('Successfully reserved quick room reservation');
    				$('#dialogHotelView').css('display', 'none');
    			},
    			error: function (jqXHR, exception) {
    				if (jqXHR.status == 401) {
    					showMessage('Login first!', "orange");
					}else{
						showMessage('[' + jqXHR.status + "]  " + exception, "red");
					}
    			}
    		})
        }
    });
    
    $(document).on('click','table button',function(e){
        if(e.target.id.startsWith("rentDetailViewBtn")){
            var message = e.target.id.substr(17);
            console.log("PORUKA JE ", message);
            $.get('/api/rentacars/'+ message, function(data){
                console.log("MY DATA: ", data);
                console.log("DEST", data.destination);
                $('#rentIdField').val(message);
                $('#pNameOfChosenRent').text(data.name);
                $('#pDescriptionOfChosenRent').text(data.description);
                $('#pDestinationOfChosenRent').text(data.destination.name +
                    ", " + data.destination.country);
                $('#vehicleSearchArrivalDate').val(formatDate(new Date()));
                $('#dialogRentView').css("display","block");
            });
        }
    });
    
    $(document).on('click','#quitDialogRentView',function(){
    	$('#selectedRentVehiclesTable').html(`<tr><th>Brand</th><th>Model</th><th>Type</th><th>Grade</th><th>Full price</th><th>Select</th></tr>`);
        $('#dialogRentView').css("display","none");
	});
	
	$(document).on('click','#makeHotelReservationBtn',function(){
		selected_rooms = [];
		selected_hotel_services = [];
        for(var i=0;i<all_rooms.length;i++){
			var red = all_rooms[i];
			if($('#roomCheckbox'+ red.id).prop('checked')){
				delete red.hotel.hibernateLazyInitializer;
				delete red.hotel.destination.hibernateLazyInitializer;
				selected_rooms.push(red);
			}
		}
		for(var i=0;i<all_hotel_services.length;i++){
			var red = all_hotel_services[i];
			if($('#hotelServiceCheckbox'+ red.id).prop('checked')){
				delete red.hotel.hibernateLazyInitializer;
				delete red.hotel.destination.hibernateLazyInitializer;
				selected_hotel_services.push(red);
			}
		}
		var start = stringToDate($('#roomSearchArrivalDate').val());
		var end = start + ($('#roomSearchDayNumber').val() - 1)*24*60*60*1000;	
		console.log("Selected rooms: ", selected_rooms);
		console.log("Selected hotel services: ", selected_hotel_services);
		if(selected_rooms.length == 0){
			showMessage("Select at least 1 room!", "orange");
			return;
		}
		var price = calculatePrice(selected_rooms, selected_hotel_services, $('#roomSearchDayNumber').val());
		var reservation = {
			"start": new Date(start),
			"end": new Date(end),
			"rooms": selected_rooms,
			"services": selected_hotel_services,
			"hotel": selected_rooms[0].hotel,
			"price": price
		};
		console.log("Hotel reservation: ", reservation);
		$.ajax({
			type : 'POST',
			url : "/api/roomReservations",
			headers: createAuthorizationTokenHeader(),
			data : JSON.stringify(reservation),
			success: function(){
				$(location).attr('href',"/");
				showMessage('Room reservation successful!', "green");
			},
			error: function (jqXHR, exception) {
				if (jqXHR.status == 401) {
					showMessage('Login first!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  " + exception, "red");
				}
			}
		})
	});
	
	
    
    //--------------- RADOJCIN ---------------
    
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
					var departureDate = $("<td>" + formatDateDet(new Date(flight.departureDate)) + "</td>");
					var arrivalDate = $("<td>" + formatDateDet(new Date(flight.arrivalDate)) + "</td>");
					var luggageQuantity = $("<td>" + flight.luggageQuantity + "</td>");
					var ticketPriceFirstClass = $("<td>" + flight.ticketPriceFirstClass + "</td>");
					var ticketPriceBusinessClass = $("<td>" + flight.ticketPriceBusinessClass + "</td>");
					var ticketPriceEconomyClass = $("<td>" + flight.ticketPriceEconomyClass + "</td>");
					var actions = $("<td><input type='button' class='edit' value='Edit seats'></td>");
					
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
	
	function formatDateDet(date) {
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
	$(document).on("click", "span.close", function() {
		$("div#seatsTableDiv").empty();
		previousSeat = undefined;
		$("input#toggleSeat").attr("disabled", "disabled");
		$("input#deleteSeat").attr("disabled", "disabled");
		$("div#editSeatsModal").hide();
		
		//---------------- REZERVACIJA ----------------
		
		$("div#seatsDiv").empty();
		$("div#extraServicesDiv").empty();
		selectedSeats = [];
		$("input#makeFlightReservation").attr("disabled", "disabled");
		$("div#reservationSeatsModal").hide();
	});
	
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
    
	getAirports(1);
    
    function getAirports(index) {
    	$.ajax({
    		type: "GET",
    		url: "/airport/all",
    		success: function(data) {
    			var fromSelect = $("select#from" + index);
    			var toSelect = $("select#to" + index);
    			
    			$.each(data, function(index, airport) {
    	    		var fromOption = $("<option id='" + airport.id + "'>" + airport.name + " - " + airport.destination.name + ", " + airport.destination.country + "</option>")
    	    		var toOption = $("<option id='" + airport.id + "'>" + airport.name + " - " + airport.destination.name + ", " + airport.destination.country + "</option>")
    	    		
    	    		fromSelect.append(fromOption);
    	    		toSelect.append(toOption);
    	    	});
    		}
    	});
    }
    
    var flightIndex = 2;
    var flightRows = [];
    $("select#tripType").change(function() {
    	var selected = $(this).find("option:selected").text();
    	
    	if(selected == "Round trip") {
    		$("td#addFlightTD").remove();
    		
    		flightRows.forEach(function(index) {
    			$("#searchFlightsForm table tr#" + index).remove();
    		});
    		flightRows = [];
    		flightIndex = 2;
    		
    		var returnDate = $("<td id='returnDateTD'>Return date <input type='date' id='returnDate1' title='Return date'></td>");
    		var tr = $("#searchFlightsForm table tr#1");
    		
    		tr.append(returnDate);
    	} else if(selected == "One-way") {
    		$("td#returnDateTD").remove();
    		$("td#addFlightTD").remove();
    		
    		flightRows.forEach(function(index) {
    			$("#searchFlightsForm table tr#" + index).remove();
    		});
    		flightRows = [];
    		flightIndex = 2;
    	} else {
    		$("td#returnDateTD").remove();
    		
    		var button = $("<td id='addFlightTD'><input type='button' id='addFlight' value='Add Flight'></td>");
    		
    		$("#searchFlightsForm table tr:last").prepend(button);
    	}
    });
    
    $(document).on("click", "input#addFlight", function() {
    	var tr = $("<tr id='" + flightIndex + "'> <td>From <select id='from" + flightIndex + "' class='from' title='Where from?'></select></td> <td>To <select id='to" + flightIndex + "' class='to' title='Where to?'></select></td> <td>Departure date <input type='date' id='departureDate" + flightIndex + "' title='Departure date'></td></tr>");
    	
    	$("#searchFlightsForm table tr:last").before(tr);
    	
    	getAirports(flightIndex);
    	flightRows.push(flightIndex);
    	flightIndex += 1;
    });
    
    $(document).on("change", "select.from", function() {
    	$(this).parent().parent().prev().find("select.to").val($(this).find(":selected").text());
    });
    
    $(document).on("change", "select.to", function() {
    	$(this).parent().parent().next().find("select.from").val($(this).find(":selected").text());
    });
    
    $("form#searchFlightsForm").submit(function(e) {
    	e.preventDefault();
    	
    	var tripType = $("select#tripType").find(":selected").text();
    	var passengers = $("input#passengers").val();
    	var seatClass = $("select#seatClass").find(":selected").text();
    	var bags = $("input#bags").val();
    	
    	if(passengers == "" || bags == "") {
    		showMessage("Some fields are empty!", "red");
			return;
    	}
    	
    	data = [];
    	
    	var from1 = $("select#from1").find(":selected");
		var to1 = $("select#to1").find(":selected");
		var departureDate1 = $("input#departureDate1").val();
		var returnDate1 = $("input#returnDate1").val();
		
		if(from1.text() == to1.text()) {
    		showMessage("Destination can't be the same as starting point!", "red");
    		return;
    	} else if(departureDate1 - new Date() < 0) {
    		showMessage("The departure date can't be before current date!", "red");
			return;
    	} else if(tripType == "Round trip" && returnDate1 - departureDate1 < 0) {
    		showMessage("The return date can't be before departure date!", "red");
    		return;
    	}
		
		data.push({
			"from": {
				"id": parseInt(from1.attr("id"))
			},
			"to": {
				"id": parseInt(to1.attr("id"))
			},
			"departureDate": new Date(departureDate1),
			"returnDate": (tripType == "Round trip" ? new Date(returnDate1) : null)
		});
    	
    	flightRows.forEach(function(index) {
    		var from = $("select#from" + index).find(":selected");
    		var to = $("select#to" + index).find(":selected");
    		var departureDate = $("input#departureDate" + index).val();
    		
    		if(from.text() == to.text()) {
        		showMessage("Destination can't be the same as starting point!", "red");
        		return;
        	} else if(departureDate - new Date() < 0) {
        		showMessage("The departure date can't be before current date!", "red");
    			return;
        	} else if(tripType == "Round trip" && returnDate - departureDate < 0) {
        		showMessage("The return date can't be before departure date!", "red");
        		return;
        	}
    		
    		data.push({
    			"from": {
    				"id": parseInt(from.attr("id"))
    			},
    			"to": {
    				"id": parseInt(to.attr("id"))
    			},
    			"departureDate": new Date(departureDate),
    			"returnDate": null
    		});
    	});
    	
    	var search = {
    		"tripType": tripType,
    		"passengers": parseInt(passengers),
    		"seatClass": seatClass,
    		"bags": parseInt(bags),
    		"data": data
    	}
    	
    	console.log(search);
    	
    	$.ajax({
    		type: "POST",
    		url: "/flight/search",
    		contentType: "application/json",
    		data: JSON.stringify(search),
    		dataType: "json",
    		success: function(data) {
    			$("table.searchResultTable").remove();
    			
    			$.each(data, function(index, result) {
    				if(result.length > 0) {
    					var table = $("<table class='searchResultTable'></table>");
            			var caption = $("<caption style='color: white;'></caption>")
            			var thead = $("<thead><tr><th>Times</th> <th>Travel time</th> <th>Stops</th> <th>Airline</th> <th>First class price</th> <th>Business class price</th> <th>Economy class price</th> <th>Action</th></tr></thead>");
            			var tbody = $("<tbody></tbody>");
    					
            			if(result.length == 0) {
            				$("table.searchResultTable").remove();
            				
            				return;
            			}
    					$.each(result, function(index, flight) {
    						caption.text(flight.from.name + " - " + flight.to.name);
    						
    						var times = $("<td>" + (new Date(flight.departureDate).getHours() < 9 ? "0" : "") + new Date(flight.departureDate).getHours() + ":"+ (new Date(flight.departureDate).getMinutes() < 9 ? "0" : "") + new Date(flight.departureDate).getMinutes() + " - "+ (new Date(flight.arrivalDate).getHours() < 9 ? "0" : "") + new Date(flight.arrivalDate).getHours() + ":"+ (new Date(flight.arrivalDate).getMinutes() < 9 ? "0" : "") + new Date(flight.arrivalDate).getMinutes() + "</td>");
    	    				var travelTime = $("<td>" + flight.flightDuration + "</td>");
    	    				var stops = $("<td>" + flight.stops.length + "</td>");
    	    				var airline = $("<td>" + flight.airline.name + "</td>");
    	    				var ticketPriceFirstClass = $("<td>" + flight.ticketPriceFirstClass + "</td>");
    						var ticketPriceBusinessClass = $("<td>" + flight.ticketPriceBusinessClass + "</td>");
    						var ticketPriceEconomyClass = $("<td>" + flight.ticketPriceEconomyClass + "</td>");
    	    				var action = $("<td><input type='button' value='Select flight' class='select'></td>");
    	    				
    	    				var tr = $("<tr id='" + flight.id + "'></tr>");
    	    				
    	    				tr.append(times);
    	    				tr.append(travelTime);
    	    				tr.append(stops);
    	    				tr.append(airline);
    	    				tr.append(ticketPriceFirstClass);
    						tr.append(ticketPriceBusinessClass);
    						tr.append(ticketPriceEconomyClass);
    	    				tr.append(action);
    	    				
    	    				tbody.append(tr);
    					});
    					
    					table.append(caption);
    					table.append(thead);
    					table.append(tbody);
    					
    					$("div#searchFlightsDiv div#reservationSeatsModal").before(table);
    				}
    			});
    		},
    		error: function(xhr) {
    			$("table.searchResultTable").remove();
    		}
    	});
    });
    
    var selectedFlight;
    $(document).on("click", "input.select", function() {
    	var seatsDiv = $("div#seatsDiv"); //var seatsDiv = $("<div id='seatsDiv' style='text-align: center; height: " + ((data.length / 3) * 55) + "px;'></div>");
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
					$("input#makeFlightReservation").attr("disabled", "disabled");
				}
				else if(selectedSeats.length < 2) {
					$("button#inviteFriendsTab").attr("disabled", "disabled");
					$("button#otherPassengersTab").attr("disabled", "disabled");
				}
				
				break;
			}
		}
		
		if(!exists) {
			selectedSeats.push(parseInt(seatId));
			$(this).css("border", "2px solid red");
			
			$("input#makeFlightReservation").removeAttr("disabled");
			if(selectedSeats.length > 1) {
				$("button#inviteFriendsTab").removeAttr("disabled");
				$("button#otherPassengersTab").removeAttr("disabled");
			}
		}
	});
	
	$("input#makeFlightReservation").click(function() {
		$.ajax({
			type: "GET",
			url: "/flight/" + selectedFlight,
			headers: createAuthorizationTokenHeader(),
			success: function(flight) {
				var tickets = [];
				console.log(selectedSeats);
				$.ajax({
					type: "POST",
					url: "/seats/getSelectedSeats",
					headers: createAuthorizationTokenHeader(),
					data: JSON.stringify(selectedSeats),
					success: function(seats) {
						seats.forEach(function(entry) {
							var ticket = {
								"seat": entry,
								"passportNumber": "0123456789"
							};
							
							tickets.push(ticket);
						});
						
						var reservation = {
								"flight": flight,
								"tickets": tickets,
								"dateOfPurchase": new Date()
							};
						
						console.log(reservation);
						
						$.ajax({
							type: "POST",
							url: "/api/flightReservation/save",
							headers: createAuthorizationTokenHeader(),
				    		data: JSON.stringify(reservation),
				    		success: function(data) {
				    			showMessage(data, "green");
				    			
				    			selectedSeats.forEach(function(entry) {
				    				$("div.seatDivForReservation#" + entry).css("background-color", "red");
				    				$("div.seatDivForReservation#" + entry).css("border", "0");
				    			});
				    			
				    			selectedSeats = [];
				    			$("input#makeFlightReservation").attr("disabled", "disabled");
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
	
	/*$(document).on("click", "span.close", function() {
		$("div#seatsDiv").empty();
		selectedSeats = [];
		$("div#reservationSeatsModal").hide();
	});*/
    
    //----------------------------------------
});

var renderHotelServiceTable = function(hotelId){
    $.get('/api/hotelServicesSearch/'+hotelId, function(servicesData){
        console.log("Hotel Services: ", servicesData);
		var services = servicesData;
		all_hotel_services = services;
        $('#selectedHotelServicesTable').html(`<tr><th>Name</th><th>Price</th><th>Select</th></tr>`);
        for(var i=0;i<services.length;i++){
            var red = services[i];
            checkBoxID = "hotelServiceCheckbox"+ red.id;
            $('#selectedHotelServicesTable tr:last').after(`<tr><td>${red.name}</td><td>${red.price}</td><td><input type="checkbox" id=${checkBoxID}></td></tr>`);
        }
        $('#dialogHotelView').css("display","block");
    });
}

var renderRoomTable = function(hotelId, arrivalDate, departureDate, TwoBedRooms, ThreeBedRooms, FourBedRooms, numDays){
    var text = `/${hotelId}/${arrivalDate}/${departureDate}/${TwoBedRooms}/${ThreeBedRooms}/${FourBedRooms}`;
    console.log(text);
    $.get('/api/roomsSearch'+text, function(RoomData){
            console.log("Rooms: ", RoomData);
			var rooms = RoomData;
			all_rooms = rooms;
            $('#selectedHotelRoomsTable').html(`<tr><th>Floor number</th><th>Number of beds</th><th>Grade</th><th>Full price</th><th>Select</th></tr>`);
            for(var i=0;i<rooms.length;i++){
                var red = rooms[i];
                checkBoxID = "roomCheckbox"+ red.id;
                $('#selectedHotelRoomsTable tr:last').after(`<tr><td>${red.floor}</td><td>${red.bedNumber}</td><td>-</td><td>${red.price*numDays}</td><td>
                <input type="checkbox" id=${checkBoxID}></td></tr>`);
            }
        });
}

var renderAirlineTable = function(){
    $('#airlineTable').html(`<tr><th>Name</th><th>Description</th></tr>`);
    $.get("/api/airlines", function(data){
        console.log("ssAirlines: ", data);
        for(var i=0;i<data.length;i++){
            var red = data[i];
            $('#airlineTable tr:last').after(`<tr><td>${red.name}</td><td>${red.description}</td></tr>`);
        }
    });
}

var renderAirlineTableSearch = function(){
    var text = $('#airlineSearchInput').val();
    if(text == ""){
        renderAirlineTable();
        return;
    }
    $('#airlineTable').html(`<tr><th>Name</th><th>Description</th></tr>`);
    $.get('/api/airlinesSearch/'+text, function(data){
        console.log("Airlines: ", data);
        for(var i=0;i<data.length;i++){
            var red = data[i];
            $('#airlineTable tr:last').after(`<tr><td>${red.name}</td><td>${red.description}</td></tr>`);
        }
    }); 
}

var renderHotelTable = function(){
	$('#hotelTable').html(`<tr><th>Name</th><th>Destination</th><th>Grade</th><th></th></tr>`);
    $.get("/api/hotels", function(data){
        console.log("Hotels: ", data);
        for(var i=0;i<data.length;i++){
            var red = data[i];
            var btnID = "hotelDetailViewBtn" + red.id;
            $('#hotelTable tr:last').after(`<tr><td>${red.name}</td><td>${red.destination.name}</td><td> - </td><td><button id=${btnID}>More details</button></td></tr>`);
        }
    });
}

var renderHotelTableSearch = function(){
    var hotelName = $('#hotelNameSearchInput').val();
    var hotelDestination = $('#hotelDestinationSearchInput').val();
    var checkIn = $('#hotelSearchCheckIn').val();
    var checkOut = $('#hotelSearchCheckOut').val();	

    if(hotelName == ""){
        hotelName = "NO_INPUT";
    }
    if(hotelDestination == ""){
        hotelDestination = "NO_INPUT";
    }
    if(checkIn == "" && checkOut == ""){
		checkIn = "NO_INPUT";
		checkOut = "NO_INPUT";
	}else if(checkIn != "" && checkOut == ""){
		showMessage("Fill check-out field!", "orange");
		return;
	}else if(checkIn == "" && checkOut != ""){
		showMessage("Fill check-in field!", "orange");
		return;
	}else {
		var checkInTS = stringToDate(checkIn);
		var checkOutTS = stringToDate(checkOut);
		if(checkInTS >= checkOutTS){
			showMessage("Check-in must be before Check-out", "orange");
			return;
		}
	}
    var checkInTS = stringToDate(checkIn);
	var checkOutTS = stringToDate(checkOut);
	if(checkIn == "NO_INPUT"){
		checkInTS = 0;
	}
	if(checkOut == "NO_INPUT"){
		checkOutTS = 0;
	}
	text = hotelName+"/"+hotelDestination+"/"+checkInTS+"/"+checkOutTS;
	console.log('/api/hotelsSearch/'+text);
    $('#hotelTable').html(`<tr><th>Name</th><th>Destination</th><th>Grade</th><th></th></tr>`);
    $.get('/api/hotelsSearch/'+text, function(data){
        console.log("Hotels: ", data);
        for(var i=0;i<data.length;i++){
            var red = data[i];
            var btnID = "hotelDetailViewBtn" + red.id;
            $('#hotelTable tr:last').after(`<tr><td>${red.name}</td><td>${red.destination.name}</td><td>-</td><td><button id=${btnID}>More details</button></td></tr>`);
        }
    });
}

var renderRentACarTable = function(){
    $('#rentACarTable').html(`<tr><th>Name</th><th>Description</th><th>Grade</th><th></th></tr>`);
    $.get("/api/rentacars", function(data){
        console.log("Rent-a-cars: ", data);
        for(var i=0;i<data.length;i++){
            var red = data[i];
            var btnID = "rentDetailViewBtn" + red.id;
            $('#rentACarTable tr:last').after(`<tr><td>${red.name}</td><td>${red.destination.name}</td><td>-</td><td><button id=${btnID}>More details</button></td></tr>`);        }
    });
}

var renderRentACarTableSearch = function(){
	var rentName = $('#rentNameSearchInput').val();
    var rentDestination = $('#rentDestinationSearchInput').val();
    var checkIn = $('#rentSearchCheckIn').val();
    var checkOut = $('#rentSearchCheckOut').val();
    console.log(checkIn, checkOut);
    if(rentName == ""){
        rentName = "NO_INPUT";
    }
    if(rentDestination == ""){
        rentDestination = "NO_INPUT";
    }
    if(checkIn == ""){
        checkIn = "NO_INPUT";
    }
    if(checkOut == ""){
        checkOut = "NO_INPUT";
    }
    text = rentName+"/"+rentDestination+"/"+checkIn+"/"+checkOut;
    $('#rentACarTable').html(`<tr><th>Name</th><th>Destination</th><th>Grade</th><th></th></tr>`);
    $.get('/api/rentsSearch/'+text, function(data){
        console.log("Rent-a-cars: ", data);
        for(var i=0;i<data.length;i++){
            var red = data[i];
            var btnID = "rentDetailViewBtn" + red.id;
            $('#rentACarTable tr:last').after(`<tr><td>${red.name}</td><td>${red.destination.name}</td><td>-</td><td><button id=${btnID}>More details</button></td></tr>`);      
        }
    }); 
}

var renderVehicleTable = function(rentId, arrivalDate, numDays, cars, motocycles){
    var text = `/${rentId}/${arrivalDate}/${numDays}/${cars}/${motocycles}`;
    console.log(text);
    $.get('/api/vehiclesSearch'+text, function(VehicleData){
            console.log("Vehicles: ", VehicleData);
            var vehicles = VehicleData;
        	$('#selectedRentVehiclesTable').html(`<tr><th>Brand</th><th>Model</th><th>Type</th><th>Grade</th><th>Full price</th><th>Select</th></tr>`);
            for(var i=0;i<vehicles.length;i++){
                var red = vehicles[i];
                checkBoxID = "vehicleCheckbox"+ red.id;
                $('#selectedRentVehiclesTable tr:last').after(`<tr><td>${red.brand}</td><td>${red.model}</td><td>${red.type}</td><td>-</td><td>${red.price*numDays}</td><td>
                <input type="checkbox" id=${checkBoxID}></td></tr>`);
            }
        });
}

var renderQuickRoomReservations = function(reservations){
	$('#quickRoomReservationsTable').html(`<tr><th>Arrival Date</th><th>Departure Date</th><th>2 bed rooms</th><th>3 bed rooms</th><th>4 bed rooms</th><th>Price</th><th></th></tr>`);
    for(var i=0;i<reservations.length;i++){
        var red = reservations[i];
        var bed2 = 0;
        var bed3 = 0;
        var bed4 = 0;
        for(var k=0;k<red.rooms.length;k++){
        	var miniRed = red.rooms[k];
        	if(miniRed.bedNumber == 2){
        		bed2 ++;
        	}else if(miniRed.bedNumber == 3){
        		bed3 ++;
        	}else if(miniRed.bedNumber == 4){
        		bed4 ++;
        	}
        }
        console.log(bed2, bed3, bed4);
        buttonID = "quickRoomReservationNumber"+ red.id;
        console.log("-->", red);
        $('#quickRoomReservationsTable tr:last').after(`<tr><td>${displayDateFormat(red.start)}</td><td>${displayDateFormat(red.end)}</td><td>${bed2}</td><td>${bed3}</td><td>${bed4}</td><td>${red.price}</td>
        <td><button id=${buttonID}>Reserve</button></td></tr>`);
    }
};

function formatDate(date) {
    month = '' + (date.getMonth() + 1);
    day = '' + date.getDate();
    year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
	return [year, month, day].join('-');

}


function stringToDate(displayFormat){
	myDate=displayFormat.split("-");
	var newDate = myDate[1]+"/"+myDate[2]+"/"+myDate[0];
	console.log(newDate);
	return new Date(newDate).getTime();
}

function displayDateFormat(date){
	myDate=date.split("-");
	return [myDate[2], myDate[1], myDate[0]].join('/');
}


function openTab(evt, tabName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";
}

function calculatePrice(rooms, services, days){
	price = 0;
	for(var i=0;i<rooms.length;i++){
		price += (days * rooms[i].price);
	}
	for(var i=0;i<services.length;i++){
		price += services[i].price;
	}

	return price;
}