$(document).ready(function() {
	$(document).on('click', '#addRentACarBtn', function() {
		$(location).attr('href', "/rentacar.html");
	});
	$(document).on('click', '#editAirlineBtn', function() {
		$(location).attr('href', "/editAirline.html");
	});
	$(document).on('click', '#editRentACarBtn', function() {
		$(location).attr('href', "/editRentacar.html");
	});
	$(document).on('click', '#addVehicleBtn', function() {
		$(location).attr('href', "/vehicle.html");
	});
	$(document).on('click', '#addDestinationBtn', function() {
		$(location).attr('href', "/destination.html");
	});
	
	$(document).on('click','#logoutBtn',function(){
    	removeJwtToken();
        $(location).attr('href',"/logout");
    });
})