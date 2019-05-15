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
    	console.log("SDASD");
        $(location).attr('href',"/registration.html");
    });
    
    $(document).on('click','#addRoomBtn',function(){
        $(location).attr('href',"/room.html");
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
    
    
    $(document).on('click','#quitDialogHotelView',function(){
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
				/*var table = $("<table id='seats' border='5px solid gray' width='100%' height='500px'></table>");
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
				
				seatsTableDiv.append(table);
				$("div.modal").show();*/
				
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
    $('#rentACarTable').html(`<tr><th>Name</th><th>Description</th></tr>`);
    $.get("/api/rentacars", function(data){
        console.log("Rent-a-cars: ", data);
        for(var i=0;i<data.length;i++){
            var red = data[i];
            $('#rentACarTable tr:last').after(`<tr><td>${red.name}</td><td>${red.description}</td></tr>`);
        }
    });
}

var renderRentACarTableSearch = function(){
    var text = $('#rentSearchInput').val();
    if(text == ""){
        renderRentACarTable();
        return;
    }
    $('#rentACarTable').html(`<tr><th>Name</th><th>Description</th></tr>`);
    $.get('/api/rentsSearch/'+text, function(data){
        console.log("Rent-a-cars: ", data);
        for(var i=0;i<data.length;i++){
            var red = data[i];
            $('#rentACarTable tr:last').after(`<tr><td>${red.name}</td><td>${red.description}</td></tr>`);
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
