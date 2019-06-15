$(document).ready(function() {
	getAirline();
	
	function getAirline() {
		$.ajax({
			type: "GET",
			url: "/api/airline/getAirline",
			headers: createAuthorizationTokenHeader(),
			success: function(data) {
				$("input#airlineName").val(data.name);
				$("input#name").val(data.destination.name);
				$("input#address").val(data.destination.address);
		        $("input#country").val(data.destination.country);
		        $("input#latitude").val(data.destination.latitude);
		        $("input#longitude").val(data.destination.longitude);
				$("input#description").val(data.destination.address);
				$("input#description").val(data.description);
			}
		});
	}
	
	$("form#editAirlineForm").submit(function(e) {
		e.preventDefault();
		
		var airlineName = $("input#airlineName").val();
		var name = $("input#name").val();
        var address = $("input#address").val();
        var country = $("input#country").val();
        var latitude = $("input#latitude").val();
        var longitude = $("input#longitude").val();
		var description = $("input#description").val();
		
		if(name == "" || description == "") {
			showMessage("Some fields are empty!", "red");
		} else {
			var airline = {
				"name": name,
				"destination": {
                	"name": name,
                	"address": address,
                	"country": country,
                	"latitude": latitude,
                	"longitude": longitude
                },
				"description": description
			}
			
			$.ajax({
				type: "PUT",
				url: "/api/airlines",
				headers: createAuthorizationTokenHeader(),
				data: JSON.stringify(airline),
				dataType: "text",
				success: function(response) {
        			showMessage(response, "green");
        		},
        		error: function(response) {
        			showMessage(response.responseText, "red");
        		}
			});
		}
	});
});