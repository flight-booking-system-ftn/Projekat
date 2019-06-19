$(document).ready(function() {
	getAirports();
	
    function getAirports() {
    	$.ajax({
    		type: "GET",
    		url: "/api/airline/airports",
    		headers: createAuthorizationTokenHeader(),
    		success: function(data) {
    			var from = $("select#from");
    			var to = $("select#to");
    			var stops = $("div#stopsDiv");
    			var i = 0;
    	    	
    	    	$.each(data, function(index, airport) {
    	    		var fromOption = $("<option id='" + airport.id + "'>" + airport.name + " - " + airport.destination.name + ", " + airport.destination.country + "</option>")
    	    		var toOption = $("<option id='" + airport.id + "'>" + airport.name + " - " + airport.destination.name + ", " + airport.destination.country + "</option>")
    	    		var stopBox = $("<input type='checkbox' id='" + airport.id + "'><label for='" + airport.id + "'>" + airport.name + " - " + airport.destination.name + ", " + airport.destination.country + "</label>")
    	    		
    	    		from.append(fromOption);
    	    		to.append(toOption);
    	    		stops.append(stopBox);
    	    		stops.append("<br>");
    	    	});
    		},
    		error: function(response) {
    			showMessage(response.responseText, "orange");
    		}
    	});
    }
    
    function findAirport(name, address) {
    	for(var i = 0; i < airports.length; i++) {
    		if(airports[i].name == name && airports[i].address == address)
    			return airports[i];
    	}
    }
    
    $("form#newFlightForm").submit(function(e) {
    	e.preventDefault();
    	
    	var from = $("select#from").find(":selected").attr("id");
    	var to = $("select#to").find(":selected").attr("id");
    	var stops = $("div#stopsDiv").children("input");
    	var departureDate = new Date($("input#departureDate").val());
    	var arrivalDate = new Date($("input#arrivalDate").val());
    	var length = parseInt($("input#length").val());
    	var rowsInFirstClass = parseInt($("input#rowsInFirstClass").val());
    	var rowsInBusinessClass = parseInt($("input#rowsInBusinessClass").val());
    	var rowsInEconomyClass = parseInt($("input#rowsInEconomyClass").val());
    	var luggageQuantity = parseInt($("input#luggageQuantity").val());
    	var ticketPriceFirstClass = parseInt($("input#ticketPriceFirstClass").val());
    	var ticketPriceBusinessClass = parseInt($("input#ticketPriceBusinessClass").val());
    	var ticketPriceEconomyClass = parseInt($("input#ticketPriceEconomyClass").val());
    	
    	if(!departureDate || !arrivalDate || !length || !luggageQuantity || !ticketPriceFirstClass || !ticketPriceBusinessClass || !ticketPriceEconomyClass) {
    		showMessage("Some fields are empty!", "red");
    		return;
    	} else if(departureDate - new Date() <= 0) {
			showMessage("The departure date can't be before current date!", "red");
			return;
    	} else if(arrivalDate - departureDate <= 0) {
    		showMessage("The date of landing can't be before the date of departure!", "red");
    		return;
		} else {
    		if(from == to) {
    			showMessage("The start destination can't be same as the end destination!", "red");
    			return;
    		} else 
	    		for(var i = 0; i < stops.length; i++)
	    			if(stops[i].checked && ($(stops[i]).next('label').text() == from || $(stops[i]).next('label').text() == to)) {
	    				showMessage("Some of the stops are same as start or end destination!", "red");
	    				return;
	    			}
    	}
    	
    	var selectedStops = [];
    	
    	for(var i = 0; i < stops.length; i++)
    		if(stops[i].checked) {
    			//selectedStops.push(findAirport($(stops[i]).next("label").text().split(" - ")[0], $(stops[i]).next("label").text().split(" - ")[1]));
    			selectedStops.push({
    				"id": $(stops[i]).attr("id")
    			});
    		}
    	
    	var seats = [];
    	
    	for(var i = 0; i < rowsInFirstClass * 3; i++) {
    		seats.push({
    			"seatRow": Math.ceil((i + 1) / 3),
    			"number": (i % 3) + 1,
    			"busy": false,
    			"enabled": true,
    			"type": "FIRST_CLASS"
    		});
    	}
    	
    	for(var i = rowsInFirstClass * 3; i < rowsInFirstClass * 3 + rowsInBusinessClass * 3; i++) {
    		seats.push({
    			"seatRow": Math.ceil((i + 1) / 3),
    			"number": (i % 3) + 1,
    			"busy": false,
    			"enabled": true,
    			"type": "BUSINESS"
    		});
    	}
    	
    	for(var i = rowsInFirstClass * 3 + rowsInBusinessClass * 3; i < rowsInFirstClass * 3 + rowsInBusinessClass * 3 + rowsInEconomyClass * 3; i++) {
    		seats.push({
    			"seatRow": Math.ceil((i + 1) / 3),
    			"number": (i % 3) + 1,
    			"busy": false,
    			"enabled": true,
    			"type": "ECONOMY"
    		});
    	}
    	
    	var flight = {
    		"from": {
    			"id": from
    		},
    		"to": {
    			"id": to
    		},
    		"stops": selectedStops,
    		"departureDate": departureDate,
    		"arrivalDate": arrivalDate,
    		"flightLength": length,
    		"luggageQuantity": luggageQuantity,
    		"flightDuration": (arrivalDate - departureDate)/1000/60/60,
    		"ticketPriceFirstClass": ticketPriceFirstClass,
    		"ticketPriceBusinessClass": ticketPriceBusinessClass,
    		"ticketPriceEconomyClass": ticketPriceEconomyClass,
    		"seats": seats
    	}
    	
    	$.ajax({
    		type: "POST",
    		url: "/flight/new",
    		headers: createAuthorizationTokenHeader(),
    		data: JSON.stringify(flight),
    		success: function(message) {
    			showMessage(message, "green");
    		}
    	});
    });
});