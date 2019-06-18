all_rooms = [];
selected_rooms = [];
all_hotel_services = [];
selected_hotel_services = [];
var positionTab = 1;

$(document).ready(function(){
    
    displayAirlines("","");
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
    	displayAirlines("","");
        $('#vehicleSearchDiv').css("display","none");
        $('#roomsSearchDiv').css("display","none");
        $('#flightSearchDiv').css("display","block");
        getAirports(1);
        $('#arrivalDateTRFullSearch').hide();
        $("#searchNameUN").val("");
        $("#searchNameUN").attr("placeholder","Airline name");
        $("#searchDestinationUN").val("");
        $("#searchDestinationUN").attr("placeholder","Airline name");
        positionTab = 1;
    });

    $(document).on('click','#showHotelsBtn',function(){
        displayHotels("NO_INPUT", "NO_INPUT");
        $('#vehicleSearchDiv').css("display","none");
        $('#roomSearchArrivalDateFullSearch').val(formatDate(new Date()));
        $('#roomsSearchDiv').css("display","block");
        $('#flightSearchDiv').css("display","none");
        $("#searchNameUN").val("");
        $("#searchNameUN").attr("placeholder","Hotel name");
        $("#searchDestinationUN").val("");
        $("#searchDestinationUN").attr("placeholder","Hotel name");
        positionTab = 2;
    });

    $(document).on('click','#showRentsBtn',function(){
        displayRents("NO_INPUT", "NO_INPUT");
        $('#vehicleSearchArrivalDateFullSearch').val(formatDate(new Date()));
        $('#vehicleSearchDiv').css("display","block");
        $('#roomsSearchDiv').css("display","none");
        $('#flightSearchDiv').css("display","none");
        $("#searchNameUN").val("");
        $("#searchNameUN").attr("placeholder","Rent-a-car name");
        $("#searchDestinationUN").val("");
        $("#searchDestinationUN").attr("placeholder","Rent-a-car name");
        positionTab = 3;
    });


    $(document).on('click','button',function(e){
        if(e.target.id.startsWith("hotelDetailsBtn")){
            var message = e.target.id.substr(15);
            $.get('/api/hotels/'+ message, function(data){
                console.log("Selected hotel: ", data);
                $('#hotelIdField').val(message);
                $('#pNameOfChosenHotel').text(data.name);
                $('#pDescriptionOfChosenHotel').text(data.description);
                $('#pDestinationOfChosenHotel').text(data.destination.address +
                        " (" + data.destination.name + ", " + data.destination.country + ")");
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
                $('#pDestinationOfChosenRent').text(data.destination.address +
                        " (" + data.destination.name + ", " + data.destination.country + ")");
                $('#vehicleSearchArrivalDate').val(formatDate(new Date()));
                renderVehicleTable(`/${message}/78123947/3214/true/true/NO_INPUT`,message);
            });
        }else if(e.target.id.startsWith("airlineDetailsBtn")){
            var message = e.target.id.substr(17);
            $.get('/api/airlines/'+ message, function(data){
                console.log("Selected airline: ", data);
                $('#airlineIdField').val(message);
                $('#pNameOfChosenAirline').text(data.name);
                $('#pDescriptionOfChosenAirline').text(data.description);
                $('#pDestinationOfChosenAirline').text(data.destination.address +
                    " (" + data.destination.name + ", " + data.destination.country + ")");
                renderAirportTable(message);
            });
        }else if(e.target.id.startsWith("mapLocationAirline")){
            var id = e.target.id.substr(18);
            console.log("PORUKA JE ", id);
            $.get('/api/airlines/'+ id, function(data){
               console.log("Selected airline: ", data);
               initMap(data.destination.latitude, data.destination.longitude);
               $('#dialogMapView').show();
               
            });
        }else if(e.target.id.startsWith("mapLocationHotel")){
            var id = e.target.id.substr(16);
            console.log("PORUKA JE ", id);
            $.get('/api/hotels/'+ id, function(data){
               console.log("Selected hotel: ", data);
               initMap(data.destination.latitude, data.destination.longitude);
               $('#dialogMapView').show();
            });
        }else if(e.target.id.startsWith("mapLocationRent")){
            var id = e.target.id.substr(15);
            console.log("PORUKA JE ", id);
            $.get('/api/rentacars/'+ id, function(data){
               console.log("Selected rent: ", data);
               initMap(data.destination.latitude, data.destination.longitude);
               $('#dialogMapView').show();
            });
        }
    });
    
    $(document).on('click','#closeMapBtn', function(){
    	$('#dialogMapView').hide();
    })

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
        if(isNaN(start)){
        	start = -1;
        }
        
		var end = start + $('#vehicleSearchDayNumberFullSearch').val()*24*60*60*1000;
		if(isNaN(end)){
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
        if(isNaN(start)){
        	start = -1;
        }
        
		var end = start + $('#roomSearchDayNumberFullSearch').val()*24*60*60*1000;
		if(isNaN(end)){
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
    	var priceRange = parseInt($("input#priceRange").val());
    	var durationRange = parseFloat($("input#durationRange").val());
    	var airlineID = parseInt($("select#airlineCompany").children(":selected").attr("id"));
    	
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
    		"airlineID": airlineID,
    		"tripType": tripType,
    		"passengers": parseInt(passengers),
    		"seatClass": seatClass,
    		"bags": parseInt(bags),
    		"priceRange": priceRange,
    		"durationRange": durationRange,
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
    
    $(document).on('click','#quitDialogAirlineView', function(){
    	$('#dialogAirlineView').hide();
    });
    
    $(document).on('click','#searchUNBtn', function(){
    	var name = $("#searchNameUN").val();
    	var dest = $("#searchDestinationUN").val();
    	if(positionTab == 1){
    		displayAirlines(name, dest);
    	}else if(positionTab == 2){
    		if(name == "")
    			name = "NO_INPUT";
    		if(dest == "")
    			dest = "NO_INPUT";
    		displayHotels(name, dest);
    	}else if(positionTab == 3){
    		if(name == "")
    			name = "NO_INPUT";
    		if(dest == "")
    			dest = "NO_INPUT";
    		displayRents(name, dest);
    	}
    });
});

