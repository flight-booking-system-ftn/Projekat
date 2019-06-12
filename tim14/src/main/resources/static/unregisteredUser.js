all_rooms = [];
selected_rooms = [];
all_hotel_services = [];
selected_hotel_services = [];

$(document).ready(function(){
    
    displayAirlines();
    $('#vehicleSearchDiv').css("display","none");
    $('#roomsSearchDiv').css("display","none");
    $('#flightSearchDiv').css("display","block");
    getAirports(1);
    $('#arrivalDateTRFullSearch').hide();
    
    $(document).on('click','#registrationBtn',function(){
        $(location).attr('href',"/registration.html");
    });
    
    $(document).on('click','#loginUserBtn',function(){
    	removeJwtToken();
        $(location).attr('href',"/login.html");
    });

    $(document).on('click','#showAirlinesBtn',function(){
        displayAirlines();
        $('#vehicleSearchDiv').css("display","none");
        $('#roomsSearchDiv').css("display","none");
        $('#flightSearchDiv').css("display","block");
        getAirports(1);
        $('#arrivalDateTRFullSearch').hide();
    });

    $(document).on('click','#showHotelsBtn',function(){
        displayHotels();
        $('#vehicleSearchDiv').css("display","none");
        $('#roomSearchArrivalDateFullSearch').val(formatDate(new Date()));
        $('#roomsSearchDiv').css("display","block");
        $('#flightSearchDiv').css("display","none");
    });

    $(document).on('click','#showRentsBtn',function(){
        displayRents();
        $('#vehicleSearchArrivalDateFullSearch').val(formatDate(new Date()));
        $('#vehicleSearchDiv').css("display","block");
        $('#roomsSearchDiv').css("display","none");
        $('#flightSearchDiv').css("display","none");
    });


    $(document).on('click','button',function(e){
        if(e.target.id.startsWith("hotelDetailsBtn")){
            var message = e.target.id.substr(15);
            $.get('/api/hotels/'+ message, function(data){
                console.log("Selected hotel: ", data);
                $('#hotelIdField').val(message);
                $('#pNameOfChosenHotel').text(data.name);
                $('#pDescriptionOfChosenHotel').text(data.description);
                $('#pDestinationOfChosenHotel').text(data.destination.name +
                    ", " + data.destination.country);
                $('#roomSearchArrivalDate').val(formatDate(new Date()));
                renderHotelServiceTable(message);
            });
        }else if(e.target.id.startsWith("rentDetailsBtn")){
            var message = e.target.id.substr(14);
            console.log("PORUKA JE ", message);
            $.get('/api/rentacars/'+ message, function(data){
                console.log("Selected rent: ", data);
                $('#rentIdField').val(message);
                $('#pNameOfChosenRent').text(data.name);
                $('#pDescriptionOfChosenRent').text(data.description);
                $('#pDestinationOfChosenRent').text(data.destination.name +
                    ", " + data.destination.country);
                $('#vehicleSearchArrivalDate').val(formatDate(new Date()));
                renderVehicleTable(`/${message}/78123947/3214/true/true/NO_INPUT`);
            });
        }
    });

    $(document).on('click','#roomSearchBtn', function(){
        var hotelId = $('#hotelIdField').val();
        var start = stringToDate($('#roomSearchArrivalDate').val());
		var end = start + $('#roomSearchDayNumber').val()*24*60*60*1000;
        var TwoBedRooms = $('#roomSearch2Bed').prop('checked');
        var ThreeBedRooms = $('#roomSearch3Bed').prop('checked');
        var FourBedRooms = $('#roomSearch4Bed').prop('checked');
        renderRoomTable(hotelId, start, end, TwoBedRooms, ThreeBedRooms, FourBedRooms, $('#roomSearchDayNumber').val());
    });

    $(document).on('click','#quitDialogHotelView',function(){
        $('#selectedHotelRoomsTable').html(`<tr><th>Floor number</th><th>Number of beds</th><th>Grade</th><th>Full price</th></tr>`);
        $('#dialogHotelView').css("display","none");
    });

    $(document).on('click','#quitDialogRentView',function(){
    	$('#selectedRentVehiclesTable').html(`<tr><th>Brand</th><th>Model</th><th>Type</th><th>Grade</th><th>Price</th></tr>`);
        $('#dialogRentView').css("display","none");
	});
    
    
    //vehicle search
    
    $(document).on('click','#vehicleSearchBtnFullSearch', function(){
    	
    	var destination = $('#vehicleSearchDestinationFullSearch').val();
    	if(destination == ""){
    		destination = "NO_INPUT";
    	}
    	
    	var rentName = $('#vehicleSearchRentNameFullSearch').val();
    	if(rentName == ""){
    		rentName = "NO_INPUT";
    	}
    	
        var start = stringToDate($('#vehicleSearchArrivalDateFullSearch').val());
        if(start == ""){
        	start = -1;
        }
        
		var end = start + $('#vehicleSearchDayNumberFullSearch').val()*24*60*60*1000;
		if(end == ""){
			end = -1;
		}
		if(start!=-1 && end!=-1 && start > end){
        	showMessage('Arrival date cannot be after departure date!', 'orange');
        	return;
		}
    	
        var name = $('#vehicleSearchNameFullSearch').val();
        if(name == ""){
        	name = "NO_INPUT";
        }
        var cars = $('#vehicleCarsFullSearch').prop('checked');
        var motocycles = $('#vehicleMotocyclesFullSearch').prop('checked');
        
        var minPrice = $('#vehicleMinimumPriceFullSearch').val();
        if(minPrice == ""){
        	minPrice = -1;
        }
        var maxPrice = $('#vehicleMaximumPriceFullSearch').val();
        if(maxPrice == ""){
        	maxPrice = 10000001;
        }
        if(minPrice > maxPrice){
        	showMessage('Minimum price cannot be greater than maximum price!', 'orange');
        }
	    renderVehicleTableMainView(rentName, destination, start, end, name, cars, motocycles, minPrice, maxPrice);
    });
    
    
    //rooms search
    
    $(document).on('click','#roomSearchBtnFullSearch', function(){
    	var destination = $('#roomSearchDestinationFullSearch').val();
    	if(destination == ""){
    		destination = "NO_INPUT";
    	}
    	
    	var hotelName = $('#roomSearchHotelNameFullSearch').val();
    	if(hotelName == ""){
    		hotelName = "NO_INPUT";
    	}
    	
        var start = stringToDate($('#roomSearchArrivalDateFullSearch').val());
        if(start == ""){
        	start = -1;
        }
        
		var end = start + $('#roomSearchDayNumberFullSearch').val()*24*60*60*1000;
		if(end == ""){
			end = -1;
		}
		if(start!=-1 && end!=-1 && start > end){
        	showMessage('Arrival date cannot be after departure date!', 'orange');
        	return;
		}
		
        var TwoBedRooms = $('#roomSearch2BedFullSearch').prop('checked');
        var ThreeBedRooms = $('#roomSearch3BedFullSearch').prop('checked');
        var FourBedRooms = $('#roomSearch4BedFullSearch').prop('checked');
        
        var minPrice = $('#roomMinimumPriceFullSearch').val();
        if(minPrice == ""){
        	minPrice = -1;
        }
        
        var maxPrice = $('#roomMaximumPriceFullSearch').val();
        if(maxPrice == ""){
        	maxPrice = 1000001;
        }
        if(minPrice!=-1 && maxPrice!=1000001 && minPrice > maxPrice){
        	showMessage('Minimum price cannot be greater than maximum price!', 'orange');
        }
        
        renderRoomTableMainView(hotelName, destination, start, end, TwoBedRooms, ThreeBedRooms, FourBedRooms, minPrice, maxPrice);
    });
    
    
    //flight search
    
    
    var flightIndex = 2;
    var flightRows = [];
    $("select#tripTypeFullSearch").change(function() {
    	var selected = $(this).find("option:selected").text();
    	
    	if(selected == "Round trip") {
    		 $('#arrivalDateTRFullSearch').css('display','display');
    		flightRows.forEach(function(index) {
    			$("#flightSearchDiv table tr#" + index).remove();
    		});
    		flightRows = [];
    		flightIndex = 2;
    		$('#arrivalDateTRFullSearch').show();
    		var returnDate = $("<td id='returnDateTD'>Return date <input type='date' id='returnDate1' title='Return date'></td>");
    		
    	} else if(selected == "One-way") {
    		$('#arrivalDateTRFullSearch').hide();
    		flightRows.forEach(function(index) {
    			$("#flightSearchDiv table tr#" + index).remove();
    		});
    		flightRows = [];
    		flightIndex = 2;
    	}
    });
    
    var selectedAirline;
    
      
    $(document).on('click', '#flightSearchBtnFullSearch', function() {
    	var tripType = $("select#tripTypeFullSearch").find(":selected").text();
    	var passengers = $("input#passengersNumFullSearch").val();
    	var seatClass = $("select#seatClassFullSearch").find(":selected").text();
    	var bags = $("input#bagsFullSearch").val();
    	
    	if(passengers == "" || bags == "") {
    		showMessage("Some fields are empty!", "red");
			return;
    	}
    	
    	data = [];
    	
    	var from1 = $("select#fromFullSearch1").find(":selected");
		var to1 = $("select#toFullSearch1").find(":selected");
		var departureDate1 = $("input#departureDateFullSearch1").val();
		var returnDate1 = $("input#returnDateFullSearch1").val();
		
		if(from1.text() == to1.text()) {
    		showMessage("Destination can't be the same as starting point!", "orange");
    		return;
    	} else if(departureDate1 - new Date() < 0) {
    		showMessage("The departure date can't be before current date!", "orange");
			return;
    	} else if(tripType == "Round trip" && returnDate1 - departureDate1 < 0) {
    		showMessage("The return date can't be before departure date!", "orange");
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
    		var from = $("select#fromFullSearch" + index).find(":selected");
    		var to = $("select#toFullSearch" + index).find(":selected");
    		var departureDate = $("input#departureDateFullSearch" + index).val();
    		
    		if(from.text() == to.text()) {
        		showMessage("Destination can't be the same as starting point!", "orange");
        		return;
        	} else if(departureDate - new Date() < 0) {
        		showMessage("The departure date can't be before current date!", "orange");
    			return;
        	} else if(tripType == "Round trip" && returnDate - departureDate < 0) {
        		showMessage("The return date can't be before departure date!", "orange");
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
            			var thead = $("<thead><tr><th>Times</th> <th>Travel time</th> <th>Stops</th> <th>Airline</th> <th>First class price</th> <th>Business class price</th> <th>Economy class price</th></tr></thead>");
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
    	    				
    	    				
    	    				var tr = $("<tr id='" + flight.id + "'></tr>");
    	    				
    	    				tr.append(times);
    	    				tr.append(travelTime);
    	    				tr.append(stops);
    	    				tr.append(airline);
    	    				tr.append(ticketPriceFirstClass);
    						tr.append(ticketPriceBusinessClass);
    						tr.append(ticketPriceEconomyClass);
    	    				
    	    				tbody.append(tr);
    					});
    					
    					table.append(caption);
    					table.append(thead);
    					table.append(tbody);
    					
    					$("div#flightSearchDiv").append(table);
    				}
    			});
    		},
    		error: function(xhr) {
    			$("table.searchResultTable").remove();
    		}
    	});
    });
});

