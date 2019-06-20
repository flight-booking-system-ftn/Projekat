$(document).ready(function(){

	 $.get({url:'/api/allVehicleReservations',
			headers: createAuthorizationTokenHeader()}, function(data){
                    renderVehicleReservations(data);
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
		    }
	 })
})

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
        cancel = "<button id='"+buttonID+"'>Cancel reservation</button>";
        $('#vehicleReservationsTable tr:last').after(`<tr><td>${displayDateFormat(red.start)}</td><td>${displayDateFormat(red.end)}</td><td>${cars}</td><td>${motocycles}</td><td>${price}</td><td>${red.vehicles[0].branchOffice.destination.name}</td><td>${red.endBranchOffice.destination.name}</td>
        <td>${red.rentACar.name}</td><td>${cancel}</td></tr>`);
        }
};

function displayDateFormat(date){
	myDate=date.split("-");
	return [myDate[2], myDate[1], myDate[0]].join('/');
}

function addDays(date, days) {
	  var result = new Date(date);
	  result.setDate(result.getDate() + days);
	  return result;
	}