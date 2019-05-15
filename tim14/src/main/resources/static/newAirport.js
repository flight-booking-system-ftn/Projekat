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
        var destination = $("select#address").find(":selected").attr("id");

        if(airportName == "") {
            showMessage("Some fields are empty!", "red");
        } else {
        	$.ajax({
        		type: "POST",
        		url: "/airport/new",
        		contentType: "application/json",
        		data: JSON.stringify({
                    "name": airportName,
                    "destination": {
                    	"id": destination
                    }
        		}),
        		dataType: "json",
        		success: function() {
        			showMessage("Airport successfully added.", "green");
        		},
        		error: function() {
        			showMessage("Airport already exists.", "red");
        		}
        	});
        }
    });
});