var displayAirlines = function(){
    $.get("/api/airlines", function(airlines){
        console.log("Airlines: ", airlines);
        $('#serviceContainer').html('');
        for(var i=0;i<airlines.length;i++){
            var red = airlines[i];
            var locationID = "mapLocation" + red.id;
            $(`<div class='listItem'><div class="imagePreview"></div><div style="float: left; margin-left:15px;"><h2 style="margin-left:-15px;">${red.name}</h2><p>${red.destination.name},
            ${red.destination.country}</p><p>${red.description}</p><p>Grade of service</p><p>Destinations list</p></div><div class="mapButtonPreview">
            <button id=${locationID}>Show on map</button></div></div>`).appendTo("#serviceContainer");
        }
    });
}

var displayHotels = function(){
    $.get("/api/hotels", function(hotels){
        console.log("Hotels: ", hotels);
        $('#serviceContainer').html('');
        for(var i=0;i<hotels.length;i++){
            var red = hotels[i];
            var locationID = "mapLocation" + red.id;
            var detailViewButtonID = "hotelDetailsBtn" + red.id;
            $(`<div class='listItem'><div class="imagePreview"></div><div style="float: left; margin-left:15px;"><h2 style="margin-left:-15px;">${red.name}</h2><p>${red.destination.name},
            ${red.destination.country}</p><p>${red.description}</p><p>Grade of service</p></div><div class="mapButtonPreview">
            <button id=${locationID}>Show on map</button><button id=${detailViewButtonID}>More details</button></div></div>`).appendTo("#serviceContainer");
        }
    });
}

