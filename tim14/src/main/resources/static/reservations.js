$(document).ready(function(){

	 $.get({url:'/api/allVehicleReservations',
			headers: createAuthorizationTokenHeader()}, function(data){
                	console.log("all reservations: ", data);
                    renderVehicleReservations(data);
             });
	 
	 $.get({url:'/api/allRoomReservations',
			headers: createAuthorizationTokenHeader()}, function(data){
             	console.log("all room reservations: ", data);
             	renderRoomReservations(data);
          });
	 
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
	     console.log(bed2, bed3, bed4);
	     buttonID = "roomReservationCancelBtn"+ red.id;
	     cancel = "<button id='"+buttonID+"'>Cancel reservation</button>";
	     console.log("-->", red);
	     $('#roomReservationsTable tr:last').after(`<tr><td>${displayDateFormat(red.start)}</td><td>${displayDateFormat(red.end)}</td><td>${bed2}</td><td>${bed3}</td><td>${bed4}</td><td>${red.price}</td><td>${red.hotel.name}</td>
	     <td>${cancel}</td></tr>`);
	     }
	 }
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
        console.log(cars, motocycles);
        var now = new Date();
        var date = addDays(red.start, 2);
        console.log(red.start);
        console.log(date);
        console.log(now);
        /*cancel = "";
        if(now>date){
        buttonID = "reservationCancelBtn"+ red.id;
        cancel = "<button id='"+buttonID+"'>Cancel reservation</button>";
        
        }*/
        buttonID = "reservationCancelBtn"+ red.id;
        cancel = "<button id='"+buttonID+"'>Cancel reservation</button>";
        console.log("-->", red);
        $('#vehicleReservationsTable tr:last').after(`<tr><td>${displayDateFormat(red.start)}</td><td>${displayDateFormat(red.end)}</td><td>${cars}</td><td>${motocycles}</td><td>${price}</td><td>${red.vehicles[0].branchOffice.destination.name}</td><td>${red.endBranchOffice.destination.name}</td>
        <td>${red.rentACar.name}</td><td>${cancel}</td></tr>`);
        }
};
$(document).on('click','table button',function(e){
	console.log(e.target.id);
    if(e.target.id.startsWith("reservationCancelBtn")){
        var id = e.target.id.substr(20);
        console.log("vehicle reservation: ", id);
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
    }
    else if(e.target.id.startsWith("roomReservationCancelBtn")){
        var id = e.target.id.substr(24);
        console.log("room reservation: ", id);
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
    	    }
})
function displayDateFormat(date){
	myDate=date.split("-");
	return [myDate[2], myDate[1], myDate[0]].join('/');
}

function addDays(date, days) {
	  var result = new Date(date);
	  result.setDate(result.getDate() + days);
	  return result;
	}


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