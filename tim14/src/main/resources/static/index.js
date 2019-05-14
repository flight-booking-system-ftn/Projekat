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
    
    
    $(document).on('click','#quitDialogHotelView',function(){
        $('#dialogHotelView').css("display","none");
    });

    $(document).on('click','table button',function(e){
        if(e.target.id.startsWith("hotelDetailViewBtn")){
            var message = e.target.id.substr(18);
            console.log("PORUKA JE ", message);
            $.get('/api/hotels/'+ message, function(data){
                console.log("MY DATA: ", data);
                $('#pNameOfChosenHotel').text(data.name);
                $('#pDescriptionOfChosenHotel').text(data.description);
                $('#pDestinationOfChosenHotel').text(data.destination.name +
                    ", " + data.destination.country);
                $.get('/api/roomsSearch/'+data.id, function(RoomData){
                    console.log("Rooms: ", RoomData);
                    var rooms = RoomData;
                    $('#selectedHotelRoomsTable').html(`<tr><th>Floor number</th><th>Number of beds</th><th>Price</th></tr>`);
                    for(var i=0;i<rooms.length;i++){
                        var red = rooms[i];
                        $('#selectedHotelRoomsTable tr:last').after(`<tr><td>${red.floor}</td><td>${red.bedNumber}</td><td>${red.price}</td></tr>`);
                    }
                    $('#dialogHotelView').css("display","block");
                });
            });
        }
    });
    

});

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
    $('#hotelTable').html(`<tr><th>Name</th><th>Description</th><th></th></tr>`);
    $.get("/api/hotels", function(data){
        console.log("Hotels: ", data);
        for(var i=0;i<data.length;i++){
            var red = data[i];
            var btnID = "hotelDetailViewBtn" + red.id;
            $('#hotelTable tr:last').after(`<tr><td>${red.name}</td><td>${red.description}</td><td><button id=${btnID}>More details</button></td></tr>`);
        }
    });
}

var renderHotelTableSearch = function(){
    var text = $('#hotelSearchInput').val();
    if(text == ""){
        renderHotelTable();
        return;
    }
    $('#hotelTable').html(`<tr><th>Name</th><th>Description</th><th></th></tr>`);
    $.get('/api/hotelsSearch/'+text, function(data){
        console.log("Hotels: ", data);
        for(var i=0;i<data.length;i++){
            var red = data[i];
            var btnID = "hotelDetailViewBtn" + red.id;
            $('#hotelTable tr:last').after(`<tr><td>${red.name}</td><td>${red.description}</td><td><button id=${btnID}>More details</button></td></tr>`);
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