var renderHotelServiceTable = function(hotelId){
    $.get('/api/hotelServicesSearch/'+hotelId, function(servicesData){
        console.log("Hotel Services: ", servicesData);
		var services = servicesData;
        $('#selectedHotelServicesTable').html(`<tr><th>Name</th><th>Price</th></tr>`);
        for(var i=0;i<services.length;i++){
            var red = services[i];
            $('#selectedHotelServicesTable tr:last').after(`<tr><td>${red.name}</td><td>${red.price}</td></tr>`);
        }
        $('#dialogHotelView').css("display","block");
    });
}

var renderRoomTable = function(hotelId, arrivalDate, departureDate, TwoBedRooms, ThreeBedRooms, FourBedRooms, numDays){
    var text = `/${hotelId}/${arrivalDate}/${departureDate}/${TwoBedRooms}/${ThreeBedRooms}/${FourBedRooms}`;
    $.get('/api/roomsSearch'+text, function(RoomData){
		console.log("Rooms: ", RoomData);
		var rooms = RoomData;
		$('#selectedHotelRoomsTable').html(`<tr><th>Floor number</th><th>Number of beds</th><th>Grade</th><th>Full price</th></tr>`);
		for(var i=0;i<rooms.length;i++){
			var red = rooms[i];
			$('#selectedHotelRoomsTable tr:last').after(`<tr><td>${red.floor}</td><td>${red.bedNumber}</td><td>-</td><td>${red.price*numDays}</td></tr>`);
		}
	});
}

