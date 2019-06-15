$(document).ready(function() {
	getDestinations();
	
	function getDestinations() {
		$.ajax({
			type: "GET",
			url: "/api/destinations",
			success: function(data) {
				var select = $("select#address");
				for(var i = 0; i < data.length; i++) {
					var option = $("<option id='" + data[i].id + "'>" + data[i].name + ", " + data[i].country + "</option>");
					
					select.append(option);
				}
			}
		});
	}
	
    $("form#newAirportForm").submit(function(e) {
        e.preventDefault();

        var airportName = $("input#airportName").val();
        var name = $("input#name").val();
        var address = $("input#address").val();
        var country = $("input#country").val();
        var latitude = $("input#latitude").val();
        var longitude = $("input#longitude").val();

        if(airportName == "" || name == "" || address == "" || country == "" || latitude == "" || longitude == "") {
            showMessage("Some fields are empty!", "red");
        } else {
        	$.ajax({
        		type: "POST",
        		url: "/airport/new",
        		headers: createAuthorizationTokenHeader(),
        		data: JSON.stringify({
                    "name": airportName,
                    "destination": {
                    	"name": name,
                    	"address": address,
                    	"country": country,
                    	"latitude": latitude,
                    	"longitude": longitude
                    }
        		}),
        		success: function(response) {
        			showMessage(response, "green");
        		},
        		error: function(response) {
        			showMessage(response.responseText, "orange");
        		}
        	});
        }
    });
});