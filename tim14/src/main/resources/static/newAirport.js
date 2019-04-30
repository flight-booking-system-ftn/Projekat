$(document).ready(function() {
    $("form#newAirportForm").submit(function(e) {
        e.preventDefault();

        var airportName = $("input#airportName").val();
        var address = $("input#address").val();

        if(airportName == "" || address == "") {
            showMessage("Some fields are empty!", "red");
        } else {
        	$.ajax({
        		type: "POST",
        		url: "/airport/new",
        		contentType: "application/json",
        		data: JSON.stringify({
                    "name": airportName,
                    "address": address
        		}),
        		dataType: "json",
        		success: function() {
        			showMessage("Airport successfully added.", "green");
        		},
        		error: function() {
        			showMessage("Airport already exists in the company.", "red");
        		}
        	});
        }
    });
});