var renderRoomTableMainView = function(hotelName, destination, start, end, TwoBedRooms, ThreeBedRooms, FourBedRooms, minPrice, maxPrice){
    var text = `/${hotelName}/${destination}/${start}/${end}/${TwoBedRooms}/${ThreeBedRooms}/${FourBedRooms}/${minPrice}/${maxPrice}`;
    console.log('/api/allRoomsSearch' + text);
    $.get('/api/allRoomsSearch'+text, function(RoomData){
		console.log("Searched rooms: ", RoomData);
		var rooms = RoomData;
		$('#selectedHotelRoomsTableFullSearch').html(`<tr><td>Hotel</td><td>Destination</td><th>Floor number</th><th>Number of beds</th><th>Grade</th><th>Price</th></tr>`);
		for(var i=0;i<rooms.length;i++){
			var red = rooms[i];
			$('#selectedHotelRoomsTableFullSearch tr:last').after(`<tr><td>${red.hotel.name}</td><td>${red.hotel.destination.name}</td><td>${red.floor}</td><td>${red.bedNumber}</td><td>-</td><td>${red.price}</td></tr>`);
		}
	});
}

var displayRents = function(){
    $.get("/api/rentacars", function(rents){
        console.log("Rents: ", rents);
        $('#serviceContainer').html('');
        for(var i=0;i<rents.length;i++){
            var red = rents[i];
            var locationID = "mapLocation" + red.id;
            var detailViewButtonID = "rentDetailsBtn" + red.id;
            $(`<div class='listItem'><div class="imagePreview"></div><div style="float: left; margin-left:15px;"><h2 style="margin-left:-15px;">${red.name}</h2><p>${red.destination.name},
            ${red.destination.country}</p><p>${red.description}</p><p>Grade of service</p></div><div class="mapButtonPreview">
            <button id=${locationID}>Show on map</button><button id=${detailViewButtonID}>More details</button></div></div>`).appendTo("#serviceContainer");
        }
    });
}

