$(document).ready(function(){

	 $.get({url:'/api/allVehicleReservations',
			headers: createAuthorizationTokenHeader()}, function(data){
                    renderVehicleReservations(data);
			});
	 
	 $.get({url:'/api/allRoomReservations',
			headers: createAuthorizationTokenHeader()}, function(data){
          	renderRoomReservations(data);
			});
	 
	 $.get({url:'/api/allFlightReservations',
		 headers: createAuthorizationTokenHeader()}, function(data){
			 renderFlightReservations(data);
		 });

	 $(document).on('click','table button',function(e){
		    if(e.target.id.startsWith("reservationCancelBtn")){
		        var id = e.target.id.substr(20);
		        $.ajax({
					type: 'DELETE',
					url: '/api/cancelVehicleReservation/'+id,
					headers: createAuthorizationTokenHeader(),
					success: function(){
						showMessage('Vehicle reservation successfully removed!', 'green');
						//$(location).attr('href',"/registeredUser.html");
					},
					error: function (jqXHR, exception) {
						if (jqXHR.status == 401) {
							showMessage('Login first!', "orange");
						}else{
							showMessage('[' + jqXHR.status + "]  " + exception, "red");
							}
						}
		        });
		    } else if(e.target.id.startsWith("roomReservationCancelBtn")){
		        var id = e.target.id.substr(24);
		        $.ajax({
					type: 'DELETE',
					url: '/api/cancelRoomReservation/'+id,
					headers: createAuthorizationTokenHeader(),
					success: function(){
						showMessage('Room reservation successfully removed!', 'green');
						//$(location).attr('href',"/registeredUser.html");
					},
					error: function (jqXHR, exception) {
						if (jqXHR.status == 401) {
							showMessage('Login first!', "orange");
						}else{
							showMessage('[' + jqXHR.status + "]  " + exception, "red");
						}
					}
				});
			 } else if(e.target.id.startsWith("flightReservationCancelBtn")){
				 var id = parseInt(e.target.id.substr(26));
			        $.ajax({
					type: 'DELETE',
					url: '/api/cancelFlightReservation/'+id,
					headers: createAuthorizationTokenHeader(),
					success: function(){
						showMessage('Flight reservation successfully removed!', 'green');
					},
					error: function (jqXHR, exception) {
						if (jqXHR.status == 401) {
							showMessage('Login first!', "orange");
						}else{
							showMessage('[' + jqXHR.status + "]  " + exception, "red");
						}
					}
		        });
		 }
	 });
});

var renderVehicleReservations = function(reservations){
	$('#vehicleReservationsTable').html(`<tr><th>Start Date</th><th>End Date</th><th>Cars</th><th>Motocycles</th><th>Price</th><th>Start Destination</th><th>End Destination</th><th>Rent-a-car</th><th></th></tr>`);
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
        var now = new Date();
        var date = addDays(red.start, 2);
        /*cancel = "";
        if(now>date){
        buttonID = "reservationCancelBtn"+ red.id;
        cancel = "<button id='"+buttonID+"'>Cancel reservation</button>";
        
        }*/
        buttonID = "reservationCancelBtn"+ red.id;
        if((new Date(red.flight.departureDate) - new Date())/24/60/1000 < 48)
    		cancel = "";
    	else
    		cancel = "<button id='"+buttonID+"'>Cancel reservation</button>";
        $('#vehicleReservationsTable tr:last').after(`<tr><td>${displayDateFormat(red.start)}</td><td>${displayDateFormat(red.end)}</td><td>${cars}</td><td>${motocycles}</td><td>${price}</td><td>${red.vehicles[0].branchOffice.destination.name}</td><td>${red.endBranchOffice.destination.name}</td>
        <td>${red.rentACar.name}</td><td>${cancel}</td></tr>`);
        }
}

var renderRoomReservations = function(reservations){
	 $('#roomReservationsTable').html(`<tr><th>Arrival Date</th><th>Departure Date</th><th>2 bed rooms</th><th>3 bed rooms</th><th>4 bed rooms</th><th>Price</th><th>Hotel</th><th></th></tr>`);
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
   buttonID = "roomReservationCancelBtn"+ red.id;
   if((new Date(red.flight.departureDate) - new Date())/24/60/1000 < 48)
		cancel = "";
	else
		cancel = "<button id='"+buttonID+"'>Cancel reservation</button>";
   $('#roomReservationsTable tr:last').after(`<tr><td>${displayDateFormat(red.start)}</td><td>${displayDateFormat(red.end)}</td><td>${bed2}</td><td>${bed3}</td><td>${bed4}</td><td>${red.price}</td><td>${red.hotel.name}</td>
   <td>${cancel}</td></tr>`);
   }
}

var renderFlightReservations = function(reservations){
	$('#flightReservationsTable').html(`<tr><th>Departure Date</th><th>Arrival Date</th><th>From</th><th>To</th><th>Price</th><th>Airline</th><th></th></tr>`);
	for(var i=0;i<reservations.length;i++){
		var red = reservations[i];
		var from = red.flight.from.name + " (" + red.flight.from.destination.name + ")";
		var to = red.flight.to.name + " (" + red.flight.to.destination.name + ")";
		buttonID = "flightReservationCancelBtn"+ red.id;
		var cancel;
		if((new Date(red.flight.departureDate) - new Date())/24/60/1000 < 3)
			cancel = "";
		else
			cancel = "<button id='"+buttonID+"'>Cancel reservation</button>";
		$('#flightReservationsTable tr:last').after(`<tr><td>${formatDateDet(new Date(red.flight.departureDate))}</td><td>${formatDateDet(new Date(red.flight.arrivalDate))}</td><td>${from}</td><td>${to}</td><td>${red.price}</td><td>${red.flight.airline.name}</td>
		<td>${cancel}</td></tr>`);
	}
}

var options = { weekday: "short", year: "numeric", month: "short", day: "numeric" };

function formatDateDet(date) {
	return date.toLocaleDateString("en", options) + " " + (date.getHours() < 10 ? "0" + (date.getHours()) : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
}

function addDays(date, days) {
	  var result = new Date(date);
	  result.setDate(result.getDate() + days);
	  return result;
	}