var displayAirlines = function(name, dest){
    $.get("/api/airlines", function(airlines){
    	showAirlines(airlines, name, dest);
    });
}

var displayHotels = function(name, dest){
	var linkText = name + "/" + dest + "/10/20";
    $.get("/api/hotelsSearch/" + linkText, function(hotels){
    	showHotels(hotels);
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
		$('#selectedHotelRoomsTableFullSearch').html(`<tr><td>Hotel</td><td>City</td><th>Floor number</th><th>Number of beds</th><th>Grade</th><th>Price</th></tr>`);
		for(var i=0;i<rooms.length;i++){
			var red = rooms[i];
			$('#selectedHotelRoomsTableFullSearch tr:last').after(`<tr><td>${red.hotel.name}</td><td>${red.hotel.destination.name}</td><td>${red.floor}</td><td>${red.bedNumber}</td><td>-</td><td>${red.price}</td></tr>`);
		}
	});
}

var displayRents = function(name, dest){
	var linkText = name + "/" + dest + "/10/20";
    $.get("/api/rentsSearch/" + linkText, function(rents){
    	showRents(rents);
    });
}

var renderVehicleTable = function(text,myID){
    $.get('/api/vehiclesSearch'+text, function(vehicles){
        console.log("Vehicles: ", vehicles);
        $('#selectedRentVehiclesTable').html(`<tr><th>Brand</th><th>Model</th><th>Type</th><th>Grade</th><th>Price</th></tr>`);
        for(var i=0;i<vehicles.length;i++){
            var red = vehicles[i];
            $('#selectedRentVehiclesTable tr:last').after(`<tr><td>${red.brand}</td><td>${red.model}</td><td>${red.type}</td><td>-</td><td>${red.price}</td></tr>`);
        }
        renderBranchOfficesTable(myID);
    });
}