var renderVehicleTable = function(text){
    $.get('/api/vehiclesSearch'+text, function(vehicles){
        console.log("Vehicles: ", vehicles);
        $('#selectedRentVehiclesTable').html(`<tr><th>Brand</th><th>Model</th><th>Type</th><th>Grade</th><th>Price</th></tr>`);
        for(var i=0;i<vehicles.length;i++){
            var red = vehicles[i];
            $('#selectedRentVehiclesTable tr:last').after(`<tr><td>${red.brand}</td><td>${red.model}</td><td>${red.type}</td><td>-</td><td>${red.price}</td></tr>`);
        }
        $('#dialogRentView').css("display","block");
    });
}

var renderVehicleTableMainView = function(rentName, destination, start, end, name, cars, motocycles, minPrice, maxPrice){
    var text = `/${rentName}/${destination}/${start}/${end}/${name}/${cars}/${motocycles}/${minPrice}/${maxPrice}`;
    console.log(text);
    $.get('/api/allVehiclesSearch'+text, function(VehicleData){
        console.log("Vehicles: ", VehicleData);
        var vehicles = VehicleData;
    	$('#selectedRentVehiclesTableFullSearch').html(`<tr><th>Rent-a-car</th><th>Destination</th><th>Brand</th><th>Model</th><th>Type</th><th>Grade</th><th>Price</th></tr>`);
        for(var i=0;i<vehicles.length;i++){
            var red = vehicles[i];
            $('#selectedRentVehiclesTableFullSearch tr:last').after(`<tr><td>${red.rentACar.name}</td><td>${red.rentACar.destination.name}</td><td>${red.brand}</td><td>${red.model}</td><td>${red.type}</td><td>-</td><td>${red.price}</td></tr>`);
        }
    });
}


function getAirports(index) {
	$.ajax({
		type: "GET",
		url: "/api/airline/allAirports",
		success: function(data) {
			var fromSelect = $("select#fromFullSearch1");
			var toSelect = $("select#toFullSearch1");
			fromSelect.empty();
			toSelect.empty();
			
			$.each(data, function(index, airport) {
	    		var fromOption = $("<option id='" + airport.id + "'>" + airport.name + " - " + airport.destination.name + ", " + airport.destination.country + "</option>")
	    		var toOption = $("<option id='" + airport.id + "'>" + airport.name + " - " + airport.destination.name + ", " + airport.destination.country + "</option>")
	    		
	    		fromSelect.append(fromOption);
	    		toSelect.append(toOption);
	    	});
		}
	});
}


function stringToDate(displayFormat){
	myDate=displayFormat.split("-");
	var newDate = myDate[1]+"/"+myDate[2]+"/"+myDate[0];
	console.log(newDate);
	return new Date(newDate).getTime();
}

function formatDate(date) {
    month = '' + (date.getMonth() + 1);
    day = '' + date.getDate();
    year = date.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
	return [year, month, day].join('-');
}