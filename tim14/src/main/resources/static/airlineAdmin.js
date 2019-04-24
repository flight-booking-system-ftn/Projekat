$(document).ready(function() {

	$(document).on('click', '#addAirlineBtn', function() {
		$(location).attr('href', "/airline.html");
	});
	$(document).on('click', '#editAirlineBtn', function() {
		$(location).attr('href', "/editAirline.html");
	});
	$(document).on('click', '#addFlightBtn', function() {
		$(location).attr('href', "/newFlight.html");
	});
	$(document).on('click', '#addDestinationBtn', function() {
		$(location).attr('href', "/destination.html");
	});
})