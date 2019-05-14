$(document).ready(function(){
    
    renderAirlineTable();
    renderHotelTable();
    renderRentACarTable();

    $(document).on('click','#addAirlineBtn',function(){
        $(location).attr('href',"/airline.html");
    });
    $(document).on('click','#addHotelBtn',function(){
        $(location).attr('href',"/hotel.html");
    });
    $(document).on('click','#addRentACarBtn',function(){
        $(location).attr('href',"/rentacar.html");
    });
    $(document).on('click','#editAirlineBtn',function(){
        $(location).attr('href',"/editAirline.html");
    });
    $(document).on('click','#addFlightBtn',function(){
        $(location).attr('href',"/newFlight.html");
    });
    $(document).on('click','#addAirportBtn',function(){
        $(location).attr('href',"/newAirport.html");
    });
    $(document).on('click','#loginUserBtn',function(){
        $(location).attr('href',"/login.html");
    });
    
    $(document).on('click','#registrationBtn',function(){
    	console.log("SDASD");
        $(location).attr('href',"/registration.html");
    });
    
    $(document).on('click','#addRoomBtn',function(){
        $(location).attr('href',"/room.html");
    });
    
    $(document).on('click','#defineLuggagePricelistBtn',function(){
        $(location).attr('href',"/luggagePricelist.html");
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
    $(document).on('click','#airlineSearchBtn', function(){
        renderAirlineTableSearch();
    });
    
    $(document).on('click','#hotelSearchBtn', function(){
        renderHotelTableSearch();
    });

    $(document).on('click','#rentSearchBtn', function(){
        renderRentACarTableSearch();
    });
    
    $(document).on('click','#roomSearchBtn', function(){
        var hotelId = $('#hotelIdField').val();
        var arrivalDate = $('#roomSearchArrivalDate').val();
        var numDays = $('#roomSearchDayNumber').val();
        var TwoBedRooms = $('#roomSearch2Bed').prop('checked');
        var ThreeBedRooms = $('#roomSearch3Bed').prop('checked');
        var FourBedRooms = $('#roomSearch4Bed').prop('checked');
        console.log('Hotel id: ', hotelId ,'....', arrivalDate, numDays, TwoBedRooms, ThreeBedRooms, FourBedRooms);

        renderRoomTable(hotelId, arrivalDate, numDays, TwoBedRooms, ThreeBedRooms, FourBedRooms);
    });
    
    
    $(document).on('click','#quitDialogHotelView',function(){
        $('#dialogHotelView').css("display","none");
    });

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
                $('#dialogHotelView').css("display","block");
            });
        }
    });
    

});

var renderRoomTable = function(hotelId, arrivalDate, numDays, TwoBedRooms, ThreeBedRooms, FourBedRooms){
    var text = `/${hotelId}/${arrivalDate}/${numDays}/${TwoBedRooms}/${ThreeBedRooms}/${FourBedRooms}`;
    console.log(text);
    $.get('/api/roomsSearch'+text, function(RoomData){
            console.log("Rooms: ", RoomData);
            var rooms = RoomData;
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
    $('#airlineTable').html(`<tr><th>Name</th><th>Description</th></tr>`);
    $.get("/api/airlines", function(data){
        console.log("ssAirlines: ", data);
        for(var i=0;i<data.length;i++){
            var red = data[i];
            $('#airlineTable tr:last').after(`<tr><td>${red.name}</td><td>${red.description}</td></tr>`);
        }
    });
}

var renderAirlineTableSearch = function(){
    var text = $('#airlineSearchInput').val();
    if(text == ""){
        renderAirlineTable();
        return;
    }
    $('#airlineTable').html(`<tr><th>Name</th><th>Description</th></tr>`);
    $.get('/api/airlinesSearch/'+text, function(data){
        console.log("Airlines: ", data);
        for(var i=0;i<data.length;i++){
            var red = data[i];
            $('#airlineTable tr:last').after(`<tr><td>${red.name}</td><td>${red.description}</td></tr>`);
        }
    }); 
}

var renderHotelTable = function(){
	$('#hotelTable').html(`<tr><th>Name</th><th>Destination</th><th>Grade</th><th></th></tr>`);
    $.get("/api/hotels", function(data){
        console.log("Hotels: ", data);
        for(var i=0;i<data.length;i++){
            var red = data[i];
            var btnID = "hotelDetailViewBtn" + red.id;
            $('#hotelTable tr:last').after(`<tr><td>${red.name}</td><td>${red.destination.name}</td><td> - </td><td><button id=${btnID}>More details</button></td></tr>`);
        }
    });
}

var renderHotelTableSearch = function(){
    var hotelName = $('#hotelNameSearchInput').val();
    var hotelDestination = $('#hotelDestinationSearchInput').val();
    var checkIn = $('#hotelSearchCheckIn').val();
    var checkOut = $('#hotelSearchCheckOut').val();
    
    console.log(checkIn, checkOut);
    if(hotelName == ""){
        hotelName = "NO_INPUT";
    }
    if(hotelDestination == ""){
        hotelDestination = "NO_INPUT";
    }
    if(checkIn == ""){
        checkIn = "NO_INPUT";
    }
    if(checkOut == ""){
        checkOut = "NO_INPUT";
    }
    text = hotelName+"/"+hotelDestination+"/"+checkIn+"/"+checkOut;
    $('#hotelTable').html(`<tr><th>Name</th><th>Destination</th><th>Grade</th><th></th></tr>`);
    $.get('/api/hotelsSearch/'+text, function(data){
        console.log("Hotels: ", data);
        for(var i=0;i<data.length;i++){
            var red = data[i];
            var btnID = "hotelDetailViewBtn" + red.id;
            $('#hotelTable tr:last').after(`<tr><td>${red.name}</td><td>${red.destination.name}</td><td>-</td><td><button id=${btnID}>More details</button></td></tr>`);
        }
    });
}

var renderRentACarTable = function(){
    $('#rentACarTable').html(`<tr><th>Name</th><th>Description</th></tr>`);
    $.get("/api/rentacars", function(data){
        console.log("Rent-a-cars: ", data);
        for(var i=0;i<data.length;i++){
            var red = data[i];
            $('#rentACarTable tr:last').after(`<tr><td>${red.name}</td><td>${red.description}</td></tr>`);
        }
    });
}

var renderRentACarTableSearch = function(){
    var text = $('#rentSearchInput').val();
    if(text == ""){
        renderRentACarTable();
        return;
    }
    $('#rentACarTable').html(`<tr><th>Name</th><th>Description</th></tr>`);
    $.get('/api/rentsSearch/'+text, function(data){
        console.log("Rent-a-cars: ", data);
        for(var i=0;i<data.length;i++){
            var red = data[i];
            $('#rentACarTable tr:last').after(`<tr><td>${red.name}</td><td>${red.description}</td></tr>`);
        }
    }); 
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
