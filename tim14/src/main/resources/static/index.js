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
        var arrivalDate = $('#roomSearchArrivalDate').val();
        var numDays = $('#roomSearchDayNumber').val();
        var TwoBedRooms = $('#roomSearch2Bed').prop('checked');
        var ThreeBedRooms = $('#roomSearch3Bed').prop('checked');
        var FourBedRooms = $('#roomSearch4Bed').prop('checked');
        console.log('Hotel id: ', hotelId ,'....', arrivalDate, numDays, TwoBedRooms, ThreeBedRooms, FourBedRooms);

        renderRoomTable(hotelId, arrivalDate, numDays, TwoBedRooms, ThreeBedRooms, FourBedRooms);
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
                renderHotelServiceTable(message);
            });
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
					var tripType = $("<td>" + (flight.flightType == "ONE_WAY" ? "One way" : "Round trip") + "</td>");
					var from = $("<td>" + flight.from.name + " - " + flight.from.destination.name + ", " + flight.from.destination.country + "</td>");
					var to = $("<td>" + flight.to.name + " - " + flight.to.destination.name + ", " + flight.to.destination.country + "</td>");
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
	
	$("input.edit").on("click", function() {
		var seatsTableDiv = $("div#seatsTableDiv");
		var flightID = $(this).parent().parent().find("input[type='hidden']").attr("value");
		
		$.ajax({
			type: "GET",
			url: "/flight/" + flightID + "/seats",
			contentType: "text/html; charset=utf-8",
			dataType: "json",
			success: function(data) {
				
				seatsTableDiv.css("height", ((data.length / 3) * 55) + "px");
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
					
					var seatDiv = $("<div style='background-color: " + bgcolor + ";' class='seatDiv'><input type='hidden' value='" + seat.id + "'></div>");
					
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
		$("input#toggleSeat").prop("disabled", true);
		$("input#deleteSeat").prop("disabled", true);
		$("div#editSeatsModal").hide();
	});
	
	$(document).on("click", "div.seatDiv", function() {
		if($(this).css("background-color") == "rgb(255, 0, 0)")
			return;
		
		if(previousSeat != undefined) {
			previousSeat.css("border", "0");
		}
		$(this).css("border", "2px solid red");
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
	
	getAirports();
    
    function getAirports() {
    	$.ajax({
    		type: "GET",
    		url: "/airport/all",
    		success: function(data) {
    			var fromSelect = $("select#from");
    			var toSelect = $("select#to");
    			
    			$.each(data, function(index, airport) {
    	    		var fromOption = $("<option id='" + airport.id + "'>" + airport.name + " - " + airport.destination.name + ", " + airport.destination.country + "</option>")
    	    		var toOption = $("<option id='" + airport.id + "'>" + airport.name + " - " + airport.destination.name + ", " + airport.destination.country + "</option>")
    	    		
    	    		fromSelect.append(fromOption);
    	    		toSelect.append(toOption);
    	    	});
    		}
    	});
    }
    
    $("select#tripType").change(function() {
    	var selected = $(this).find("option:selected").text();
    	
    	if(selected == "Round trip") {
    		var returnDate = $("<td id='returnDateTD'>Return date <input type='date' id='returnDate' title='Return date'></td>");
    		var tr = $("#searchFlightsForm table tr#1");
    		
    		tr.append(returnDate);
    	} else if(selected == "One-way") {
    		$("td#returnDateTD").remove();
    	}
    });
    
    $("form#searchFlightsForm").submit(function(e) {
    	e.preventDefault();
    	
    	var tripType = $("select#tripType").find(":selected").text();
    	var passengers = $("input#passengers").val();
    	var seatClass = $("select#seatClass").find(":selected").text();
    	var bags = $("input#bags").val();
    	var from = $("select#from").find(":selected");
    	var to = $("select#to").find(":selected");
    	var departureDate = new Date($("input#departureDate").val());
    	var returnDate = new Date($("input#returnDate").val());
    	
    	if(passengers == "" || bags == "" || departureDate == "" || (tripType == "Round trip" && returnDate == "")) {
    		showMessage("Some fields are empty!", "red");
			return;
    	} else if(from.text() == to.text()) {
    		showMessage("Destination can't be the same as starting point!", "red");
    		return;
    	} else if(departureDate - new Date() < 0) {
    		showMessage("The departure date can't be before current date!", "red");
			return;
    	} else if(tripType == "Round trip" && returnDate - departureDate < 0) {
    		showMessage("The return date can't be before departure date!", "red");
    		return;
    	}
    	
    	var search = {
    		"tripType": tripType,
    		"passengers": parseInt(passengers),
    		"seatClass": seatClass,
    		"bags": parseInt(bags),
    		"from": {
    			"id": parseInt(from.attr("id"))
    		},
    		"to": {
    			"id": parseInt(to.attr("id"))
    		},
    		"departureDate": departureDate,
    		"returnDate": (tripType == "Round trip" ? returnDate : null)
    	}
    	
    	$.ajax({
    		type: "POST",
    		url: "/flight/search",
    		contentType: "application/json",
    		data: JSON.stringify(search),
    		dataType: "json",
    		success: function(data) {
    			var table = $("table#searchResultTable tbody");
    			
    			table.empty();
    			
    			$.each(data, function(index, flight) {
    				
    				var departureDate = new Date(flight.departureDate);
    				var arrivalDate = new Date(flight.arrivalDate);
    				
    				var times = $("<td>" + departureDate.getHours() + ":" + departureDate.getMinutes() + " - " + arrivalDate.getHours() + ":" + arrivalDate.getMinutes() + "</td>")
    				var travelTime = $("<td>" + flight.flightDuration + "</td>");
    				var stops = $("<td>" + flight.stops.length + "</td>");
    				var airline = $("<td>" + flight.airline.name + "</td>");
    				var price = $("<td>" + flight.ticketPrice + "</td>");
    				var action = $("<td><input type='button' value='Select flight' class='select'></td>");
    				
    				var tr = $("<tr id='" + flight.id + "'></tr>");
    				
    				tr.append(times);
    				tr.append(travelTime);
    				tr.append(stops);
    				tr.append(airline);
    				tr.append(price);
    				tr.append(action);
    				
    				table.append(tr);
    			});
    		},
    		error: function(xhr) {
    			table.empty();
    		}
    	});
    });
    
    /*$(document).on("click", "input.select", function() {
    	var seatsDiv = $("div#seatsDiv"); //var seatsDiv = $("<div id='seatsDiv' style='text-align: center; height: " + ((data.length / 3) * 55) + "px;'></div>");
    	seatsDiv.empty();
    	
    	var flightID = $(this).parent().parent().attr("id");
    	
    	$.ajax({
			type: "GET",
			url: "/flight/" + flightID + "/seats",
			contentType: "text/html; charset=utf-8",
			dataType: "json",
			success: function(data) {
				seatsDiv.css("height", ((data.length / 3) * 55) + "px");
				
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
					
					var seatDiv = $("<div style='background-color: " + bgcolor + ";' class='seatDivForReservation'><input type='hidden' value='" + seat.id + "'></div>");
					
					if(index % 3 == 0)
						seatDiv.css("clear", "left");
					
					seatsDiv.append(seatDiv);
				});
				
				
				
				$("div#reservationSeatsModal").show();
			}
		});
    });*/
    
    var selectedSeats = [];
	$(document).on("click", "div.seatDivForReservation", function() {
		if($(this).css("background-color") == "rgb(58, 58, 58)" || $(this).css("background-color") == "rgb(255, 0, 0)")
			return;
		
		var seatId = $($(this).children("input")[0]).attr("value");
		
		var exists = false;
		for(var i = 0; i < selectedSeats.length; i++) {
			if(selectedSeats[i].id == seatId) {
				selectedSeats.splice(i, 1);
				$(this).css("border", "0");
				
				exists = true;
				if(selectedSeats.length == 0)
					$("input#next").prop("disabled", true);
				
				break;
			}
		}
		
		if(!exists) {
			selectedSeats.push({
				"id": seatId
			});
			$(this).css("border", "3px solid red");
			
			$("input#next").prop("disabled", false);
		}
	});
	
	$(document).on("click", "input#close", function() {
		$("div#seatsDiv").empty();
		selectedSeats = [];
	});
	
	var previous
	$(document).on("click", "input#next", function() {
		
	});
    
    //----------------------------------------
});

var renderHotelServiceTable = function(hotelId){
    $.get('/api/hotelServicesSearch/'+hotelId, function(servicesData){
        console.log("Hotel Services: ", servicesData);
        var services = servicesData;
        $('#selectedHotelServicesTable').html(`<tr><th>Name</th><th>Price</th><th>Select</th></tr>`);
        for(var i=0;i<services.length;i++){
            var red = services[i];
            checkBoxID = "hotelServiceCheckbox"+ red.id;
            $('#selectedHotelServicesTable tr:last').after(`<tr><td>${red.name}</td><td>${red.price}</td><td><input type="checkbox" id=${checkBoxID}></td></tr>`);
        }
        $('#dialogHotelView').css("display","block");
    });
}

var renderRoomTable = function(hotelId, arrivalDate, numDays, TwoBedRooms, ThreeBedRooms, FourBedRooms){
    var text = `/${hotelId}/${arrivalDate}/${numDays}/${TwoBedRooms}/${ThreeBedRooms}/${FourBedRooms}`;
    console.log(text);
    $.get('/api/roomsSearch'+text, function(RoomData){
            console.log("Rooms: ", RoomData);
            var rooms = RoomData;
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
    
    console.log(checkIn, checkOut);
    if(hotelName == ""){
        hotelName = "NO_INPUT";
    }
    if(hotelDestination == ""){
        hotelDestination = "NO_INPUT";
    }
    if(checkIn == ""){
        checkIn = "NO_INPUT";
    }
    if(checkOut == ""){
        checkOut = "NO_INPUT";
    }
    text = hotelName+"/"+hotelDestination+"/"+checkIn+"/"+checkOut;
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

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
