all_rooms = [];
selected_rooms = [];
all_hotel_services = [];
selected_hotel_services = [];

all_vehicles = [];
selected_vehicles = [];

var globalRent = null;
var globalHotel = null;
var globalAirline = null;

$(document).ready(function(){
    
    renderAirlineTable();
    renderHotelTable();
    renderRentACarTable();
    $('#rateDiv').css("display","none");

    $(document).on('click','#addAirlineBtn',function(){
        $(location).attr('href',"/airline.html");
    });
    
    $(document).on('click','#friendsList',function(){
        $(location).attr('href',"/friendsList.html");
    });
    $(document).on('click','#addHotelBtn',function(){
        $(location).attr('href',"/hotel.html");
    });
    $(document).on('click','#addRentACarBtn',function(){
        $(location).attr('href',"/rentacar.html");
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
    
    $(document).on('click','#allVehiclesBtn',function(){
        $(location).attr('href',"/allUsedVehicles.html");
    });
    
    $(document).on('click','#allFlightsBtn',function(){
        $(location).attr('href',"/allReservedFlights.html");
    });
    
    $(document).on('click','#allRoomsBtn',function(){
        $(location).attr('href',"/allUsedRooms.html");
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

        renderRoomTable(hotelId, start, end, TwoBedRooms, ThreeBedRooms, FourBedRooms,$('#roomSearchDayNumber').val());
    });
    
    $(document).on('click','#vehicleSearchBtn', function(){
        var rentId = $('#rentIdField').val();
        var start = stringToDate($('#vehicleSearchArrivalDate').val());
		var end = start + $('#vehicleSearchDayNumber').val()*24*60*60*1000;
        var cars = $('#vehicleCars').prop('checked');
        var motocycles = $('#vehicleMotocycles').prop('checked');
        var e = document.getElementById("startDestination");
	    var startDest = e.options[e.selectedIndex].text;
	    console.log('Rent: ', rentId ,'....', start, end, cars, motocycles, startDest);
        renderVehicleTable(rentId, start, end, cars, motocycles,$('#vehicleSearchDayNumber').val(), startDest);
    });
    
    $(document).on('click','#quitDialogHotelView',function(){
        $('#selectedHotelRoomsTable').html(`<tr><th>Floor number</th><th>Number of beds</th><th>Grade</th><th>Full price</th><th>Select</th></tr>`);
        $('#dialogHotelView').css("display","none");
    });

    
    ////rate
    $(document).on('click','table button',function(e){
		console.log(e.target.id);
		if(e.target.id.startsWith("rateRent")){
	        var id = e.target.id.substr(8);
	        console.log("HEJHEJ");
	        $("#entityID").val("rent"+id);
	        console.log("rent id: ", id);
	        $.get({url:'/api/getGradeForRent/'+id,
	    		headers: createAuthorizationTokenHeader()}, function(data){
	    		var i = 0;
	    		var onStar = data;
	    		var stars = $('.li.star');
	    		console.log("AAAA", onStar);
	    		$("ul li").each(function() {
	    			$(this).removeClass('selected');
	   		    })  
	    		$("ul li").each(function() {
	    			if(i<onStar){
	    				$(this).addClass('selected');
	    				i++;}
	    			else return false;
	   		    })	    			
	        $('#rateDiv').css("display","block");
	       })
		}
		else if(e.target.id.startsWith("rateAirline")){
	        var id = e.target.id.substr(11);
	        $("#entityID").val("airline"+id);
	        console.log("airline id: ", id);
	        $.get({url:'/api/getGradeForAirline/'+id,
	    		headers: createAuthorizationTokenHeader()}, function(data){
	    		var i = 0;
	    		var onStar = data;
	    		var stars = $('.li.star');
	    		console.log("AAAA", onStar);
	    		$("ul li").each(function() {
	    			$(this).removeClass('selected');
	   		    })  
	    		$("ul li").each(function() {
	    			if(i<onStar){
	    				$(this).addClass('selected');
	    				i++;}
	    			else return false;
	   		    })	    			
	        $('#rateDiv').css("display","block");
	       })
		}
		else if(e.target.id.startsWith("rateHotel")){
	        var id = e.target.id.substr(9);
	        $("#entityID").val("hotel"+id);
	        console.log("hotel id: ", id);
	        $.get({url:'/api/getGradeForHotel/'+id,
	    		headers: createAuthorizationTokenHeader()}, function(data){
	    		var i = 0;
	    		var onStar = data;
	    		var stars = $('.li.star');
	    		console.log("AAAA", onStar);
	    		$("ul li").each(function() {
	    			$(this).removeClass('selected');
	   		    })  
	    		$("ul li").each(function() {
	    			if(i<onStar){
	    				$(this).addClass('selected');
	    				i++;}
	    			else return false;
	   		    })	    			
	        $('#rateDiv').css("display","block");
	       })
		}
	})
    
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
                var branches = "";
                var res = "";
                for(var j=0; j<data.offices.length; j++){
                	branches = branches + data.offices[j].destination.name + ", ";
                }
                var len = branches.length-2;
                res = branches.substring(0, len);
                $('#pDestinationOfChosenRent').text(data.destination.name +
                        ", " + data.destination.country);
                $('#pBranchesOfChosenRent').text(res);
                $('#vehicleSearchArrivalDate').val(formatDate(new Date()));
                var link = '/api/rentBranches/'+$("#rentIdField").val();
                $.get({url: link, 
        			headers: createAuthorizationTokenHeader()}, function(data){
                
					$('#startDestination').html('');
		    		$('#endDestination').html('');
		    		var select = document.getElementById("startDestination");
		    		var select2 = document.getElementById("endDestination");
		    		console.log(data);
		            for(var i=0;i<data.length;i++){
		                var red = data[i];
		                select.options[select.options.length] = new Option(''+red.destination.name,''+red.id);
		                select2.options[select2.options.length] = new Option(''+red.destination.name,''+red.id);
		            }
		        });
                $.get('/api/quickVehicleReservations/' + message, function(data){
                	console.log("quick reservations: ", data);
                    renderQuickVehicleReservations(data);
                });
            });
        }else if(e.target.id.startsWith('quickVehicleReservationNumber')){
        	var message = e.target.id.substr(29);
        	$.ajax({
    			type : 'GET',
    			url : "/api/reserveQuickVehicleReservation/"+message,
    			headers: createAuthorizationTokenHeader(),
    			success: function(){
    				showMessage('Successfully reserved quick vehicle reservation');
    				$('#dialogRentView').css('display', 'none');
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
    
    $(document).on('click','#quitDialogRentView',function(){
    	$('#selectedRentVehiclesTable').html(`<tr><th>Brand</th><th>Model</th><th>Type</th><th>Grade</th><th>Full price</th><th>Select</th></tr>`);
        $('#dialogRentView').css("display","none");
	});
	
    $(document).on('click','#sortRentBtn',function(){
    	var criteria = $("#sortCriteriaRent").val();
		console.log(criteria);
		var data = globalRent;
		if(criteria == "name")
			data.sort((a, b) => (a.name > b.name) ? 1 : -1);
		else
			data.sort((a, b) => (a.destination.name > b.destination.name) ? 1 : -1);
		console.log("vehicle data",data);
		$('#rentACarTable').html(`<tr><th>Name</th><th>Destination</th><th>Grade</th><th>Branche offices</th><th></th><th></th></tr>`);
		$.get({url :"/api/reservedRents",
	        headers: createAuthorizationTokenHeader()},  function(reserved){
	        for(var i=0;i<data.length;i++){
	        	var check = 0;
	            var red = data[i];
	            var btnID = "rentDetailViewBtn" + red.id;
	            var branches = "";
	            var res = "";
	            for(var j=0; j<data[i].offices.length; j++){
	            	branches = branches + data[i].offices[j].destination.name + ", ";
	            }
	            for(var k=0; k<reserved.length; k++){
	            	if(reserved[k].id == data[i].id){
	            		check=1;
	            		break;
	            	}
	            }
	            var rate = "";
	            if(check == 1){
	            	rate = "<button id='rateRent"+ red.id+"'>Rate</button>"
	            }
	            var len = branches.length-2;
	            res = branches.substring(0, len);
	            $('#rentACarTable tr:last').after(`<tr><td>${red.name}</td><td>${red.destination.name}</td><td>-</td><td>${res}<td><button id=${btnID}>More details</button></td><td>${rate}</td></tr>`);
	            }
	        });
		
	});
    
    $(document).on('click','#sortHotelBtn',function(){
    	var criteria = $("#sortCriteriaHotel").val();
		console.log(criteria);
		var data = globalHotel;
		if(criteria == "name")
			data.sort((a, b) => (a.name > b.name) ? 1 : -1);
		else
			data.sort((a, b) => (a.destination.name > b.destination.name) ? 1 : -1);
		console.log("vehicle data",data);
		$('#hotelTable').html(`<tr><th>Name</th><th>Destination</th><th>Grade</th><th></th><th></th></tr>`);
	    $.get({url :"/api/reservedHotels",
	        headers: createAuthorizationTokenHeader()},  function(reserved){
	        for(var i=0;i<data.length;i++){
	        	var check = 0;
	            var red = data[i];
	            var btnID = "hotelDetailViewBtn" + red.id;
	            for(var k=0; k<reserved.length; k++){
	            	if(reserved[k].id == data[i].id){
	            		check=1;
	            		break;
	            	}
	            }
	            var rate = "";
	            if(check == 1){
	            	rate = "<button id='rateHotel"+ red.id+"'>Rate</button>"
	            }
	            $('#hotelTable tr:last').after(`<tr><td>${red.name}</td><td>${red.destination.name}</td><td> - </td><td><button id=${btnID}>More details</button></td></td><td>${rate}</td></tr>`);
	        }
	    });
	  })
    
	 $(document).on('click','#sortAirlineBtn',function(){
    	var criteria = $("#sortCriteriaAirline").val();
		console.log(criteria);
		var data = globalAirline;
		if(criteria == "name")
			data.sort((a, b) => (a.name > b.name) ? 1 : -1);
		else
			data.sort((a, b) => (a.destination.name > b.destination.name) ? 1 : -1);
		console.log("vehicle data",data);
		var table = $("table#airlineTable tbody");
		table.empty();
		$.get({url :"/api/reservedAirlines",
			headers: createAuthorizationTokenHeader()},  function(reserved){
				$.each(data, function(index, airline) {
					for(var k=0; k<reserved.length; k++){
						var check = 0;
	         			if(reserved[k].id == airline.id){
	         				check=1;
	         				break;
	         			}
	         		}
	         		var rate = "";
	         		if(check == 1){
	         			rate = "<td><button id=rateAirline"+ airline.id+">Rate</button></td>"
	         		}
	         		var tr = $("<tr id='" + airline.id + "'><td>" + airline.name + "</td> <td><button class='airlineDetails'>More details</button></td>"+rate+"</tr>");
	         		
	         		table.append(tr);
				});
			});
	 })
	  
	  
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
	
	$(document).on('click','#makeRentReservationBtn',function(){
		selected_vehicles = [];
		console.log("VOZILAAAA: ", all_vehicles);
        for(var i=0;i<all_vehicles.length;i++){
			var red = all_vehicles[i];
			if($('#vehicleCheckbox'+ red.id).prop('checked')){
				delete red.rentACar.hibernateLazyInitializer;
				delete red.rentACar.destination.hibernateLazyInitializer;
				selected_vehicles.push(red);
			}
		}
		var start = stringToDate($('#vehicleSearchArrivalDate').val());
		var end = start + ($('#vehicleSearchDayNumber').val()-1)*24*60*60*1000;	
		console.log("Selected vehicles: ", selected_rooms);
		var price = calculatePriceVehicle(selected_vehicles, $('#vehicleSearchDayNumber').val());
		var link = '/api/branchOffice/'+$("#endDestination option:selected" ).val();
		$.get(link, function(office){
		var reservation = {
			"start": new Date(start),
			"end": new Date(end),
			"vehicles": selected_vehicles,
			"rentACar": selected_vehicles[0].rentACar,
			"price": price,
			"endBranchOffice" : office
		};
		console.log("Vehicle reservation: ", reservation);
		if(reservation.vehicles.length == 0){
			showMessage("Select at least 1 vehicle!", "orange");
			return;
		}
		$.ajax({
			type : 'POST',
			url : "/api/vehicleReservations",
			headers: createAuthorizationTokenHeader(),
			data : JSON.stringify(reservation),
			success: function(){
				$(location).attr('href',"/");
				showMessage('Vehicle reservation successful!', "green");
			},
			error: function (jqXHR, exception) {
				showMessage('[' + jqXHR.status + "]  " + exception, "red");
			}
		})});
	});
	
    
    //--------------- RADOJCIN ---------------
    
	var options = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
	
	function formatDateDet(date) {
		return date.toLocaleDateString("en", options) + " " + (date.getHours() < 10 ? "0" + (date.getHours()) : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
	}
	
	var previousSeat = undefined; //Ujedno i trenutno selektovano mesto
	$(document).on("click", "span.close", function() {
		$("div#seatsTableDiv").empty();
		previousSeat = undefined;
		$("input#toggleSeat").attr("disabled", "disabled");
		$("input#deleteSeat").attr("disabled", "disabled");
		$("div#editSeatsModal").hide();
		
		//---------------- REZERVACIJA ----------------
		
		$("div#seatsDiv").empty();
		selectedSeats = [];
		$("input#makeFlightReservation").attr("disabled", "disabled");
		$("div#reservationSeatsModal").hide();
	});
    
    function getAirports(index) {
    	$.ajax({
    		type: "GET",
    		url: "/api/airline/" + selectedAirline + "/airports",
    		success: function(data) {
    			var fromSelect = $("select#from" + index);
    			var toSelect = $("select#to" + index);
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
    
    var selectedAirline;
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
    					
    					$("div#dialogAirlineView div#reservationSeatsModal").before(table);
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
								"dateOfPurchase": new Date(),
								"price": price,
								"discount": 0
							};
							
							reservations.push(reservation);
						});
						
						console.log(reservations);
						
						$.ajax({
							type: "POST",
							url: "/api/flightReservation/save",
							headers: createAuthorizationTokenHeader(),
				    		data: JSON.stringify(reservations),
				    		success: function(data) {
				    			showMessage(data, "green");
				    			
				    			selectedSeats.forEach(function(seatID) {
				    				$("div.seatDivForReservation#" + seatID).css("background-color", "red");
				    				$("div.seatDivForReservation#" + seatID).css("border", "0");
				    			});
				    			
				    			$("input#makeFlightReservation").attr("disabled", "disabled");
				    			$("div#seatsDiv").empty();
				    			selectedSeats = [];
				    			$("div#reservationSeatsModal").hide();
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
	
	$("button#quitDialogAirlineView").click(function() {
    	$("table#quickFlightReservationsTable tbody").empty();
    	$("table.searchResultTable").remove();
    	$("div#dialogAirlineView").hide();
    	selectedAirline = undefined;
    });
	
	$(document).on("click", "button.airlineDetails", function() {
		selectedAirline = $(this).parent().parent().attr("id");
		
		$.ajax({
			type: "GET",
			url: "/api/airlines/" + selectedAirline,
			dataType: "json",
			success: function(airline) {
				$("h3#pNameOfChosenAirline").text(airline.name);
				$("p#pDescriptionOfChosenAirline").text(airline.description);
				$("p#pDestinationOfChosenAirline").text(airline.destination.name + ", " + airline.destination.country);
				$("p#pGradeOfChosenAirline").text("-");
				
				$("div#dialogAirlineView").show();
			}
		});
		
		getAirports(1);
		
		$.ajax({
			type: "GET",
			url: "/api/flightReservation/getQuickTickets/" + selectedAirline,
			dataType: "json",
			success: function(reservations) {
				var table = $("table#quickFlightReservationsTable tbody");
				
				$.each(reservations, function(index, reservation) {
					var tr = $("<tr id='" + reservation.id + "'><td>" + reservation.flight.from.name + "</td> <td>" + reservation.flight.to.name + "</td> <td>" + formatDateDet(new Date(reservation.flight.departureDate)) + "</td> <td>" + formatDateDet(new Date(reservation.flight.arrivalDate)) + "</td> <td>[" + reservation.seat.seatRow + ":" + reservation.seat.number + "]</td> <td>" + reservation.price + "</td> <td>" + reservation.discount + "</td> <td><input type='button' class='takeAReservation' value='Take it'></td></tr>");
					
					table.append(tr);
				});
			}
		});
	});
	
	$(document).on("click", "input.takeAReservation", function() {
		var tr = $(this).parent().parent();
		var reservationID = tr.attr("id");
		
		$.ajax({
			type: "PUT",
			url: "/api/flightReservation/buyQuickTicket/" + reservationID,
			headers: createAuthorizationTokenHeader(),
			success: function(response) {
				showMessage(response, "green");

				tr.remove();
			},
			error: function(response) {
				alert(response);
			}
		});
	});
	
	$("button#searchUsersButton").click(function() {
		var input = $("input#searchUsersInput").val();
		
		if(input == "") {
			$("table#searchTable").replaceWith("<p id='searchMessage'>No search results.</p>");
			return;
		}
		
		$.ajax({
			type: "GET",
			url: "/api/registeredUser/search/" + input,
			headers: createAuthorizationTokenHeader(),
			success: function(data) {
				if(data.length == 0) {
					$("table#searchTable").replaceWith("<p id='searchMessage'>No search results.</p>");
				} else {
					$("p#searchMessage").replaceWith("<table id='searchTable'> <thead> <tr><th>First name</th> <th>Last name</th> <th>Username</th> <th>Action</th></tr> </thead> <tbody></tbody> </table>");
					var friendsTable = $("table#searchTable tbody");
					friendsTable.empty();
					
					$.ajax({
						type: "GET",
						url: "/auth/getInfo",
						headers: createAuthorizationTokenHeader(),
						success: function(loggedIn) {
							$.each(data, function(index, user) {
								var tr = $("<tr id='" + user.id + "'><td>" + user.firstName + "</td> <td>" + user.lastName + "</td> <td>" + user.username + "</td></tr>");
								
								var action = $("<td><input type='button' class='addFriend' value='Add Friend'></td>");
								
								var check = false;
								$.each(loggedIn.friends, function(index, friend) {
									if(user.username == friend.username) {
										action = $("<td><input type='button' class='unfriend' value='Unfriend'></td>");
										check = true;
										
										tr.append(action);
										friendsTable.append(tr);
									}
								});
								
								if(!check) {
									$.ajax({
										type: "GET",
										url: "/api/registeredUser/getFriendRequests/" + user.id,
										headers: createAuthorizationTokenHeader(),
										success: function(requestsOfFriend) {
											$.each(requestsOfFriend, function(index, request) {
												if(request.id == loggedIn.id) {
													console.log("POSLAO JE");
													action = $("<td><input type='button' class='cancelRequest' value='Cancel request'></td>");
													check = true;
													
													tr.append(action);
													friendsTable.append(tr);
												}
											});
											
											if(!check) {
												$.ajax({
													type: "GET",
													url: "/api/registeredUser/getFriendRequests",
													headers: createAuthorizationTokenHeader(),
													success: function(requests) {
														$.each(requests, function(index, request) {
															if(request.id == user.id) {
																action = $("<td><input type='button' class='acceptRequest' value='Accept'> &nbsp; <input type='button' class='deleteRequest' value='Delete'></td>");
																check = true;
																
																tr.append(action);
																friendsTable.append(tr);
															}
														});
														
														if(!check) {
															tr.append(action);
															friendsTable.append(tr);
														}
													}
												});
											}
										},
										error: function(data) {
											console.log("GRESKA");
										}
									});
								} 
							});
						}
					});
				}
			}
		});
	});
	
	getFriendshipRequests();
	
	function getFriendshipRequests() {
		$.ajax({
			type: "GET",
			url: "/api/registeredUser/getFriendRequests",
			headers: createAuthorizationTokenHeader(),
			success: function(requests) {
				if(requests.length > 0) {
					$("p#requestsMessage").replaceWith("<table id='requestsTable'> <thead><tr><th>First name</th> <th>Last name</th> <th>Username</th> <th>Action</th></tr></thead> <tbody></tbody> </table>");
					var requestsTable = $("table#requestsTable tbody");
					requestsTable.empty();
					
					$.each(requests, function(index, user) {
						var tr = $("<tr id='" + user.id + "'><td>" + user.firstName + "</td> <td>" + user.lastName + "</td> <td>" + user.username + "</td> <td><input type='button' class='acceptRequest' value='Accept'> &nbsp; <input type='button' class='deleteRequest' value='Delete'></td></tr>");
						
						requestsTable.append(tr);
					});
				}
			}
		});
	}
	
	$(document).on("click", "input.addFriend", function() {
		var userID = $(this).parent().parent().attr("id");
		var btn = $(this);
		
		$.ajax({
			type: "POST",
			url: "/api/registeredUser/sendFriendshipRequest/" + userID,
			headers: createAuthorizationTokenHeader(),
			success: function(message) {
				btn.replaceWith("<input type='button' class='cancelRequest' value='Cancel request'>");
				
				showMessage(message, "green");
			}
		});
	})
	
	$(document).on("click", "input.cancelRequest", function() {
		var userID = $(this).parent().parent().attr("id");
		var btn = $(this);
		
		$.ajax({
			type: "DELETE",
			url: "/api/registeredUser/cancelFriendshipRequest/" + userID,
			headers: createAuthorizationTokenHeader(),
			success: function(data) {
				btn.replaceWith("<input type='button' class='addFriend' value='Add Friend'>");
			}
		});
	});

	//******
	$(document).on("click", "input.acceptRequest", function() {
		var userID = $(this).parent().parent().attr("id");
		var btn = $(this);
		
		$.ajax({
			type: "POST",
			url: "/api/registeredUser/acceptFriendshipRequest/" + userID,
			headers: createAuthorizationTokenHeader(),
			success: function(data) {
				$("#"+userID).remove();
				//btn.replaceWith("<input type='button' class='addFriend' value='Add Friend'>");
			}
		})
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
	

	$(document).on("click", "input.deleteRequest", function() {
		var userID = $(this).parent().parent().attr("id");
		var btn = $(this);
		
		$.ajax({
			type: "DELETE",
			url: "/api/registeredUser/deleteFriendshipRequest/" + userID,
			headers: createAuthorizationTokenHeader(),
			success: function(data) {
				$("#"+userID).remove();			
			}
		});
	});
	

	$("form#profileForm").submit(function(e) {
		e.preventDefault();
		
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
			url: "/api/registeredUser/updateProfile",
			headers: createAuthorizationTokenHeader(),
			data: JSON.stringify(admin),
			success: function() {
				showMessage("Profile successfully saved.", "green");
			}
		});
		
		$("div#dialogProfile").hide();
	});
 
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
	$.get("/api/airlines", function(data){
		globalAirline = data;
		var table = $("table#airlineTable tbody");
		table.empty();
		$.get({url :"/api/reservedAirlines",
			headers: createAuthorizationTokenHeader()},  function(reserved){
				$.each(data, function(index, airline) {
					var check = 0;
					for(var k=0; k<reserved.length; k++){
	         			if(reserved[k].id == airline.id){
	         				check=1;
	         				break;
	         			}
	         		}
	         		var rate = "";
	         		if(check == 1){
	         			rate = "<td><button id=rateAirline"+ airline.id+">Rate</button></td>"
	         		}
	         		var tr = $("<tr id='" + airline.id + "'><td>" + airline.name + "</td> <td><button class='airlineDetails'>More details</button></td>"+rate+"</tr>");
	         		
	         		table.append(tr);
        });
    });
});
    }

var renderAirlineTableSearch = function(){
    var text = $('#airlineSearchInput').val();
    
    if(text == ""){
        renderAirlineTable();
        return;
    }
    
    $.get('/api/airlinesSearch/'+text, function(data){
    	var table = $("table#airlineTable tbody");
    	table.empty();
    	globalAirline = data;
    	$.each(data, function(index, airline) {
    		$.get({url :"/api/reservedAirlines",
    			headers: createAuthorizationTokenHeader()},  function(reserved){
    				$.each(data, function(index, airline) {
    					var check = 0;
    					for(var k=0; k<reserved.length; k++){
    	         			if(reserved[k].id == airline.id){
    	         				check=1;
    	         				break;
    	         			}
    	         		}
    	         		var rate = "";
    	         		if(check == 1){
    	         			rate = "<td><button id=rateAirline"+ airline.id+">Rate</button></td>"
    	         		}
    	         		var tr = $("<tr id='" + airline.id + "'><td>" + airline.name + "</td> <td><button class='airlineDetails'>More details</button></td>"+rate+"</tr>");
    	         		
    	         		table.append(tr);
    				});
    			});
    		})
    	}) 
	}

var renderHotelTable = function(){
	$('#hotelTable').html(`<tr><th>Name</th><th>Destination</th><th>Grade</th><th></th><th></th></tr>`);
    $.get("/api/hotels", function(data){
        console.log("Hotels: ", data);
        globalHotel = data;
        $.get({url :"/api/reservedHotels",
            headers: createAuthorizationTokenHeader()},  function(reserved){
        for(var i=0;i<data.length;i++){
        	var check = 0;
            var red = data[i];
            var btnID = "hotelDetailViewBtn" + red.id;
            for(var k=0; k<reserved.length; k++){
            	if(reserved[k].id == data[i].id){
            		check=1;
            		break;
            	}
            }
            var rate = "";
            if(check == 1){
            	rate = "<button id='rateHotel"+ red.id+"'>Rate</button>"
            }
            $('#hotelTable tr:last').after(`<tr><td>${red.name}</td><td>${red.destination.name}</td><td> - </td><td><button id=${btnID}>More details</button></td></td><td>${rate}</td></tr>`);
        }
    });
})}

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
    $('#hotelTable').html(`<tr><th>Name</th><th>Destination</th><th>Grade</th><th></th><th></th></tr>`);
    $.get('/api/hotelsSearch/'+text, function(data){
        console.log("Hotels: ", data);
        $.get({url :"/api/reservedHotels",
            headers: createAuthorizationTokenHeader()},  function(reserved){
        for(var i=0;i<data.length;i++){
        	var check = 0;
            var red = data[i];
            var btnID = "hotelDetailViewBtn" + red.id;
            for(var k=0; k<reserved.length; k++){
            	if(reserved[k].id == data[i].id){
            		check=1;
            		break;
            	}
            }
            var rate = "";
            if(check == 1){
            	rate = "<button id='rateHotel"+ red.id+"'>Rate</button>"
            }
            $('#hotelTable tr:last').after(`<tr><td>${red.name}</td><td>${red.destination.name}</td><td> - </td><td><button id=${btnID}>More details</button></td></td><td>${rate}</td></tr>`);
        }
    });
    });
}

var renderRentACarTable = function(){
    $('#rentACarTable').html(`<tr><th>Name</th><th>Destination</th><th>Grade</th><th>Branche offices</th><th></th><th></th></tr>`);
    $.get("/api/rentacars", function(data){
        console.log("Rent-a-cars: ", data);
        globalRent = data;
        data.sort((a, b) => (a.name > b.name) ? 1 : -1)
        $.get({url :"/api/reservedRents",
        headers: createAuthorizationTokenHeader()},  function(reserved){
        for(var i=0;i<data.length;i++){
        	var check = 0;
            var red = data[i];
            var btnID = "rentDetailViewBtn" + red.id;
            var branches = "";
            var res = "";
            for(var j=0; j<data[i].offices.length; j++){
            	branches = branches + data[i].offices[j].destination.name + ", ";
            }
            for(var k=0; k<reserved.length; k++){
            	if(reserved[k].id == data[i].id){
            		check=1;
            		break;
            	}
            }
            var rate = "";
            if(check == 1){
            	rate = "<button id='rateRent"+ red.id+"'>Rate</button>"
            }
            var len = branches.length-2;
            res = branches.substring(0, len);
            $('#rentACarTable tr:last').after(`<tr><td>${red.name}</td><td>${red.destination.name}</td><td>-</td><td>${res}<td><button id=${btnID}>More details</button></td><td>${rate}</td></tr>`);
            }
        });
    })
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
        globalRent = data;
        $.get({url :"/api/reservedRents",
            headers: createAuthorizationTokenHeader()},  function(reserved){
            for(var i=0;i<data.length;i++){
            	var check = 0;
                var red = data[i];
                var btnID = "rentDetailViewBtn" + red.id;
                var branches = "";
                var res = "";
                for(var j=0; j<data[i].offices.length; j++){
                	branches = branches + data[i].offices[j].destination.name + ", ";
                }
                for(var k=0; k<reserved.length; k++){
                	if(reserved[k].id == data[i].id){
                		check=1;
                		break;
                	}
                }
                var rate = "";
                if(check == 1){
                	rate = "<button id='rateRent"+ red.id+"'>Rate</button>"
                }
                var len = branches.length-2;
                res = branches.substring(0, len);
                $('#rentACarTable tr:last').after(`<tr><td>${red.name}</td><td>${red.destination.name}</td><td>-</td><td>${res}<td><button id=${btnID}>More details</button></td><td>${rate}</td></tr>`);
                }
            });
    });
}

var renderVehicleTable = function(rentId, arrivalDate, departureDate, cars, motocycles,num, startDest){
    var text = `/${rentId}/${arrivalDate}/${departureDate}/${cars}/${motocycles}/${startDest}`;
    console.log(text);
    $.get('/api/vehiclesSearch'+text, function(VehicleData){
            console.log("Vehicles: ", VehicleData);
            var vehicles = VehicleData;
            all_vehicles = vehicles;
        	$('#selectedRentVehiclesTable').html(`<tr><th>Brand</th><th>Model</th><th>Type</th><th>Grade</th><th>Full price</th><th>Select</th></tr>`);
            for(var i=0;i<vehicles.length;i++){
                var red = vehicles[i];
                checkBoxID = "vehicleCheckbox"+ red.id;
                $('#selectedRentVehiclesTable tr:last').after(`<tr><td>${red.brand}</td><td>${red.model}</td><td>${red.type}</td><td>-</td><td>${red.price*num}</td><td>
                <input type="checkbox" id=${checkBoxID}></td></tr>`);
            }
        });
}

var renderQuickVehicleReservations = function(reservations){
	$('#quickVehicleReservationsTable').html(`<tr><th>Start Date</th><th>End Date</th><th>Cars</th><th>Motocycles</th><th>Price</th><th>Start Destination</th><th>End Destination</th><th></th></tr>`);
    for(var i=0;i<reservations.length;i++){
        var red = reservations[i];
        var cars = 0;
        var motocycles = 0;
    	var price = 0;
        for(var k=0;k<red.vehicles.length;k++){
        	var miniRed = red.vehicles[k];
        	if(miniRed.type == "CAR"){
        		cars ++;
        	}else if(miniRed.type == "MOTOCYCLE"){
        		motocycles ++;
        	}
        	var price = price + red.vehicles[k].price;
        }
        console.log(cars, motocycles);
        buttonID = "quickVehicleReservationNumber"+ red.id;
        console.log("-->", red);
        $('#quickVehicleReservationsTable tr:last').after(`<tr><td>${displayDateFormat(red.start)}</td><td>${displayDateFormat(red.end)}</td><td>${cars}</td><td>${motocycles}</td><td>${price}</td><td>${red.vehicles[0].branchOffice.destination.name}</td><td>${red.endBranchOffice.destination.name}</td>
        <td><button id=${buttonID}>Reserve</button></td></tr>`);
        }
    $('#dialogRentView').css("display","block");
};

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
}


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

function calculatePriceVehicle(vehicles, days){
	price = 0;
	for(var i=0;i<vehicles.length;i++){
		price += (days * vehicles[i].price);
	}
	return price;
}