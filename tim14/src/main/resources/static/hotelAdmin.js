$(document).ready(function() {
	$(document).on('click', '#addHotelBtn', function() {
		$(location).attr('href', "/hotel.html");
	});
	$(document).on('click', '#addRoomBtn', function() {
		$(location).attr('href', "/room.html");
	});
	$(document).on('click', '#addDestinationBtn', function() {
		$(location).attr('href', "/destination.html");
	});
	
	$(document).on('click','#logoutBtn',function(){
    	removeJwtToken();
        $(location).attr('href',"/logout");
    });
})