var renderBranchOfficesTable = function(text){
	
	$.get('/api/branchOfficeByRent/' + text, function(offices){
        console.log("Offices: ", offices);
        $('#RentBranchOfficeTable').html(`<tr><th>Name</th><th>Address</th><th>City</th><th>Country</th></tr>`);
        for(var i=0;i<offices.length;i++){
            var red = offices[i];
            console.log(red);
            $('#RentBranchOfficeTable tr:last').after(`<tr><td>${red.name}</td><td>${red.destination.address}</td><td>${red.destination.name}</td><td>${red.destination.country}</td></tr>`);
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
    	$('#selectedRentVehiclesTableFullSearch').html(`<tr><th>Rent-a-car</th><th>City</th><th>Brand</th><th>Model</th><th>Type</th><th>Grade</th><th>Price</th></tr>`);
        for(var i=0;i<vehicles.length;i++){
            var red = vehicles[i];
            $('#selectedRentVehiclesTableFullSearch tr:last').after(`<tr><td>${red.rentACar.name}</td><td>${red.rentACar.destination.name}</td><td>${red.brand}</td><td>${red.model}</td><td>${red.type}</td><td>-</td><td>${red.price}</td></tr>`);
        }
    });
}

var renderAirportTable = function(id){
	$.get('/api/airline/' + id +'/airports', function(airportsData){
        console.log("Airports: ", airportsData);
    	$('#airlineAirportsTable').html(`<tr><th>Name</th><th>City</th><th>Country</th></tr>`);
        for(var i=0;i<airportsData.length;i++){
            var red = airportsData[i];
            $('#airlineAirportsTable tr:last').after(`<tr><td>${red.name}</td><td>${red.destination.name}</td><td>${red.destination.country}</td></tr>`);
        }
        $('#dialogAirlineView').show();
    });
}


function getAirports(index) {
	$.ajax({
		type: "GET",
		url: "/airport/all",
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


var showHotels = function(hotels){
	console.log("Hotels: ", hotels);
    $('#serviceContainer').html('');
    for(var i=0;i<hotels.length;i++){
        var red = hotels[i];
        var locationID = "mapLocationHotel" + red.id;
        var detailViewButtonID = "hotelDetailsBtn" + red.id;
        var grade = 0;
        var sum = 0;
        for(var j=0;j<red.grades.length;j++){
        	sum += red.grades[j].grade;
        }
        if(red.grades.length!=0){
        	grade = sum/red.grades.length;
        }
        
        var forGrade = `<section class='rating-widget'>
			<div class='rating-stars text-center' style="float:left">
			  <ul id="${red.id}Rent">
			      <li class='star' title='Poor' data-value='1'>
    			  	<i class='fa fa-star fa-fw'></i>
	   			 </li>
	     		 <li class='star' title='Fair' data-value='2'>
	        		<i class='fa fa-star fa-fw'></i>
	      		 </li>
	     		 <li class='star' title='Good' data-value='3'>
	       			<i class='fa fa-star fa-fw'></i>
	      		 </li>
	     		 <li class='star' title='Excellent' data-value='4'>
	        		<i class='fa fa-star fa-fw'></i>
	      		 </li>
	      		 <li class='star' title='WOW!!!' data-value='5'>
	        	 	<i class='fa fa-star fa-fw'></i>
	     		 </li>
    		 </ul>
			</div><section>`
        
        $(`<div class='listItem'><div class="imagePreview2"></div><div style="float: left; margin-left:15px;"><h2 style="margin-left:-15px;">${red.name}</h2><p>${red.destination.address} (${red.destination.name},
        ${red.destination.country})</p><p>${red.description}</p><p>${forGrade}</p></div><div class="mapButtonPreview">
        <button id=${locationID}>Show on map</button><button id=${detailViewButtonID}>More details</button></div></div>`).appendTo("#serviceContainer");
        
        var j = 0;
        var onStar = grade;
    	var stars = $('.li.star');
    	console.log("AAAA", onStar);
    	$("#"+red.id+"Rent li").each(function() {
    		$(this).removeClass('selected');
   		})  
    	$("#"+red.id+"Rent li").each(function() {
    		if(j<onStar){
    			$(this).addClass('selected');
    			j++;
    		}
    		else
    			return false;
    	})
        
    }
}


var showRents = function(rents){
	console.log("Rents: ", rents);
    $('#serviceContainer').html('');
    for(var i=0;i<rents.length;i++){
        var red = rents[i];
        var locationID = "mapLocationRent" + red.id;
        var detailViewButtonID = "rentDetailsBtn" + red.id;
        var grade = 0;
        var sum = 0;
        for(var j=0;j<red.grades.length;j++){
        	sum += red.grades[j].grade;
        }
        if(red.grades.length!=0){
        	grade = sum/red.grades.length;
        }
        
        var forGrade = `<section class='rating-widget'>
			<div class='rating-stars text-center' style="float:left">
			  <ul id="${red.id}Rent">
			      <li class='star' title='Poor' data-value='1'>
    			  	<i class='fa fa-star fa-fw'></i>
	   			 </li>
	     		 <li class='star' title='Fair' data-value='2'>
	        		<i class='fa fa-star fa-fw'></i>
	      		 </li>
	     		 <li class='star' title='Good' data-value='3'>
	       			<i class='fa fa-star fa-fw'></i>
	      		 </li>
	     		 <li class='star' title='Excellent' data-value='4'>
	        		<i class='fa fa-star fa-fw'></i>
	      		 </li>
	      		 <li class='star' title='WOW!!!' data-value='5'>
	        	 	<i class='fa fa-star fa-fw'></i>
	     		 </li>
    		 </ul>
			</div><section>`
        
        $(`<div class='listItem'><div class="imagePreview3"></div><div style="float: left; margin-left:15px;"><h2 style="margin-left:-15px;">${red.name}</h2><p>${red.destination.address} (${red.destination.name},
        ${red.destination.country})</p><p>${red.description}</p><p>${forGrade}</p></div><div class="mapButtonPreview">
        <button id=${locationID}>Show on map</button><button id=${detailViewButtonID}>More details</button></div></div>`).appendTo("#serviceContainer");
        
        var j = 0;
        var onStar = grade;
    	var stars = $('.li.star');
    	console.log("AAAA", onStar);
    	$("#"+red.id+"Rent li").each(function() {
    		$(this).removeClass('selected');
   		})  
    	$("#"+red.id+"Rent li").each(function() {
    		if(j<onStar){
    			$(this).addClass('selected');
    			j++;
    		}
    		else
    			return false;
    	})
        
    }
}


var showAirlines = function(airlines, name, dest){
	var airlineCompanySelect = $("select#airlineCompany");
	airlineCompanySelect.empty();
	airlineCompanySelect.append($("<option id='-999'>Any</option>"));
	
    console.log("Airlines: ", airlines);
    $('#serviceContainer').html('');
    for(var i=0;i<airlines.length;i++){
        var red = airlines[i];
        if(!red.destination.name.toLowerCase().includes(dest.toLowerCase())){
        	continue;
        }
        if(!red.name.toLowerCase().includes(name.toLowerCase())){
        	continue;
        }
        var locationID = "mapLocationAirline" + red.id;
        var detailViewButtonID = "airlineDetailsBtn" + red.id;
        var grade = 0;
        var sum = 0;
        for(var j=0;j<red.grades.length;j++){
        	sum += red.grades[j].grade;
        }
        if(red.grades.length!=0){
        	grade = sum/red.grades.length;
        }
        
        var forGrade = `<section class='rating-widget'>
			<div class='rating-stars text-center' style="float:left">
			  <ul id="${red.id}Rent">
			      <li class='star' title='Poor' data-value='1'>
    			  	<i class='fa fa-star fa-fw'></i>
	   			 </li>
	     		 <li class='star' title='Fair' data-value='2'>
	        		<i class='fa fa-star fa-fw'></i>
	      		 </li>
	     		 <li class='star' title='Good' data-value='3'>
	       			<i class='fa fa-star fa-fw'></i>
	      		 </li>
	     		 <li class='star' title='Excellent' data-value='4'>
	        		<i class='fa fa-star fa-fw'></i>
	      		 </li>
	      		 <li class='star' title='WOW!!!' data-value='5'>
	        	 	<i class='fa fa-star fa-fw'></i>
	     		 </li>
    		 </ul>
			</div><section>`
        
        $(`<div class='listItem'><div class="imagePreview"></div><div style="float: left; margin-left:15px;"><h2 style="margin-left:-15px;">${red.name}</h2><p>${red.destination.address} (${red.destination.name},
        ${red.destination.country})</p><p>${red.description}</p><p>${forGrade}</p></div><div class="mapButtonPreview">
        <button id=${locationID}>Show on map</button><button id=${detailViewButtonID}>More details</button></div></div>`).appendTo("#serviceContainer");
        
        var j = 0;
        var onStar = grade;
    	var stars = $('.li.star');
    	console.log("AAAA", onStar);
    	$("#"+red.id+"Rent li").each(function() {
    		$(this).removeClass('selected');
   		})  
    	$("#"+red.id+"Rent li").each(function() {
    		if(j<onStar){
    			$(this).addClass('selected');
    			j++;
    		}
    		else
    			return false;
    	})
        
        airlineCompanySelect.append($("<option id='" + red.id + "' selected>" + red.name + "</option>"));
    }
    
    airlineCompanySelect.val("Any");
}


function initMap(latitude = 20, longitude = 20) {
	
	var options = {
		zoom: 8,
		center: {lat: latitude, lng: longitude}
	}
	
	var map = new google.maps.Map(document.getElementById('map'), options);
	
	var marker = new google.maps.Marker({
		position: {lat: latitude, lng: longitude},
		map: map
	});
	
	marker.addListener('click', function() {
		map.setZoom(11);
		map.setCenter(marker.getPosition());
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