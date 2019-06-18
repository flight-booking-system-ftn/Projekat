all_rooms = [];
selected_rooms = [];
all_hotel_services = [];
selected_hotel_services = [];

all_vehicles = [];
selected_vehicles = [];

var globalRent = null;
var globalHotel = null;
var globalAirline = null;
var selectedAirline;
var bigReservation = {
	flightReservation: null,
	flights: [],
	roomReservation: null,
	vehicleReservation: null,
	user: null,
	discountPercentageBonusPoints: 0,
	discountHotelService: 0,
	flightReservationType: null,
	roomReservationType: null,
	vehicleReservationType: null,
	bonusPoints: 0
};

$(document).ready(function(){
    
    renderAirlineTable();
    //renderHotelTable();
    //renderRentACarTable();
	$('#vehicleSearchDiv').css("display","none");
	$('#roomsSearchDiv').css("display","none");
	$('#flightSearchDiv').css("display","block");
	displayAirlines();
    $('#outDiv').css("display","none");

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
    	 $('#serviceContainer').html('');
         $('#searchSortContainer').html('');
    	 $(`<div id="vehicleHistContainer" class="dialogContent"><table id="vehiclesHistory">
			<tr><th>Brand</th><th>Model</th><th>Type</th><th>Rate</th></tr>
		</table></div>`).appendTo("#searchSortContainer");
    	 $.get({url:'/api/allUsedVehicles',
    			headers: createAuthorizationTokenHeader()}, function(data){
    				console.log("all vehicles: ", data);	 
    				var vehicles = data;
    				console.log("vehicle data",vehicles);
    				$('#vehiclesHistory').html(`<tr><th>Brand</th><th>Model</th><th>Type</th><th>Rate</th></tr>`);
    				for(var i=0;i<vehicles.length;i++){
    					var red = vehicles[i];
    					console.log("-----------aaa->", red);
    					buttonID = "rateBtnV"+ red.id;
    					console.log("-->", red);
    					$('#vehiclesHistory tr:last').after(`<tr><td>${red.brand}</td><td>${red.model}</td><td>${red.type}</td><td><button id=${buttonID}>Rate</button></td></tr>`);
    				}
    				$('#iddd').css("display","none");
    			})
    });
    
    $(document).on('click','#allFlightsBtn',function(){
    	$('#serviceContainer').html('');
        $('#searchSortContainer').html('');
   	 $(`<div id="flightHistContainer" class="dialogContent"><table id="flightsHistory">
			<tr><th>From</th><th>To</th><th>Length</th><th>Rate</th></tr>
		</table></div>`).appendTo("#searchSortContainer");
   	$.get({url:'/api/allUsedFlights',
		headers: createAuthorizationTokenHeader()}, function(data){
			console.log("all flights: ", data);	 
			var flights = data;
			console.log("flight data",flights);
			$('#flightsHistory').html(`<tr><th>From</th><th>To<th>Departure date</th><th>Arrival date</th><th>Rate</th></tr>`);
			for(var i=0;i<flights.length;i++){
				var red = flights[i];
				console.log("-----------aaa->", red);
				buttonID = "rateBtnF"+ red.id;
				console.log("-->", red);
				var start = formatDateDet(new Date(red.departureDate));
				var end = formatDateDet(new Date(red.arrivalDate));
				$('#flightsHistory tr:last').after(`<tr><td>${red.from.name}</td><td>${red.to.name}</td><td>${start}</td><td>${end}</td><td><button id=${buttonID}>Rate</button></td></tr>`);
			}
			$('#outDiv').css("display","none");
		})
    });
    
    $(document).on('click','table button',function(e){
		console.log(e.target.id);
		if(e.target.id.startsWith("rateBtnV")){
	        var id = e.target.id.substr(8);
	        $("#entityID").val("vehicle"+id);
	        console.log("vehicle id: ", id);
	        $.get({url:'/api/getGradeForVehicle/'+id,
	    		headers: createAuthorizationTokenHeader()}, function(data){
	    		var k = 0;
	    		var onStar = data;
	    		var stars = $('.li.star');
	    		console.log("AAAA", onStar);
	    		$("#stars li").each(function() {
	    			$(this).removeClass('selected');
	   		    })  
	    		$("#stars li").each(function() {
	    			if(k<onStar){
	    				$(this).addClass('selected');
	    				k++;
	    			}
	    			else return false;
	   		    })	    			
	        $('#outDiv').css("display","block");
	       })
		}
	})
	
	$(document).on('click', "#allVehiclesCancel", function(){
        $("#vehicleHistContainer").css("display", "none");
        displayAirlines();
        
	})
    
	
	$(document).on('click', "#allFlightsCancel", function(){
		$("#flightHistContainer").css("display", "none");
		displayAirlines();
	})
	
    $(document).on('click','#allRoomsBtn',function(){
    	$('#serviceContainer').html('');
        $('#searchSortContainer').html('');
   	 $(`<div id="roomHistContainer" class="dialogContent"><table id="roomsHistory">
			<tr><th>Room number</th><th>Bed number</th><th>Floor</th><th>Hotel</th><th>Rate</th></tr>
		</table></div>`).appendTo("#searchSortContainer");
   	$.get({url:'/api/allUsedRooms',
		headers: createAuthorizationTokenHeader()}, function(data){
			console.log("all Rooms: ", data);	 
			var rooms = data;
			console.log("room data",rooms);
			$('#roomsHistory').html(`<tr><th>Room number</th><th>Bed number</th><th>Floor</th><th>Hotel</th><th>Rate</th></tr>`);
			for(var i=0;i<rooms.length;i++){
				var red = rooms[i];
				console.log("-----------aaa->", red);
				buttonID = "rateBtnR"+ red.id;
				console.log("-->", red);
				$('#roomsHistory tr:last').after(`<tr><td>${red.roomNumber}</td><td>${red.bedNumber}</td><td>${red.floor}</td><td>${red.hotel.name}</td><td><button id=${buttonID}>Rate</button></td></tr>`);
			}
		})
		$('#outDiv').css("display","none");
    });
    
    $(document).on('click','table button',function(e){
		console.log(e.target.id);
		if(e.target.id.startsWith("rateBtnR")){
	        var id = e.target.id.substr(8);
	        $("#entityID").val("room"+id);
	        console.log("room id: ", id);
	        $.get({url:'/api/getGradeForRoom/'+id,
	    		headers: createAuthorizationTokenHeader()}, function(data){
	    		var k = 0;
	    		var onStar = data;
	    		var stars = $('.li.star');
	    		console.log("AAAA", onStar);
	    		$("#stars li").each(function() {
	    			$(this).removeClass('selected');
	   		    })  
	    		$("#stars li").each(function() {
	    			if(k<onStar){
	    				$(this).addClass('selected');
	    				k++;}
	    			else return false;
	   		    })	    			
	        $('#outDiv').css("display","block");
	       })
		}else if(e.target.id.startsWith("rateBtnF")){
	        var id = e.target.id.substr(8);
	        $("#entityID").val("flight"+id);
	        console.log("flight id: ", id);
	        $.get({url:'/flight/getGradeForFlight/'+id,
	    		headers: createAuthorizationTokenHeader()}, function(data){
	    		var k = 0;
	    		var onStar = data;
	    		console.log("fff", data);
	    		var stars = $('.li.star');
	    		$("#stars li").each(function() {
	    			$(this).removeClass('selected');
	   		    })  
	    		$("#stars li").each(function() {
	    			if(k<onStar){
	    				$(this).addClass('selected');
	    				k++;}
	    			else return false;
	   		    })	    			
	        $('#outDiv').css("display","block");
	       })
		}
	})
	
	$(document).on('click', "#allRoomsCancel", function(){
		 $("#roomHistContainer").css("display", "none");
		 displayAirlines();
	})
	
 /* 1. Visualizing things on Hover - See next part for action on click */
  $('#stars li').on('mouseover', function(){
    var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on
   
    // Now highlight all the stars that's not after the current hovered star
    $(this).parent().children('li.star').each(function(e){
      if (e < onStar) {
        $(this).addClass('hover');
      }
      else {
        $(this).removeClass('hover');
      }
    });
    
  }).on('mouseout', function(){
    $(this).parent().children('li.star').each(function(e){
      $(this).removeClass('hover');
    });
  });
  
  
  /* 2. Action to perform on click */
  $('#stars li').on('click', function(){
    var onStar = parseInt($(this).data('value'), 10); // The star currently selected
    var stars = $(this).parent().children('li.star');
    
    for (i = 0; i < stars.length; i++) {
      $(stars[i]).removeClass('selected');
    }
    
    for (i = 0; i < onStar; i++) {
      $(stars[i]).addClass('selected');
    }
    
    var entityID= $("#entityID").val();
    console.log(entityID);
    if(entityID.startsWith("vehicle")){
    $.ajax({
		type : 'POST',
		url : "/api/setGradeForVehicle/"+entityID.substring(7)+"/"+onStar,
		headers: createAuthorizationTokenHeader()
		})
    }
    
    else if(entityID.startsWith("rent")){
        $.ajax({
    		type : 'POST',
    		url : "/api/setGradeForRent/"+entityID.substring(4)+"/"+onStar,
    		headers: createAuthorizationTokenHeader(),
    		success: function(){displayRents();}}
    		)
    		
        }
    else if(entityID.startsWith("room")){
        $.ajax({
    		type : 'POST',
    		url : "/api/setGradeForRoom/"+entityID.substring(4)+"/"+onStar,
    		headers: createAuthorizationTokenHeader()})
        }
    else if(entityID.startsWith("hotel")){
    	console.log(entityID.substring(5) + ">>>>>>> " + onStar);
        $.ajax({
    		type : 'GET',
    		url : "/api/setGradeForHotel/"+entityID.substring(5)+"/"+onStar,
    		headers: createAuthorizationTokenHeader(),
    		success: function(){
    			console.log("<<<<<<<<HOTEL>>>>>>>>");
    			displayHotels();
    			},
    		error : function(e){
    			console.log(e);
    		}
        })
        }
    else if(entityID.startsWith("airline")){
        $.ajax({
    		type : 'POST',
    		url : "/api/setGradeForAirline/"+entityID.substring(7)+"/"+onStar,
    		headers: createAuthorizationTokenHeader(),
    		success: function(){
    			console.log("****AAA");
    			displayAirlines();
    		}})
        }
    else if(entityID.startsWith("flight")){
        $.ajax({
    		type : 'POST',
    		url : "/flight/setGradeForFlight/"+entityID.substring(6)+"/"+onStar,
    		headers: createAuthorizationTokenHeader()
    		})
        }
    $('#outDiv').css("display","none");
  });
    
    //************************************************
    $(document).on('click','#showAirlinesBtn',function(){
        displayAirlines();
        $('#vehicleSearchDiv').css("display","none");
        $('#roomsSearchDiv').css("display","none");
        $('#flightSearchDiv').css("display","block");
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

        renderRoomTable(hotelId, start, end, TwoBedRooms, ThreeBedRooms, FourBedRooms, parseInt($('#roomSearchDayNumber').val()) + 1);
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
        renderVehicleTable(rentId, start, end, cars, motocycles,parseInt($('#vehicleSearchDayNumber').val())+1, startDest);
    });
    
    $(document).on('click','#quitDialogHotelView',function(){
        $('#selectedHotelRoomsTable').html(`<tr><th>Floor number</th><th>Number of beds</th><th>Grade</th><th>Full price</th><th>Select</th></tr>`);
        $('#dialogHotelView').css("display","none");
    });
    
    $(document).on('click','button',function(e){
       if(e.target.id.startsWith("mapLocationAirline")){
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
    
    $(document).on('click','#quitViewReservationBtn', function(){
    	$('#reservationsDiv').hide();
    })
    
    $(document).on('click','#showReservationBtn',function(){
		$('#reservationsDiv').show();
		
		console.log(bigReservation);
	});

    
    ////rate
    $(document).on('click','button',function(e){
		console.log(e.target.id);
		if(e.target.id.startsWith("rateRent")){
	        var id = e.target.id.substr(8);
	        console.log("HEJHEJ");
	        $("#entityID").val("rent"+id);
	        console.log("rent id: ", id);
	        $.get({url:'/api/getGradeForRent/'+id,
	    		headers: createAuthorizationTokenHeader()}, function(data){
	    		var k = 0;
	    		var onStar = data;
	    		var stars = $('.li.star');
	    		console.log("AAAA", onStar);
	    		$("#stars li").each(function() {
	    			$(this).removeClass('selected');
	   		    })  
	    		$("#stars li").each(function() {
	    			if(k<onStar){
	    				$(this).addClass('selected');
	    				k++;}
	    			else return false;
	   		    })	    			
	        $('#outDiv').css("display","block");
	    	displayRents();
	       })
		}
		else if(e.target.id.startsWith("rateAirline")){
	        var id = e.target.id.substr(11);
	        $("#entityID").val("airline"+id);
	        console.log("airline id: ", id);
	        $.get({url:'/api/getGradeForAirline/'+id,
	    		headers: createAuthorizationTokenHeader()}, function(data){
	    		var k = 0;
	    		var onStar = data;
	    		var stars = $('.li.star');
	    		console.log("AAAA", onStar);
	    		$("#stars li").each(function() {
	    			$(this).removeClass('selected');
	   		    })  
	    		$("#stars li").each(function() {
	    			if(k<onStar){
	    				$(this).addClass('selected');
	    				k++;}
	    			else return false;
	   		    })	    			
	        $('#outDiv').css("display","block");
	       })
		}
		else if(e.target.id.startsWith("rateHotel")){
	        var id = e.target.id.substr(9);
	        $("#entityID").val("hotel"+id);
	        console.log("hotel id: ", id);
	        $.get({url:'/api/getGradeForHotel/'+id,
	    		headers: createAuthorizationTokenHeader()}, function(data){
	    		var k = 0;
	    		var onStar = data;
	    		var stars = $('.li.star');
	    		console.log("AAAA", onStar);
	    		$("#stars li").each(function() {
	    			$(this).removeClass('selected');
	   		    })  
	    		$("#stars li").each(function() {
	    			if(k<onStar){
	    				$(this).addClass('selected');
	    				k++;}
	    			else return false;
	   		    })	    			
	        $('#outDiv').css("display","block");
	       })
		}
	})
    
    $(document).on('click','button',function(e){
        if(e.target.id.startsWith("hotelDetailViewBtn")){
            var message = e.target.id.substr(18);
            console.log("PORUKA JE ", message);
            $.get('/api/hotels/'+ message, function(data){
                console.log("MY DATA: ", data);
                $('#hotelIdField').val(message);
                $('#pNameOfChosenHotel').text(data.name);
                $('#pDescriptionOfChosenHotel').text(data.description);
                $('#pDestinationOfChosenHotel').text(data.destination.address +
                        " (" + data.destination.name + ", " + data.destination.country + ")");
                $('#roomSearchArrivalDate').val(formatDate(new Date()));
                if(bigReservation.flightReservation != null){
                	$('#roomSearchArrivalDate').val(bigReservation.flights[0].arrivalDate.substring(0,10));
                	$('#roomSearchArrivalDate').attr("disabled", "disabled");
                	if(bigReservation.flights[1]!=null){
	                	const date1 = new Date(bigReservation.flights[0].arrivalDate.substring(0,10));
	                	const date2 = new Date(bigReservation.flights[1].departureDate.substring(0,10));
	                	const diffTime = Math.abs(date2.getTime() - date1.getTime());
	                	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
	                	$('#roomSearchDayNumber').val(diffDays);
	                	$('#roomSearchDayNumber').attr("disabled", "disabled");}
                }
                $.get('/api/quickRoomReservations/' + message, function(data){
                	console.log("quick reservations: ", data);
                    renderHotelServiceTable(message);
                    renderQuickRoomReservations(data);
                });
            });
        }else if(e.target.id.startsWith('quickRoomReservationNumber')){
        	var message = e.target.id.substr(26);
        	
        	$.ajax({
        		type: 'GET',
        		url: '/api/getQuickReservation/' + message,
        		headers: createAuthorizationTokenHeader(),
    			success: function(reservation){
    				console.log(reservation);
    				bigReservation.roomReservation = reservation;
    				bigReservation.roomReservationType = "quick";
    				
    				$("label#priceWithoutDiscount").text(parseInt($("label#priceWithoutDiscount").text()) + reservation.price);
    				$("label#totalPrice").text(parseInt($("label#totalPrice").text()) + (reservation.price * (100 - reservation.hotel.extraServiceDiscount)/100));
    				$("label#roomServicesDiscount").text(parseInt($("label#roomServicesDiscount").text()) + reservation.hotel.extraServiceDiscount);
    				
    				for(var i = 0; i < bigReservation.flightReservation.length; i++) {
    					bigReservation.flightReservation[i].roomReservation = reservation;
    				}
    				
    	    		showMessage('Room added to reservation list', "green");
    	    		$('#dialogHotelView').hide();
    	    		$('#selectedHotelRoomsTable').html('<tr><th>Floor number</th><th>Number of beds</th><th>Grade</th><th>Full price</th><th>Select</th></tr>');
    	    		console.log("BIG RESERVATION : ", bigReservation);
    	    		$('#reservedRoomTable').html('<tr><th>Hotel</th><th>Room number</th><th>Floor number</th><th>Number of beds</th><th>Price</th></tr>');
    	    		for(var i=0; i<reservation.rooms.length;i++){
    	    			var red = reservation.rooms[i];
    	    			var multi = parseInt($('#roomSearchDayNumber').val())+1;
    	    			var diss = (100 - reservation.discount)/100;
    	    			var myPrice = Math.round(red.price*multi*diss);
    	    			$('#reservedRoomTable tr:last').after(`<tr><td>${reservation.hotel.name}</td><td>${red.roomNumber}</td><td>${red.floor}</td><td>${red.bedNumber}</td><td>${myPrice}</td></tr>`);
    	    		}
    	    		
    	    		
    	    		$('#reservedHotelServicesTable').html('<tr><th>Name</th><th>Price</th></tr>');
    	    		for(var i=0; i<reservation.services.length;i++){
    	    			var red = reservation.services[i];
    	    			var multi = parseInt($('#roomSearchDayNumber').val())+1;
    	    			var myPrice = Math.round(red.price*multi);
    	    			$('#reservedHotelServicesTable tr:last').after(`<tr><td>${red.name}</td><td>${myPrice}</td></tr>`);
    	    		}
    	    		
    	    		$('#reservationsDiv').show();
    			},
    			error: function (jqXHR, exception) {
    				showMessage(exception, 'red');
    			}
        	});
        	
//        	$.ajax({
//    			type : 'GET',
//    			url : "/api/reserveQuickRoomReservation/"+message,
//    			headers: createAuthorizationTokenHeader(),
//    			success: function(){
//    				showMessage('Successfully reserved quick room reservation');
//    				$('#dialogHotelView').css('display', 'none');
//    			},
//    			error: function (jqXHR, exception) {
//    				if (jqXHR.status == 401) {
//    					showMessage('Login first!', "orange");
//					}else{
//						showMessage('[' + jqXHR.status + "]  " + exception, "red");
//					}
//    			}
//    		})
        }
    });
    
    $(document).on('click','button',function(e){
        if(e.target.id.startsWith("rentDetailViewBtn")){
            var message = e.target.id.substr(17);
            console.log("PORUKA JE ", message);
            $.get('/api/rentacars/'+ message, function(data){
                console.log("MY DATA: ", data);
                console.log("DEST", data.destination);
                console.log("Selected rent: ", data);
                $('#rentIdField').val(message);
                $('#pNameOfChosenRent').text(data.name);
                $('#pDescriptionOfChosenRent').text(data.description);
                $('#pDestinationOfChosenRent').text(data.destination.address +
                        " (" + data.destination.name + ", " + data.destination.country + ")");
                $('#vehicleSearchArrivalDate').val(formatDate(new Date()));
                renderVehicleTable2(`/${message}/78123947/3214/true/true/NO_INPUT`,message);
                $('#vehicleSearchArrivalDate').val(formatDate(new Date()));
                if(bigReservation.flightReservation != null){
                	$('#vehicleSearchArrivalDate').val(bigReservation.flights[0].arrivalDate.substring(0,10));
                	$('#vehicleSearchArrivalDate').attr("disabled", "disabled");
                	if(bigReservation.flights[1]!=null){
	                	const date1 = new Date(bigReservation.flights[0].arrivalDate.substring(0,10));
	                	const date2 = new Date(bigReservation.flights[1].departureDate.substring(0,10));
	                	const diffTime = Math.abs(date2.getTime() - date1.getTime());
	                	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
	                	$('#vehicleSearchDayNumber').val(diffDays);
	                	$('#vehicleSearchDayNumber').attr("disabled", "disabled");
                	}
                }
                console.log($("#rentIdField").val());
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
		                select.options[select.options.length] = new Option(''+ red.name,''+red.id);
		                select2.options[select2.options.length] = new Option(''+ red.name,''+red.id);
		            }
		            $.get('/api/quickVehicleReservations/' + message, function(data){
		            	console.log("quick reservations: ", data);
	                    renderQuickVehicleReservations(data);
	                });
		        });
                
            });
        }else if(e.target.id.startsWith('quickVehicleReservationNumber')){
        	var message = e.target.id.substr(29);
        	$.ajax({
        		type: 'GET',
        		url: '/api/getQuickReservationRent/' + message,
        		headers: createAuthorizationTokenHeader(),
    			success: function(reservation){
    				console.log(reservation);
    				bigReservation.vehicleReservation = reservation;
    				bigReservation.vehicleReservationType = "quick";
    				
    				$("label#priceWithoutDiscount").text(parseInt($("label#priceWithoutDiscount").text()) + reservation.price);
    				$("label#totalPrice").text(parseInt($("label#totalPrice").text()) + reservation.price);
    				
    				for(var i = 0; i < bigReservation.flightReservation.length; i++) {
    					bigReservation.flightReservation[i].vehicleReservation = reservation;
    				}
    				
    	    		showMessage('Vehicle added to reservation list', "green");
    	    		$('#dialogRentView').hide();
    	    		$('#selectedRentVehiclesTable').html('<tr><th>Floor number</th><th>Number of beds</th><th>Grade</th><th>Full price</th><th>Select</th></tr>');
    	    		console.log("BIG RESERVATION : ", bigReservation);
    	    		$('#reservedVehicleTable').html('<tr><th>Rent-a-car</th><th>Model</th><th>Brand</th><th>Type</th><th>Seats</th><th>Price</th></tr>');
    	    		for(var i=0; i<reservation.vehicles.length;i++){
    	    			var red = reservation.vehicles[i];
    	    			var multi = parseInt($('#vehicleSearchDayNumber').val())+1;
    	    			var diss = (100 - reservation.discount)/100;
    	    			var myPrice = Math.round(red.price*multi*diss);
    	    			$('#reservedVehicleTable tr:last').after(`<tr><td>${reservation.rentACar.name}</td><td>${red.brand}</td><td>${red.model}</td><td>${red.type}</td><td>${red.seatsNumber}</td><td>${myPrice}</td></tr>`);
    	    		}

    	    		$('#reservationsDiv').show();
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
		var rents = data;
		$('#serviceContainer').html('');
		$.get({url :"/api/reservedRents",
	        headers: createAuthorizationTokenHeader()},  function(reserved){
		for(var i=0;i<rents.length;i++){
            var red = rents[i];
            var locationID = "mapLocationRent" + red.id;
            var detailViewButtonID = "rentDetailViewBtn" + red.id;
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
				  <ul id=${red.id}Rent>
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
				</div></section>`;
            var check = 0;
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
            
            $(`<div class='listItem'><div class="imagePreview3"></div><div style="float: left; margin-left:15px;"><h2 style="margin-left:-15px;">${red.name}</h2><p>${red.destination.address} (${red.destination.name},
            ${red.destination.country})</p><p>${red.description}</p><p>${forGrade}</p></div><div class="mapButtonPreview">
            <button id=${locationID}>Show on map</button><button id=${detailViewButtonID}>More details</button>${rate}</div></div>`).appendTo("#serviceContainer");
			var k = 0;
			var onStar = grade;
	    	var stars = $('.li.star');
	    	console.log("AAAA", onStar);
	    	$("#"+red.id+"Rent li").each(function() {
	    		$(this).removeClass('selected');
	   		})  
	    	$("#"+red.id+"Rent li").each(function() {
	    		if(k<onStar){
	    			$(this).addClass('selected');
	    			k++;
	    		}
	    		else
	    			return false;
	   		 })
        }});	 
	});
    
    $(document).on('click','#sortHotelBtn',function(){
    	var criteria = $("#sortCriteriaHotel").val();
    	$('#serviceContainer').html('');
		console.log(criteria);
		var data = globalHotel;
		if(criteria == "name")
			data.sort((a, b) => (a.name > b.name) ? 1 : -1);
		else
			data.sort((a, b) => (a.destination.name > b.destination.name) ? 1 : -1);
		console.log("hotel data",data);
		var hotels = data;
		$.get({url :"/api/reservedHotels",
            headers: createAuthorizationTokenHeader()},  function(reserved){
		for(var i=0;i<hotels.length;i++){
            var red = hotels[i];
            var locationID = "mapLocationHotel" + red.id;
            var detailViewButtonID = "hotelDetailViewBtn" + red.id;
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
				  <ul id=${red.id}Hotel>
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
				</div></section>`;
            var check = 0;
            for(var k=0; k<reserved.length; k++){
            	if(reserved[k].id == hotels[i].id){
            		check=1;
            		break;
            	}
            }
            var rate = "";
            if(check == 1){
            	rate = "<button id='rateHotel"+ red.id+"'>Rate</button>"
            }
            $(`<div class='listItem'><div class="imagePreview2"></div><div style="float: left; margin-left:15px;"><h2 style="margin-left:-15px;">${red.name}</h2><p>${red.destination.address} (${red.destination.name},
            ${red.destination.country})</p><p>${red.description}</p><p>${forGrade}</p></div><div class="mapButtonPreview">
            <button id=${locationID}>Show on map</button><button id=${detailViewButtonID}>More details</button>${rate}</div></div>`).appendTo("#serviceContainer");
            var onStar = grade;
 	    	var stars = $('.li.star');
 	    	console.log("AAAA", onStar);
 	    	var k = 0;
 	    	$("#"+red.id+"Hotel li").each(function() {
 	    		$(this).removeClass('selected');
 	   		})  
 	    	$("#"+red.id+"Hotel li").each(function() {
 	    		if(k<onStar){
 	    			$(this).addClass('selected');
 	    			k++;
 	    		}
 	    		else
 	    			return false;
 	   		 })
		}
		
		
		
		
	    /*$.get({url :"/api/reservedHotels",
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
	    });*/
	  })})
    
	 $(document).on('click','#sortAirlineBtn',function(){
    	var criteria = $("#sortCriteriaAirline").val();
		console.log(criteria);
		$('#serviceContainer').html('');
		var data = globalAirline;
		if(criteria == "name")
			data.sort((a, b) => (a.name > b.name) ? 1 : -1);
		else
			data.sort((a, b) => (a.destination.name > b.destination.name) ? 1 : -1);
		var airlines = data;
		console.log("airlines",airlines);
		 $.get({url :"/api/reservedAirlines",
				headers: createAuthorizationTokenHeader()},  function(reserved){
		 for(var i=0;i<airlines.length;i++){
	            var red = airlines[i];
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
					  <ul id=${red.id}Airline>
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
					</div></section>`	;
	            var check = 0;
	            for(var k=0; k<reserved.length; k++){
	            	if(reserved[k].id == airlines[i].id){
	            		check=1;
	            		break;
	            	}
	            }
	            var rate = "";
	            if(check == 1){
	            	rate = "<button id='rateAirline"+ red.id+"'>Rate</button>"
	            }
	            $(`<div class='listItem'><div class="imagePreview"></div><div style="float: left; margin-left:15px;"><h2 style="margin-left:-15px;">${red.name}</h2><p>${red.destination.address} (${red.destination.name},
	            ${red.destination.country})</p><p>${red.description}</p><p>${forGrade}</p></div><div class="mapButtonPreview">
	            <button id=${locationID}>Show on map</button><button id=${detailViewButtonID}>More details</button>${rate}</div></div>`).appendTo("#serviceContainer");
	            var onStar = grade;
	 	    	var stars = $('.li.star');
	 	    	console.log("AAAA", onStar);
	 	    	$("#"+red.id+"Airline li").each(function() {
	 	    		$(this).removeClass('selected');
	 	   		})  
	 	   		var k = 0;
	 	    	$("#"+red.id+"Airline li").each(function() {
	 	    		if(k<onStar){
	 	    			$(this).addClass('selected');
	 	    			k++;
	 	    		}
	 	    		else
	 	    			return false;
	 	   		 })
	        }
		 });
		/*var table = $("table#airlineTable tbody");
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
			});*/
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
		var end = start + parseInt($('#roomSearchDayNumber').val())*24*60*60*1000;	
		if(start < new Date().getTime()-24*60*60*1000 || end < new Date().getTime()-24*60*60*1000){
			showMessage("Cannot select past date", "orange");
			return;
		}
		console.log("Selected rooms: ", selected_rooms);
		console.log("Selected hotel services: ", selected_hotel_services);
		if(selected_rooms.length == 0){
			showMessage("Select at least 1 room!", "orange");
			return;
		}
		var numOfBedsTotal = 0;
		for(var k=0;k<selected_rooms.length;k++){
			numOfBedsTotal += selected_rooms[k].bedNumber;
		}
		if(numOfBedsTotal < bigReservation.flightReservation.length){
			showMessage("Not enough rooms!", "orange");
			return;
		}
		var price = calculatePrice(selected_rooms, selected_hotel_services, parseInt($('#roomSearchDayNumber').val()) + 1);
		var reservation = {
			"start": new Date(start),
			"end": new Date(end),
			"rooms": selected_rooms,
			"services": selected_hotel_services,
			"hotel": selected_rooms[0].hotel,
			"price": price,
			"discount": 0
		};
		console.log("Hotel reservation: ", reservation);
		
		bigReservation.roomReservation = reservation;
		bigReservation.roomReservationType = "regular";
		
		/*var roomPrice = bigReservation.roomReservation.price;
		var vehiclePrice = bigReservation.vehicleReservation.price;
		var flightPrice = 0;
		
		for(var i = 0; i < bigReservation.flightReservation.length; i++)
			flightPrice += bigReservation.flightReservation[i].price;
		
		$("label#priceWithoutDiscount").text(flightPrice + roomPrice + vehiclePrice);
		
		var total = 0;
		
		roomPrice = roomPrice * (100 - bigReservation.roomReservation.hotel.extraServiceDiscount) / 100;
		total = flightPrice + roomPrice + vehiclePrice;
		total = total * (parseInt($("label#bonusPointsDiscount").text()) / 100) * parseInt($("label#userBonusPoints").text());
		
		$("label#totalPrice").text(total);
		$("label#roomServicesDiscount").text(bigReservation.roomReservation.hotel.extraServiceDiscount);*/
		
		for(var i = 0; i < bigReservation.flightReservation.length; i++) {
			bigReservation.flightReservation[i].roomReservation = reservation;
		}
		
		showMessage('Room added to reservation list', "green");
		$('#dialogHotelView').hide();
		$('#selectedHotelRoomsTable').html('<tr><th>Floor number</th><th>Number of beds</th><th>Grade</th><th>Full price</th><th>Select</th></tr>');
		
		$('#reservedRoomTable').html('<tr><th>Hotel</th><th>Room number</th><th>Floor number</th><th>Number of beds</th><th>Price</th></tr>');
		for(var i=0; i<reservation.rooms.length;i++){
			var red = reservation.rooms[i];
			var multi = parseInt($('#roomSearchDayNumber').val())+1;
			var diss = (100 - reservation.discount)/100;
			var myPrice = Math.round(red.price*multi*diss);
			$('#reservedRoomTable tr:last').after(`<tr><td>${reservation.hotel.name}</td><td>${red.roomNumber}</td><td>${red.floor}</td><td>${red.bedNumber}</td><td>${myPrice}</td></tr>`);
		}
		
		
		$('#reservedHotelServicesTable').html('<tr><th>Name</th><th>Price</th></tr>');
		for(var i=0; i<reservation.services.length;i++){
			var red = reservation.services[i];
			var myPrice = Math.round(red.price);
			$('#reservedHotelServicesTable tr:last').after(`<tr><td>${red.name}</td><td>${myPrice}</td></tr>`);
		}
		
		$('#reservationsDiv').show();
		
		
//		$.ajax({
//			type : 'POST',
//			url : "/api/roomReservations",
//			headers: createAuthorizationTokenHeader(),
//			data : JSON.stringify(reservation),
//			success: function(){
//				showMessage('Room reservation successful!', "green");
//				$('#dialogHotelView').hide();
//				$('#selectedHotelRoomsTable').html('<tr><th>Floor number</th><th>Number of beds</th><th>Grade</th><th>Full price</th><th>Select</th></tr>');
//			},
//			error: function (jqXHR, exception) {
//				if (jqXHR.status == 401) {
//					showMessage('Login first!', "orange");
//				}else{
//					showMessage('[' + jqXHR.status + "]  " + exception, "red");
//				}
//			}
//		})
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
		if(start < new Date().getTime()-24*60*60*1000 || end < new Date().getTime()-24*60*60*1000){
			showMessage("Cannot select past date", "orange");
			return;
		}
		console.log("Selected vehicles: ", selected_vehicles);
		var price = calculatePriceVehicle(selected_vehicles, parseInt($('#vehicleSearchDayNumber').val())+1);
		var link = '/api/branchOffice/'+$("#endDestination option:selected" ).val();
		if(selected_vehicles.length == 0) {
			showMessage("Select at least 1 vehicle!", "orange");
			return;
		}
		$.get(link, function(office){
		var reservation = {
			"start": new Date(start),
			"end": new Date(end),
			"vehicles": selected_vehicles,
			"rentACar": selected_vehicles[0].rentACar,
			"price": price,
			"discount": 0,
			"endBranchOffice" : office
		};
		console.log("Vehicle reservation: ", reservation);
		
		bigReservation.vehicleReservation = reservation;
		bigReservation.vehicleReservationType = "regular";
		
		/*var roomPrice = bigReservation.roomReservation.price;
		var vehiclePrice = bigReservation.vehicleReservation.price;
		var flightPrice = 0;
		
		for(var i = 0; i < bigReservation.flightReservation.length; i++)
			flightPrice += bigReservation.flightReservation[i].price;
		
		$("label#priceWithoutDiscount").text(flightPrice + roomPrice + vehiclePrice);
		
		var total = 0;
		
		roomPrice = roomPrice * (100 - bigReservation.roomReservation.hotel.extraServiceDiscount) / 100;
		total = flightPrice + roomPrice + vehiclePrice;
		total = total * (parseInt($("label#bonusPointsDiscount").text()) / 100) * parseInt($("label#userBonusPoints").text());
		
		$("label#totalPrice").text(total);
		$("label#roomServicesDiscount").text(bigReservation.roomReservation.hotel.extraServiceDiscount);
		
		for(var i = 0; i < bigReservation.flightReservation.length; i++) {
			bigReservation.flightReservation[i].vehicleReservation = reservation;
		}
		
		showMessage('Vehicle added to reservation list', "green");
		$('#dialogRentView').hide();
		$('#selectedRentVehiclesTable').html('<tr><th>Brand</th><th>Model</th><th>Type</th><th>Grade</th><th>Full price</th><th>Select</th></tr>');*/

		$('#reservedVehicleTable').html('<tr><th>Rent-a-car</th><th>Model</th><th>Brand</th><th>Type</th><th>Price</th></tr>');
		for(var i=0; i<reservation.vehicles.length;i++){
			var red = reservation.vehicles[i];
			var multi = parseInt($('#vehicleSearchDayNumber').val())+1;
			var diss = (100 - reservation.discount)/100;
			var myPrice = Math.round(red.price*multi*diss);
			$('#reservedVehicleTable tr:last').after(`<tr><td>${reservation.rentACar.name}</td><td>${red.brand}</td><td>${red.model}</td><td>${red.type}</td><td>${myPrice}</td></tr>`);
		}
		
		$('#reservationsDiv').show();
		/*$.ajax({
			type : 'POST',
			url : "/api/vehicleReservations",
			headers: createAuthorizationTokenHeader(),
			data : JSON.stringify(reservation),
			success: function(){
				showMessage('Vehicle reservation successful!', "green");
				$('#dialogRentView').hide();
				$('#selectedRentVehiclesTable').html('<tr><th>Brand</th><th>Model</th><th>Type</th><th>Grade</th><th>Full price</th><th>Select</th></tr>');
			},
			error: function (jqXHR, exception) {
				showMessage('[' + jqXHR.status + "]  " + exception, "red");
			}
		})*/
		});
	});
	
    
    //--------------- RADOJCIN ---------------
    
	var options = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
	
	function formatDateDet(date) {
		return date.toLocaleDateString("en", options) + " " + (date.getHours() < 10 ? "0" + (date.getHours()) : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
	}
	
	getBonusPoints();
	
	function getBonusPoints() {
		$.ajax({
			type: "GET",
			url: "/api/registeredUser/getBonusPoints",
			headers: createAuthorizationTokenHeader(),
			success: function(points) {
				$("label#userBonusPoints").text(points);
			}
		});
	}
	
	getDiscount();
	
	function getDiscount() {
		$.ajax({
			type: "GET",
			url: "/api/discount",
			headers: createAuthorizationTokenHeader(),
			success: function(discount) {
				$("label#bonusPointsDiscount").text(discount.discountPercentage);
			}
		});
	}
	
	var previousSeat = undefined; //Ujedno i trenutno selektovano mesto
	$(document).on("click", "span.close", function() {
		$("div#seatsTableDiv").empty();
		previousSeat = undefined;
		$("input#toggleSeat").attr("disabled", "disabled");
		$("input#deleteSeat").attr("disabled", "disabled");
		$("div#editSeatsModal").hide();
		
		bigReservation = {
			flightReservation: null,
			flights: [],
			roomReservation: null,
			vehicleReservation: null,
			user: null,
			discountPercentageBonusPoints: 0,
			discountHotelService: 0,
			flightReservationType: null,
			roomReservationType: null,
			vehicleReservationType: null,
			bonusPoints: 0
		};
		
		$("label#priceWithoutDiscount").text(0);
		$("label#roomServicesDiscount").text(0);
		$("label#bonusPointsDiscount").text(0);
		$("label#totalPrice").text(0);
		
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
    	var priceRange = parseInt($("input#priceRange").val());
    	var durationRange = parseFloat($("input#durationRange").val());
    	
    	if(passengers == "" || bags == "") {
    		showMessage("Some fields are empty!", "red");
			return;
    	}
    	
    	data = [];
    	
    	var airlineID = $("p#airlineIdField").val();
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
    		"airlineID": parseInt(airlineID),
    		"tripType": tripType,
    		"passengers": parseInt(passengers),
    		"seatClass": seatClass,
    		"bags": parseInt(bags),
    		"priceRange": priceRange,
    		"durationRange": durationRange,
    		"data": data
    	}
    	
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
    					var table = $("<table class='searchResultTable' id='" + index + "'></table>");
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
    var selectedTable = -1;
    $(document).on("click", "input.select", function() {
    	var seatsDiv = $("div#seatsDiv"); //var seatsDiv = $("<div id='seatsDiv' style='text-align: center; height: " + ((data.length / 3) * 55) + "px;'></div>");
    	seatsDiv.empty();
    	
    	selectedFlight = $(this).parent().parent().attr("id");
    	
    	selectedTable = $(this).parent().parent().parent().parent().attr("id");
    	
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
    	
    	$.ajax({
    		type: "GET",
    		url: "/api/registeredUser/allFriends",
    		headers: createAuthorizationTokenHeader(),
    		success: function(friends) {
    			var inviteFriendsTable = $("table#inviteFriendsTable tbody");
    			inviteFriendsTable.empty();
    			
    			$.each(friends, function(index, friend) {
    				var tr = $("<tr id='" + friend.id + "'><td>" + friend.firstName + "</td> <td>" + friend.lastName + "</td> <td><input type='text' class='friendPassportNumber'></td> <td><input type='button' class='inviteFriend' value='Invite' disabled></td></tr>");
    				
    				inviteFriendsTable.append(tr);
    			});
    		}
    	});
    	
    	$.ajax({
    		type: "GET",
    		url: "/flight/" + selectedFlight + "/luggagePricelist",
    		headers: createAuthorizationTokenHeader(),
    		success: function(pricelist) {
    			var flightServicesTable = $("table#flightServicesTable tbody");
    			flightServicesTable.empty();
    			
    			$.each(pricelist, function(index, item) {
    				var tr = $("<tr id='" + item.id + "'><td>" + item.dimensions + "</td> <td>" + item.weight + "</td> <td>" + item.price + "</td> <td><input type='checkbox' class='flightServiceCheck'></td></tr>");
    				
    				flightServicesTable.append(tr);
    			});
    		}
    	});
    });
    
    var passengerIndex = 1;
    var selectedSeats = [];
	$(document).on("click", "div.seatDivForReservation", function() {
		if($(this).css("background-color") == "rgb(58, 58, 58)" || $(this).css("background-color") == "rgb(255, 0, 0)")
			return;
		
		var seatId = $($(this).children("input")[0]).attr("value");
		
		var exists = false;
		for(var i = 0; i < selectedSeats.length; i++) {
			if(selectedSeats[i] == seatId) {
				selectedSeats.splice(i, 1);
				bigReservation.flightReservation.splice(i, 1);
				if(bigReservation.flightReservation.length == 0) {
					bigReservation = {
						flightReservation: null,
						flights: [],
						roomReservation: null,
						vehicleReservation: null,
						user: null,
						discountPercentageBonusPoints: 0,
						discountHotelService: 0,
						flightReservationType: null,
						roomReservationType: null,
						vehicleReservationType: null,
						bonusPoints: 0
					};
				}
				
				$.ajax({
					type: "GET",
					url: "/flight/" + selectedFlight,
					headers: createAuthorizationTokenHeader(),
					success: function(flight) {
						$.ajax({
							type: "GET",
							url: "/seats/" + parseInt(seatId),
							success: function(seat) {
								var price = 0;
								
								if(seat.type == "FIRST_CLASS")
									price = flight.ticketPriceFirstClass;
								else if(seat.type == "BUSINESS")
									price = flight.ticketPriceBusinessClass;
								else
									price = flight.ticketPriceEconomyClass;
								
								$("label#priceWithoutDiscount").text(parseInt($("label#priceWithoutDiscount").text()) - price);
								$("label#totalPrice").text(parseInt($("label#totalPrice").text()) - price);
							}
						});
					}
				});
				
				$(this).css("border", "0");
				
				exists = true;
				
				if(selectedSeats.length == 0) {
					$("input#makeFlightReservation").attr("disabled", "disabled");
					$("button#chooseServicesTab").attr("disabled", "disabled");
					$("input.flightServiceCheck").prop("checked", false);
				}
				else if(selectedSeats.length < 2) {
					$("button#inviteFriendsTab").attr("disabled", "disabled");
					$("button#otherPassengersTab").attr("disabled", "disabled");
					$("input#makeFlightReservation").removeAttr("disabled");
				}
				
				break;
			}
		}
		
		if(!exists) {
			selectedSeats.push(parseInt(seatId));
			$("input#inviteFriend").removeAttr("disabled");
			
			$.ajax({
				type: "GET",
				url: "/flight/" + selectedFlight,
				headers: createAuthorizationTokenHeader(),
				success: function(flight) {
					$.ajax({
						type: "GET",
						url: "/seats/" + parseInt(seatId),
						//headers: createAuthorizationTokenHeader(),
						success: function(seat) {
							var price = 0;
							
							if(seat.type == "FIRST_CLASS")
								price = flight.ticketPriceFirstClass;
							else if(seat.type == "BUSINESS")
								price = flight.ticketPriceBusinessClass;
							else
								price = flight.ticketPriceEconomyClass;
							
							var reservation = {
								"user": null,
								"passenger": null,
								"flight": flight,
								"seat": seat,
								"passportNumber": null,
								"dateOfPurchase": new Date(),
								"luggages": [],
								"price": price,
								"discount": 0,
								"roomReservation": null,
								"vehicleReservation": null
							};
							
							var check = false;
							for(var i = 0; i < bigReservation.flights.length; i++) {
								if(bigReservation.flights[i].id == flight.id || (bigReservation.flights[i].from.id == flight.to.id && bigReservation.flights[i].to.id == flight.from.id)) {
									check = true;
									break;
								}
							}
							
							var flightReservationsTable = $("table#flightReservations tbody");
							
							if(!check) {
								bigReservation.flightReservation = null;
								bigReservation.flights = [];
								passengerIndex = 1;
								flightReservationsTable.empty();
							}
							
							if(bigReservation.flightReservation == null || bigReservation.flightReservation == undefined) {
								bigReservation.flightReservation = [];
								flightReservationsTable.empty();
							}
							
							bigReservation.flightReservation.push(reservation);
							bigReservation.flightReservationType = "regular";
							
							$("label#priceWithoutDiscount").text(parseInt($("label#priceWithoutDiscount").text()) + price);
							$("label#totalPrice").text(parseInt($("label#totalPrice").text()) + price);
							
							bigReservation.flights[selectedTable] = flight;
						}
					});
				}
			});
			
			$(this).css("border", "2px solid red");
			
			$("label#freePassengers").text(parseInt($("label#freePassengers").text()) + 1);
			
			$("input#makeFlightReservation").removeAttr("disabled");
			$("button#chooseServicesTab").removeAttr("disabled");
			if(selectedSeats.length > 1) {
				$("button#inviteFriendsTab").removeAttr("disabled");
				$("button#otherPassengersTab").removeAttr("disabled");
				$("input#makeFlightReservation").attr("disabled", "disabled");
			}
		}
	});
	
	$(document).on("change", "input.flightServiceCheck", function() {
		var luggageID = $(this).parent().parent().attr("id");
		
		if($(this).is(":checked")) {
			$.ajax({
				type: "GET",
				url: "/luggage/" + luggageID,
				success: function(luggage) {
					bigReservation.flightReservation[0].luggages.push(luggage);
					
					$("label#priceWithoutDiscount").text(parseInt($("label#priceWithoutDiscount").text()) + luggage.price);
					$("label#totalPrice").text(parseInt($("label#totalPrice").text()) + luggage.price);
				}
			});
		} else {
			for(var i = 0; i < bigReservation.flightReservation[0].luggages.length; i++) {
				if(bigReservation.flightReservation[0].luggages[i].id == luggageID) {
					bigReservation.flightReservation[0].luggages.splice(i, 1);
					
					$("label#priceWithoutDiscount").text(parseInt($("label#priceWithoutDiscount").text()) - luggage.price);
					$("label#totalPrice").text(parseInt($("label#totalPrice").text()) - luggage.price);
					
					break;
				}
			}
		}
	});
	
    $(document).on("input", "input.friendPassportNumber", function() {
    	if($(this).val() == "")
    		$(this).parent().parent().find("input.inviteFriend").attr("disabled", "disabled");
    	else
    		$(this).parent().parent().find("input.inviteFriend").removeAttr("disabled");
    });
    
    $(document).on("click", "input.inviteFriend", function() {
    	$("label#freePassengers").text(parseInt($("label#freePassengers").text()) - 1);
    	var friendID = $(this).parent().parent().attr("id");
    	var friendPassportNumber = $(this).parent().parent().find("input.friendPassportNumber").val();
    	var btn = $(this);
    	
    	$.ajax({
    		type: "GET",
    		url: "/api/registeredUser/" + friendID,
    		headers: createAuthorizationTokenHeader(),
    		success: function(friend) {
    			bigReservation.flightReservation[passengerIndex].passportNumber = friendPassportNumber;
    			bigReservation.flightReservation[passengerIndex].user = friend;
    			
    			passengerIndex += 1;
    	    	$("label#indexOfPassenger").text(parseInt($("label#indexOfPassenger").text()) + 1);
    	    	btn.attr("disabled", "disabled");
    	    	
    	    	if(passengerIndex == selectedSeats.length) {
    	    		$("input#makeFlightReservation").removeAttr("disabled");
    	    		$("input#nextPassenger").attr("disabled", "disabled");
    	    	}
    	    	else
    	    		$("input#makeFlightReservation").attr("disabled", "disabled");
    		}
    	});
    });
    
    $("input#nextPassenger").click(function() {
    	var passengerFirstName = $("input#passengerFirstName").val();
    	var passengerLastName = $("input#passengerLastName").val();
    	var passengerPassportNumber = $("input#passengerPassportNumber").val();
    	
    	var passenger = {
    		"firstName": passengerFirstName,
    		"lastName": passengerLastName
    	};
    	
    	bigReservation.flightReservation[passengerIndex].passportNumber = passengerPassportNumber;
		bigReservation.flightReservation[passengerIndex].passenger = passenger;
    	
    	passengerIndex += 1;
    	$("label#indexOfPassenger").text(parseInt($("label#indexOfPassenger").text()) + 1);
    	
    	$("input#passengerFirstName").val("");
    	$("input#passengerLastName").val("");
    	$("input#passengerPassportNumber").val("");
    	
    	if(passengerIndex == selectedSeats.length) {
    		$("input#makeFlightReservation").removeAttr("disabled");
    		$(this).attr("disabled", "disabled");
    	}
    	else
    		$("input#makeFlightReservation").attr("disabled", "disabled");
    });
	
	$("input#makeFlightReservation").click(function() {
		showMessage("Flight reservation added to current reservations.", "green");
		
		selectedSeats.forEach(function(seatID) {
			$("div.seatDivForReservation#" + seatID).css("background-color", "red");
			$("div.seatDivForReservation#" + seatID).css("border", "0");
		});
		
		$("input#makeFlightReservation").attr("disabled", "disabled");
		$("div#seatsDiv").empty();
		selectedSeats = [];
		$("div#reservationSeatsModal").hide();
		
		$("button#makeHotelReservationBtn").removeAttr("disabled");
		$("button#makeRentReservationBtn").removeAttr("disabled");
	});
	
	$("button#saveTickets").click(function() {
		$("table.searchResultTable").remove();
		$("div#dialogAirlineView").hide();
		bigReservation.roomReservation = null;
		bigReservation.vehicleReservation = null;
		bigReservation.roomReservationType = null;
		bigReservation.vehicleReservationType = null;
		
		for(var i = 0; i < bigReservation.flights.length; i++) {
			var flightTickets = 0;
			var flightTicketsPrice = 0;
			for(var j = 0; j < bigReservation.flightReservation.length; j++) {
				if(bigReservation.flightReservation[j].flight.id == bigReservation.flights[i].id) {
					flightTickets++;
					if(bigReservation.flightReservation[j].seat.type == "BUSINESS")
						flightTicketsPrice += bigReservation.flights[i].ticketPriceBusinessClass;
					else if(bigReservation.flightReservation[j].seat.type == "ECONOMY")
						flightTicketsPrice += bigReservation.flights[i].ticketPriceEconomyClass;
					else
						flightTicketsPrice += bigReservation.flights[i].ticketPriceFirstClass;
				}
			}
			
			var tr = $("<tr><td>" + bigReservation.flights[i].from.destination.name + "</td> <td>" + bigReservation.flights[i].to.destination.name + "</td> <td>" + formatDateDet(new Date(bigReservation.flights[i].departureDate)) + "</td> <td>" + formatDateDet(new Date(bigReservation.flights[i].arrivalDate)) + "</td> <td>" + flightTickets + "</td> <td>" + flightTicketsPrice + "</td></tr>");
			$("table#flightReservations").append(tr);
		}
		
		$("label#totalPrice").text(flightTicketsPrice * (100 - parseInt($("label#bonusPointsDiscount").text())) / 100);
		
		$("div#reservationsDiv").show();
	});
	
	$("button#quitDialogAirlineView").click(function() {
    	$("table#quickFlightReservationsTable tbody").empty();
    	$("table.searchResultTable").remove();
    	$("div#dialogAirlineView").hide();
    	selectedAirline = undefined;
    });
	
	$(document).on("click", "button", function(e) {
		
		 if(e.target.id.startsWith("airlineDetailsBtn")){
	            selectedAirline = e.target.id.substr(17);
	            $("#airlineIdField").val(selectedAirline);
		
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
				table.empty();
				
				$.each(reservations, function(index, reservation) {
					var tr = $("<tr id='" + reservation.id + "'><td>" + reservation.flight.from.name + "</td> <td>" + reservation.flight.to.name + "</td> <td>" + formatDateDet(new Date(reservation.flight.departureDate)) + "</td> <td>" + formatDateDet(new Date(reservation.flight.arrivalDate)) + "</td> <td>[" + reservation.seat.seatRow + ":" + reservation.seat.number + "]</td> <td>" + reservation.price + "</td> <td>" + reservation.discount + "</td> <td><input type='button' class='takeAReservation' value='Take it'></td></tr>");
					
					table.append(tr);
				});
			}
		});
	}});
	
	$(document).on("click", "input.takeAReservation", function() {
		var tr = $(this).parent().parent();
		var reservationID = tr.attr("id");
		
		$.ajax({
			type: "GET",
			url: "/api/flightReservation/getQuickReservation/" + reservationID,
			headers: createAuthorizationTokenHeader(),
			success: function(reservation) {
				bigReservation.flightReservation = [reservation];
				bigReservation.flightReservationType = "quick";
				bigReservation.flights = [];
				bigReservation.flights.push(reservation.flight);
				
				bigReservation.roomReservation = null;
				bigReservation.vehicleReservation = null;
				bigReservation.roomReservationType = null;
				bigReservation.vehicleReservationType = null;
				
				selectedTable = -1;
				passengerIndex = 1;
				
				var flightReservationsTable = $("table#flightReservations tbody");
				flightReservationsTable.empty();
				
				var price = 0;
				if(reservation.seat.type == "FIRST_CLASS")
					price = reservation.flight.ticketPriceFirstClass;
				else if(reservation.seat.type == "BUSINESS")
					price = reservation.flight.ticketPriceBusinessClass;
				else
					price = reservation.flight.ticketPriceEconomyClass;
				
				var tr = $("<tr><td>" + reservation.flight.from.destination.name + "</td> <td>" + reservation.flight.to.destination.name + "</td> <td>" + formatDateDet(new Date(reservation.flight.departureDate)) + "</td> <td>" + formatDateDet(new Date(reservation.flight.arrivalDate)) + "</td> <td>1</td> <td>" + price + "</td></tr>");
				flightReservationsTable.append(tr);
				
				$("label#priceWithoutDiscount").text(parseInt($("label#priceWithoutDiscount").text()) + (price * (100 - reservation.discount)/100));
				$("label#totalPrice").text(parseInt($("label#totalPrice").text()) + (price * (100 - reservation.discount)/100));
				
				$.ajax({
					type: "GET",
					url: "/api/registeredUser/getBonusPoints",
					headers: createAuthorizationTokenHeader(),
					success: function(points) {
						$("label#userBonusPoints").text(points);
					}
				});
				
				showMessage("Flight reservation added to current reservations.", "green");
				
				selectedSeats.forEach(function(seatID) {
					$("div.seatDivForReservation#" + seatID).css("background-color", "red");
					$("div.seatDivForReservation#" + seatID).css("border", "0");
				});
				
				$("input#makeFlightReservation").attr("disabled", "disabled");
				$("div#seatsDiv").empty();
				$("table#quickFlightReservationsTable tbody").empty();
				selectedSeats = [];
				$("div#reservationSeatsModal").hide();
				$("div#dialogAirlineView").hide();
				
				$("button#makeHotelReservationBtn").removeAttr("disabled");
				$("button#makeRentReservationBtn").removeAttr("disabled");
				
				$("div#reservationsDiv").show();
			}
		});
		
		/*$.ajax({
			type: "PUT",
			url: "/api/flightReservation/buyQuickTicket/" + reservationID,
			headers: createAuthorizationTokenHeader(),
			success: function(response) {
				showMessage(response, "green");

				tr.remove();
			},
			error: function(response) {
				showMessage('error','red');
			}
		});*/
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
								
								$.ajax({
									type: "GET",
									url: "/api/registeredUser/allFriends",
									headers: createAuthorizationTokenHeader(),
									success: function(friends) {
										$.each(friends, function(index, friend) {
											if(user.id == friend.id) {
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
												}
											});
										}
									}
								});
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
	
	$(document).on("click", "input.unfriend", function() {
		var userID = $(this).parent().parent().attr("id");
		var btn = $(this);
		
		$.ajax({
			type: "DELETE",
			url: "/api/registeredUser/removeFriend/" + userID,
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
			url: "/api/registeredUser/updateProfile",
			headers: createAuthorizationTokenHeader(),
			data: JSON.stringify(admin),
			success: function() {
				showMessage("Profile successfully saved.", "green");
			}
		});
		
		$("div#dialogProfile").hide();
	});
	
	$(document).on('click', "#closeProfileDialog", function(){
		$("#dialogProfile").hide();
	})
	
	$("input#bonusPoints").on("input", function() {
		$("label#totalPrice").text(parseInt($("label#totalPrice").text()) * (100 - $("label#bonusPointsDiscount").text()) / 100);
		
		if($("input#bonusPoints").val() > parseInt($("label#userBonusPoints").text())) {
			showMessage("You don't have enough bonus points.", "orange");

			$("button#saveReservations").attr("disabled", "disabled");
		} else if($("input#bonusPoints").val() < 0){
			showMessage("Bonus points can't be less than zero.", "orange");

			$("button#saveReservations").attr("disabled", "disabled");
		}
	});
	
	$("button#saveReservations").click(function() {
		if($("input#bonusPoints").val() == "") {
			showMessage("Bonus points can't be empty.", "orange");
			return;
		} else if($("input#bonusPoints").val() > parseInt($("label#userBonusPoints").text())) {
			showMessage("You don't have enough bonus points.", "orange");
			return;
		}
		//Postaviti novu max granicu za bonus poene i promeniti vrednost labele
				
		if(bigReservation.roomReservation != null) {
			if(bigReservation.roomReservationType == "regular"){
				roomReservationREGULAR();
			}else{
				roomReservationQUICK();
			}
		}else if(bigReservation.vehicleReservation != null) {
			if(bigReservation.vehicleReservationType == "regular"){
				vehicleReservationREGULAR();
			}else{
				vehicleReservationQUICK();
			}
		}else if(bigReservation.flightReservation != null) {
			if(bigReservation.flightReservationType == "regular"){
				flightReservationREGULAR();
			}else{
				flightReservationQUICK();
			}
		}
	});
	
    //----------------------------------------
});

var roomReservationREGULAR = function(){
	$.ajax({
		type: "POST",
		url: "/api/roomReservations",
		headers: createAuthorizationTokenHeader(),
		data: JSON.stringify(bigReservation.roomReservation),
		success: function(roomReservation){
			for(var i=0;i<bigReservation.flightReservation.length;i++){
				bigReservation.flightReservation[i].roomReservation = roomReservation;
			}
			if(bigReservation.vehicleReservation != null) {
				if(bigReservation.vehicleReservationType == "regular"){
					vehicleReservationREGULAR();
				}else{
					vehicleReservationQUICK();
				}
			}else{
				if(bigReservation.flightReservationType == "regular")
					flightReservationREGULAR();
				else{
					flightReservationQUICK();
				}
			}
		}
	});
}

var roomReservationQUICK = function(){
	$.ajax({
		type: "GET",
		url: "/api/reserveQuickRoomReservation/" + bigReservation.roomReservation.id,
		headers: createAuthorizationTokenHeader(),
		success: function(roomReservation){
			for(var i=0;i<bigReservation.flightReservation.length;i++){
				bigReservation.flightReservation[i].roomReservation = roomReservation;
			}
			if(bigReservation.vehicleReservation != null) {
				if(bigReservation.vehicleReservationType == "regular"){
					vehicleReservationREGULAR();
				}else{
					vehicleReservationQUICK();
				}
			}else{
				if(bigReservation.flightReservationType == "regular")
					flightReservationREGULAR();
				else{
					flightReservationQUICK();
				}
			}
		}
	});
}

var vehicleReservationREGULAR = function(){
	$.ajax({
		type: "POST",
		url: "/api/vehicleReservations",
		headers: createAuthorizationTokenHeader(),
		data: JSON.stringify(bigReservation.vehicleReservation),
		success: function(vehicleReservation){
			for(var i=0;i<bigReservation.flightReservation.length;i++){
				bigReservation.flightReservation[i].vehicleReservation = vehicleReservation;
			}
			if(bigReservation.flightReservationType == "regular")
				flightReservationREGULAR();
			else{
				flightReservationQUICK();
			}
		}
	});
}

var vehicleReservationQUICK = function(){
	$.ajax({
		type: "GET",
		url: "/api/reserveQuickVehicleReservation/" + bigReservation.vehicleReservation.id,
		headers: createAuthorizationTokenHeader(),
		success: function(vehicleReservation){
			for(var i=0;i<bigReservation.flightReservation.length;i++){
				bigReservation.flightReservation[i].vehicleReservation = vehicleReservation;
			}
			if(bigReservation.flightReservationType == "regular")
				flightReservationREGULAR();
			else{
				flightReservationQUICK();
			}
		}
	});
}

var flightReservationREGULAR = function(){
	$.ajax({
		type: "POST",
		url: "/api/flightReservation/save",
		headers: createAuthorizationTokenHeader(),
		data: JSON.stringify(bigReservation.flightReservation),
		success: function(){
			$("table#flightReservations tbody").empty();
			$("table#reservedRoomTable").html(`<tr><th>Hotel</th><th>Room number</th><th>Floor number</th><th>Number of beds</th><th>Arrival date</th><th>Departure date</th><th>Price</th></tr>`);
			$("table#reservedHotelServicesTable").html(`<tr><th>Name</th><th>Price</th></tr>`);
			$("table#reservedVehicleTable").html(`<tr><th>Rent-a-car</th><th>Model</th><th>Brand</th><th>Type</th><th>Start date</th><th>End date</th><th><th>Price</th></tr>`);
			bigReservation = {
				flightReservation: null,
				flights: [],
				roomReservation: null,
				vehicleReservation: null,
				user: null,
				discountPercentageBonusPoints: 0,
				discountHotelService: 0,
				flightReservationType: null,
				roomReservationType: null,
				vehicleReservationType: null,
				bonusPoints: 0
			};
			selectedTable = -1;
			passengerIndex = 1;
			
			$("label#priceWithoutDiscount").text(0);
			$("label#roomServicesDiscount").text(0);
			$("label#bonusPointsDiscount").text(0);
			$("label#totalPrice").text(0);
			
			$("button#makeHotelReservationBtn").attr("disabled", "disabled");
			$("button#makeRentReservationBtn").attr("disabled", "disabled");
			
			$("div#reservationsDiv").hide();
			
			showMessage("Reservations successfully created.", "green");
		}
	});
}

var flightReservationQUICK = function(){
	$.ajax({
		type: "PUT",
		url: "/api/flightReservation/buyQuickTicket",
		headers: createAuthorizationTokenHeader(),
		data: JSON.stringify(bigReservation.flightReservation[0]),
		success: function(){
			$("table#flightReservations tbody").empty();
			$("table#reservedRoomTable").html(`<tr><th>Hotel</th><th>Room number</th><th>Floor number</th><th>Number of beds</th><th>Arrival date</th><th>Departure date</th><th>Price</th></tr>`);
			$("table#reservedHotelServicesTable").html(`<tr><th>Name</th><th>Price</th></tr>`);
			$("table#reservedVehicleTable").html(`<tr><th>Rent-a-car</th><th>Model</th><th>Brand</th><th>Type</th><th>Start date</th><th>End date</th><th><th>Price</th></tr>`);
			bigReservation = {
				flightReservation: null,
				flights: [],
				roomReservation: null,
				vehicleReservation: null,
				user: null,
				discountPercentageBonusPoints: 0,
				discountHotelService: 0,
				flightReservationType: null,
				roomReservationType: null,
				vehicleReservationType: null,
				bonusPoints: 0
			};
			selectedTable = -1;
			passengerIndex = 1;
			
			$("label#priceWithoutDiscount").text(0);
			$("label#roomServicesDiscount").text(0);
			$("label#bonusPointsDiscount").text(0);
			$("label#totalPrice").text(0);
			
			$("button#makeHotelReservationBtn").attr("disabled", "disabled");
			$("button#makeRentReservationBtn").attr("disabled", "disabled");
			
			$("div#reservationsDiv").hide();
			
			showMessage("Reservations successfully created.", "green");
		}
	});
}

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
    
    /*if(text == ""){
        displayAirlines();
        return;
    }*/
    
    $.get('/api/airlinesSearch/'+text, function(airlines){
    	 globalAirline = ailines;	
    	 $('#serviceContainer').html('');
         $("#searchSortContainer").html('');
         $(`<div class="VelikiPregled">  <input type="text" id="airlineSearchInput"> <button id="airlineSearchBtn" value="Search airlines">Search</button>
 	        <br><br>
 	        <select id="sortCriteriaAirline">
 			<option value="name">Name</option>
 			<option value="destination">Destination</option>
 			</select>
 			<button id="sortAirlineBtn">Sort</button></div>`).appendTo("#searchSortContainer");
         $.get({url :"/api/reservedAirlines",
 			headers: createAuthorizationTokenHeader()},  function(reserved){
 		console.log(reserved);
         for(var i=0;i<airlines.length;i++){
             var red = airlines[i];
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
 				  <ul id=${red.id}Airline>
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
 				</div></section>`	;
             var check = 0;
             for(var k=0; k<reserved.length; k++){
             	if(reserved[k].id == airlines[i].id){
             		check=1;
             		break;
             	}
             }
             var rate = "";
             if(check == 1){
             	rate = "<button id='rateAirline"+ red.id+"'>Rate</button>"
             }
             $(`<div class='listItem'><div class="imagePreview"></div><div style="float: left; margin-left:15px;"><h2 style="margin-left:-15px;">${red.name}</h2><p>${red.destination.address} (${red.destination.name},
             ${red.destination.country})</p><p>${red.description}</p><p>${forGrade}</p></div><div class="mapButtonPreview">
             <button id=${locationID}>Show on map</button><button id=${detailViewButtonID}>More details</button>${rate}</div></div>`).appendTo("#serviceContainer");
             var onStar = grade;
  	    	 var stars = $('.li.star');
  	    	 console.log("AAAA", onStar);
  	    	 $("#"+red.id+"Airline li").each(function() {
  	    	 	$(this).removeClass('selected');
  	   		 })  
  	   		 var k = 0;
  	    	 $("#"+red.id+"Airline li").each(function() {
  	    		if(k<onStar){
  	    			$(this).addClass('selected');
  	    			k++;
  	    		}
  	    		else
  	    			return false;
  	   		 })
         }
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
    $("#sortHotelBtn").removeAttr("disabled");
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
    $.get('/api/hotelsSearch/'+text, function(data){
        console.log("Hotels: ", data);
        hotels = data;
        globalHotel = data;
        $.get({url :"/api/reservedHotels",
            headers: createAuthorizationTokenHeader()},  function(reserved){
        $('#serviceContainer').html('');
        for(var i=0;i<hotels.length;i++){
            var red = hotels[i];
            var locationID = "mapLocationHotel" + red.id;
            var detailViewButtonID = "hotelDetailViewBtn" + red.id;
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
				  <ul id=${red.id}Hotel>
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
				</div></section>`;
            var check = 0;
            for(var k=0; k<reserved.length; k++){
            	if(reserved[k].id == hotels[i].id){
            		check=1;
            		break;
            	}
            }
            var rate = "";
            if(check == 1){
            	rate = "<button id='rateHotel"+ red.id+"'>Rate</button>"
            }
            $(`<div class='listItem'><div class="imagePreview2"></div><div style="float: left; margin-left:15px;"><h2 style="margin-left:-15px;">${red.name}</h2><p>${red.destination.address} (${red.destination.name},
            ${red.destination.country})</p><p>${red.description}</p><p>${forGrade}</p></div><div class="mapButtonPreview">
            <button id=${locationID}>Show on map</button><button id=${detailViewButtonID}>More details</button>${rate}</div></div>`).appendTo("#serviceContainer");
            var onStar = grade;
 	    	var stars = $('.li.star');
 	    	console.log("AAAA", onStar);
 	    	$("#"+red.id+"Hotel li").each(function() {
 	    		$(this).removeClass('selected');
 	   		})
 	   		var k = 0;
 	    	$("#"+red.id+"Hotel li").each(function() {
 	    		if(k<onStar){
 	    			$(this).addClass('selected');
 	    			k++;
 	    		}
 	    		else
 	    			return false;
 	   		 })
        }
       })
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
    $("sortRentBtn").removeAttr("disabled");
    console.log(checkIn, checkOut);
    if(rentName == ""){
        rentName = "NO_INPUT";
    }
    if(rentDestination == ""){
        rentDestination = "NO_INPUT";
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
    text = rentName+"/"+rentDestination+"/"+checkInTS+"/"+checkOutTS;
    $.get('/api/rentsSearch/'+text, function(data){
        console.log("Rent-a-cars: ", data);
        globalRent = data;
        rents = data;
        $.get({url :"/api/reservedRents",
            headers: createAuthorizationTokenHeader()},  function(reserved){
        $('#serviceContainer').html('');
		for(var i=0;i<rents.length;i++){
            var red = rents[i];
            var locationID = "mapLocationRent" + red.id;
            var detailViewButtonID = "rentDetailViewBtn" + red.id;
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
				  <ul id=${red.id}Rent>
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
				</div></section>`;	
            var check = 0;
            for(var k=0; k<reserved.length; k++){
            	if(reserved[k].id == rents[i].id){
            		check=1;
            		break;
            	}
            }
            var rate = "";
            if(check == 1){
            	rate = "<button id='rateRent"+ red.id+"'>Rate</button>"
            }
            $(`<div class='listItem'><div class="imagePreview3"></div><div style="float: left; margin-left:15px;"><h2 style="margin-left:-15px;">${red.name}</h2><p>${red.destination.address} (${red.destination.name},
            ${red.destination.country})</p><p>${red.description}</p><p>${forGrade}</p></div><div class="mapButtonPreview">
            <button id=${locationID}>Show on map</button><button id=${detailViewButtonID}>More details</button>${rate}</div></div>`).appendTo("#serviceContainer");
            var onStar = grade;
 	    	var stars = $('.li.star');
 	    	console.log("AAAA", onStar);
 	    	$("#"+red.id+"Rent li").each(function() {
 	    		$(this).removeClass('selected');
 	   		})
 	   		var k = 0;
 	    	$("#"+red.id+"Rent li").each(function() {
 	    		if(k<onStar){
 	    			$(this).addClass('selected');
 	    			k++;
 	    		}
 	    		else
 	    			return false;
 	   		 });
		}
        
        })
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
	console.log("quick vehicle res", reservations);
	$('#quickVehicleReservationsTable').html(`<tr><th>Start Date</th><th>End Date</th><th>Cars</th><th>Motocycles</th><th>Original price</th><th>Discount (%)</th><th>Start Destination</th><th>End Destination</th><th></th></tr>`);
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
        }
        console.log(cars, motocycles);
        buttonID = "quickVehicleReservationNumber"+ red.id;
        console.log("-->", red);
        var resStart = stringToDate(red.start);
        var resEnd = stringToDate(red.end);
        var searchStart = stringToDate($('#rentSearchCheckIn').val());
        var searchEnd = stringToDate($('#rentSearchCheckOut').val());
        var myPrice = Math.round(red.price);
        if(bigReservation.flightReservation != null){
        	console.log(red.start);
        	console.log($('#rentSearchCheckIn').val())
        	console.log(red.start == $('#rentSearchCheckIn').val());
        	console.log(red.end);
        	console.log($('#rentSearchCheckOut').val())
        	console.log(red.end == $('#rentSearchCheckOut').val());
        	if(resStart >= searchStart && resEnd <= searchEnd){
        		if(bigReservation.vehicleReservation != null){
        			if(bigReservation.vehicleReservation.id == red.id){
        				continue;
        			}
        		}
        		$('#quickVehicleReservationsTable tr:last').after(`<tr><td>${displayDateFormat(red.start)}</td><td>${displayDateFormat(red.end)}</td><td>${cars}</td><td>${motocycles}</td><td>${myPrice}</td><td>${red.discount} %</td><td>${red.vehicles[0].branchOffice.destination.name}</td><td>${red.endBranchOffice.destination.address}</td>
                <td><button id=${buttonID}>Add to reservation list</button></td></tr>`);
        	}
        }else{
        	$('#quickVehicleReservationsTable tr:last').after(`<tr><td>${displayDateFormat(red.start)}</td><td>${displayDateFormat(red.end)}</td><td>${cars}</td><td>${motocycles}</td><td>${myPrice}</td><td>${red.discount} %</td><td>${red.vehicles[0].branchOffice.destination.name}</td><td>${red.endBranchOffice.destination.address}</td>
            <td></td></tr>`);
        	}
        }
};

var renderQuickRoomReservations = function(reservations){
	$('#quickRoomReservationsTable').html(`<tr><th>Arrival Date</th><th>Departure Date</th><th>2 bed rooms</th><th>3 bed rooms</th><th>4 bed rooms</th><th>Original price</th><th>Sale (%)</th><th></th></tr>`);
    for(var i=0;i<reservations.length;i++){
        var red = reservations[i];
        console.log(">>>>>>> RED: ", red);
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
        var resStart = stringToDate(red.start);
        var resEnd = stringToDate(red.end);
        var searchStart = stringToDate($('#hotelSearchCheckIn').val());
        var searchEnd = stringToDate($('#hotelSearchCheckOut').val());
        console.log("Res start: ", resStart);
        console.log("Res end: ", resEnd);
        console.log("Search start: ", searchStart);
        console.log("Search end: ", searchEnd);
        var myPrice = Math.round(red.price);
        if(bigReservation.flightReservation != null){
        	if(resStart >= searchStart && resEnd <= searchEnd){
        		if(bigReservation.roomReservation != null){
        			if(bigReservation.roomReservation.id == red.id){
        				continue;
        			}
        		}
        		$('#quickRoomReservationsTable tr:last').after(`<tr><td>${displayDateFormat(red.start)}</td><td>${displayDateFormat(red.end)}</td><td>${bed2}</td><td>${bed3}</td><td>${bed4}</td><td>${myPrice}</td>
                <td>${red.discount} %</td><td><button id=${buttonID}>Add to reservation list</button></td></tr>`);
        	}
        }else{
        	$('#quickRoomReservationsTable tr:last').after(`<tr><td>${displayDateFormat(red.start)}</td><td>${displayDateFormat(red.end)}</td><td>${bed2}</td><td>${bed3}</td><td>${bed4}</td><td>${myPrice}</td>
            <td>${red.discount} %</td><td></td></tr>`);
        }
        
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
	console.log("PRICE: ", rooms, services, days);
	for(var i=0;i<rooms.length;i++){
		price += (days * rooms[i].price);
	}
	console.log("PRICE AFTER ROOMS: ", price);
	for(var i=0;i<services.length;i++){
		price += services[i].price;
	}
	console.log("PRICE AFTER SERVICES: ", price);
	return price;
}

function calculatePriceVehicle(vehicles, days){
	price = 0;
	for(var i=0;i<vehicles.length;i++){
		price += (days * vehicles[i].price);
	}
	return price;
}


var displayAirlines = function(){
	console.log("Ejjj");
    $.get("/api/airlines", function(airlines){
        console.log("Airlines: ", airlines);
        $('#serviceContainer').html('');
        $("#searchSortContainer").html('');
        $(`<div class="VelikiPregled">  <input type="text" id="airlineSearchInput"> <button id="airlineSearchBtn" value="Search airlines">Search</button>
	        <br><br>
	        <select id="sortCriteriaAirline">
			<option value="name">Name</option>
			<option value="destination">Destination</option>
			</select>
			<button id="sortAirlineBtn">Sort</button></div>`).appendTo("#searchSortContainer");
        $.get({url :"/api/reservedAirlines",
			headers: createAuthorizationTokenHeader()},  function(reserved){
		console.log(reserved);
        for(var i=0;i<airlines.length;i++){
            var red = airlines[i];
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
				  <ul id=${red.id}Airline>
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
				</div></section>`;	
            var check = 0;
            for(var k=0; k<reserved.length; k++){
            	if(reserved[k].id == airlines[i].id){
            		check=1;
            		break;
            	}
            }
            var rate = "";
            if(check == 1){
            	rate = "<button id='rateAirline"+ red.id+"'>Rate</button>"
            }
            $(`<div class='listItem'><div class="imagePreview"></div><div style="float: left; margin-left:15px;"><h2 style="margin-left:-15px;">${red.name}</h2><p>${red.destination.address} (${red.destination.name},
            ${red.destination.country})</p><p>${red.description}</p><p>${forGrade}</p></div><div class="mapButtonPreview">
            <button id=${locationID}>Show on map</button><button id=${detailViewButtonID}>More details</button>${rate}</div></div>`).appendTo("#serviceContainer");
            var k = 0;
            var onStar = grade;
 	    	var stars = $('.li.star');
 	    	console.log("AAAA", onStar);
 	    	$("#"+red.id+"Airline li").each(function() {
 	    		$(this).removeClass('selected');
 	   		})  
 	    	$("#"+red.id+"Airline li").each(function() {
 	    		if(k<onStar){
 	    			$(this).addClass('selected');
 	    			k++;
 	    		}
 	    		else
 	    			return false;
 	   		 })
        }
    });})
}

var displayHotels = function(){
	console.log(bigReservation);
    $.get("/api/hotels", function(hotels){
        console.log("Hotels: ", hotels);
        globalHotel = hotels;
        console.log(">>>>", bigReservation.flightReservation);
        $('#serviceContainer').html('');
        $('#searchSortContainer').html('');
        $(`<div class="VelikiPregled"> <input type="text" id="hotelNameSearchInput" placeholder="Hotel name">
	        <input type="text" id="hotelDestinationSearchInput" placeholder="Hotel destination">
	        <input type="text" placeholder="Check in" id="hotelSearchCheckIn" onfocusin="(this.type='date')" onfocusout="(this.type='text')"> 
	        <input type="text" placeholder="Check out" id="hotelSearchCheckOut" onfocusin="(this.type='date')" onfocusout="(this.type='text')">
	         <button id="hotelSearchBtn" value="Search hotels">Search</button>
	         <br><br>
			<select id="sortCriteriaHotel">
			<option value="name">Name</option>
			<option value="destination">Destination</option>
			</select>
			<button id="sortHotelBtn">Sort</button></div>`).appendTo("#searchSortContainer");
        if(bigReservation.flightReservation != null){
        	$("#sortHotelBtn").attr("disabled", "disabled");
        	$('#hotelSearchCheckIn').val(bigReservation.flights[0].arrivalDate.substring(0,10));
        	$('#hotelSearchCheckIn').attr("disabled", "disabled");
        	if(bigReservation.flights[1]!=null){
	        	$('#hotelSearchCheckOut').val(bigReservation.flights[1].departureDate.substring(0,10));
	        	$('#hotelSearchCheckOut').attr("disabled", "disabled");
	        }
        	$('#hotelDestinationSearchInput').val(bigReservation.flightReservation[0].flight.to.destination.name);
        	$('#hotelDestinationSearchInput').attr("disabled", "disabled");
        	
//        	$('#roomSearchArrivalDate').val(bigReservation.flightReservation[0].flight.departureDate.substring(0,10));
//        	$('#roomSearchArrivalDate').attr("disabled", "disabled");
//        	const date1 = new Date(bigReservation.flightReservation[0].flight.departureDate.substring(0,10));
//        	const date2 = new Date(bigReservation.flightReservation[0].flight.arrivalDate.substring(0,10));
//        	const diffTime = Math.abs(date2.getTime() - date1.getTime());
//        	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
//        	$('#roomSearchDayNumber').val(diffDays);
//        	$('#roomSearchDayNumber').attr("disabled", "disabled");
        }
        
        $.get({url :"/api/reservedHotels",
            headers: createAuthorizationTokenHeader()},  function(reserved){
        for(var i=0;i<hotels.length;i++){
            var red = hotels[i];
            var locationID = "mapLocationHotel" + red.id;
            var detailViewButtonID = "hotelDetailViewBtn" + red.id;
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
				  <ul id=${red.id}Hotel>
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
				</div></section>`;	
            var check = 0;
            for(var k=0; k<reserved.length; k++){
            	if(reserved[k].id == hotels[i].id){
            		check=1;
            		break;
            	}
            }
            var rate = "";
            if(check == 1){
            	rate = "<button id='rateHotel"+ red.id+"'>Rate</button>"
            }
            if(bigReservation.flightReservation == null){
            	$(`<div class='listItem'><div class="imagePreview2"></div><div style="float: left; margin-left:15px;"><h2 style="margin-left:-15px;">${red.name}</h2><p>${red.destination.address} (${red.destination.name},
                    ${red.destination.country})</p><p>${red.description}</p><p>${forGrade}</p></div><div class="mapButtonPreview">
                    <button id=${locationID}>Show on map</button><button id=${detailViewButtonID}>More details</button>${rate}</div></div>`).appendTo("#serviceContainer");
            }
            var k = 0;
            var onStar = grade;
 	    	var stars = $('.li.star');
 	    	console.log("AAAA", onStar);
 	    	$("#"+red.id+"Hotel li").each(function() {
 	    		$(this).removeClass('selected');
 	   		})  
 	    	$("#"+red.id+"Hotel li").each(function() {
 	    		if(k<onStar){
 	    			$(this).addClass('selected');
 	    			k++;
 	    		}
 	    		else
 	    			return false;
 	   		 })
        }
    })});
}

var displayRents = function(){
	console.log(bigReservation);
    $.get("/api/rentacars", function(rents){
        console.log("Rents: ", rents);
        globalRent = rents;
         $('#serviceContainer').html('');
        $('#searchSortContainer').html('');$('#serviceContainer').html('');
        $('#searchSortContainer').html('');
        $(`<div class="VelikiPregled"> <input type="text" id="rentNameSearchInput" placeholder="Rent-a-car name">
    	        <input type="text" id="rentDestinationSearchInput" placeholder="Rent-a-car destination">
    	        <input type="text" placeholder="Start date" id="rentSearchCheckIn" onfocusin="(this.type='date')" onfocusout="(this.type='text')"> 
    	        <input type="text" placeholder="End date" id="rentSearchCheckOut" onfocusin="(this.type='date')" onfocusout="(this.type='text')">
    	        <button id="rentSearchBtn" value="Search rent">Search</button><br><br>
    			<select id="sortCriteriaRent">
    			<option value="name">Name</option>
    			<option value="destination">Destination</option>
    			</select>
    			<button id="sortRentBtn">Sort</button></div>`).appendTo("#searchSortContainer");
        if(bigReservation.flightReservation != null){
        	$("#sortRentBtn").attr("disabled", "disabled");
        	$('#rentSearchCheckIn').val(bigReservation.flights[0].arrivalDate.substring(0,10));
        	$('#rentSearchCheckIn').attr("disabled", "disabled");
        	if(bigReservation.flights[1]!=null){
	        	$('#rentSearchCheckOut').val(bigReservation.flights[1].departureDate.substring(0,10));
	        	$('#rentSearchCheckOut').attr("disabled", "disabled");
	        }
        	$('#rentDestinationSearchInput').val(bigReservation.flightReservation[0].flight.to.destination.name);
        	$('#rentDestinationSearchInput').attr("disabled", "disabled");

        }
        $.get({url :"/api/reservedRents",
	        headers: createAuthorizationTokenHeader()},  function(reserved){
        for(var i=0;i<rents.length;i++){
            var red = rents[i];
            var locationID = "mapLocationRent" + red.id;
            var detailViewButtonID = "rentDetailViewBtn" + red.id;
            var grade = 0;
            var sum = 0;
            for(var j=0;j<red.grades.length;j++){
            	sum += red.grades[j].grade;
            }
            if(red.grades.length!=0)
            	grade = sum/red.grades.length;
            var forGrade = `<section class='rating-widget'>
				<div class='rating-stars text-center' style="float:left">
				  <ul id=${red.id}Rent>
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
				</div></section>`;	
            var check = 0;
            for(var k=0; k<reserved.length; k++){
            	if(reserved[k].id == rents[i].id){
            		check=1;
            		break;
            	}
            }
            var rate = "";
            if(check == 1){
            	rate = "<button id='rateRent"+ red.id+"'>Rate</button>"
            }
            if(bigReservation.flightReservation == null){
            $(`<div class='listItem'><div class="imagePreview3"></div><div style="float: left; margin-left:15px;"><h2 style="margin-left:-15px;">${red.name}</h2><p>${red.destination.address} (${red.destination.name},
            ${red.destination.country})</p><p>${red.description}</p><p>${forGrade}</p></div><div class="mapButtonPreview">
            <button id=${locationID}>Show on map</button><button id=${detailViewButtonID}>More details</button>${rate}</div></div>`).appendTo("#serviceContainer");
            }
            
            var onStar = grade;
 	    	var stars = $('.li.star');
 	    	console.log("AAAA", onStar);
 	    	var k = 0;
 	    	$("#"+red.id+"Rent li").each(function() {
 	    		$(this).removeClass('selected');
 	   		})  
 	    	$("#"+red.id+"Rent li").each(function() {
 	    		if(k<onStar){
 	    			$(this).addClass('selected');
 	    			k++;
 	    		}
 	    		else
 	    			return false;
 	   		 })
            
        }})
    });
}

var renderVehicleTable2 = function(text,myID){
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
            $('#RentBranchOfficeTable tr:last').after(`<tr><td>${red.name}</td><td>${red.destination.address}</td><td>${red.destination.name}</td><td>${red.destination.country}</td></tr>`);
        }
        $('#dialogRentView').css("display","block");
    });
}
