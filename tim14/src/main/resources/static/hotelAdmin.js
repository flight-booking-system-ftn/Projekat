all_rooms = [];
selected_rooms = [];
all_hotel_services = [];
selected_hotel_services = [];

$(document).ready(function() {

	$(document).on('click', '#addRoomBtn', function() {
		$(location).attr('href', "/room.html");
	});

	$(document).on('click','#logoutBtn',function(){
    	removeJwtToken();
        $(location).attr('href',"/logout");
	});

	$(document).on('click','#quitDialogHotelView',function(){
        $('#dialogHotelView').css('display', 'none');
	});

	$(document).on('click', '#makeQuickReservation', function() {
		$('#dialogHotelView').css('display', 'block');
		$.ajax({
            type : 'GET',
            url : '/api/hotelAdmin/hotel',
            headers: createAuthorizationTokenHeader(),
            success: function(data){
				console.log("Admin's hotel: ", data);
				$('#hotelIdField').val(data.id);
                $('#pNameOfChosenHotel').text(data.name);
                $('#pDescriptionOfChosenHotel').text(data.description);
                $('#pDestinationOfChosenHotel').text(data.destination.name +
                    ", " + data.destination.country);
                $('#roomSearchArrivalDate').val(formatDate(new Date()));
                renderHotelServiceTable(data.id);
            },
            error: function (jqXHR) {
                if(jqXHR.status == 401){
                    showMessage("You don't have permission for getting current hotel!", "red");
                }
            }
        });
	});

	$(document).on('click','#roomSearchBtn', function(){
        var hotelId = $('#hotelIdField').val();
        var start = stringToDate($('#roomSearchArrivalDate').val());
		var end = start + $('#roomSearchDayNumber').val()*24*60*60*1000;
        var TwoBedRooms = $('#roomSearch2Bed').prop('checked');
        var ThreeBedRooms = $('#roomSearch3Bed').prop('checked');
        var FourBedRooms = $('#roomSearch4Bed').prop('checked');
        console.log('Hotel id: ', hotelId ,'....', start, end, TwoBedRooms, ThreeBedRooms, FourBedRooms);

        renderRoomTable(hotelId, start, end, TwoBedRooms, ThreeBedRooms, FourBedRooms, $('#roomSearchDayNumber').val());
	});
	
	$(document).on('click','#makeHotelReservationBtn', function(){
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
		if(selected_rooms.length == 0){
			showMessage("Select at least 1 room!", "orange");
			return;
		}
		var price = calculatePrice(selected_rooms, selected_hotel_services, $('#roomSearchDayNumber').val());
		var discount = (100 - $('#discountId').val())/100;
		price = price * discount;
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
				showMessage('Quick room reservation successful!', "green");
				$(location).attr('href',"/hotelAdmin.html");
			},
			error: function (jqXHR, exception) {
				if (jqXHR.status == 401) {
					showMessage('Login as hotel administrator!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  " + exception, "red");
				}
			}
		})
	});
})


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