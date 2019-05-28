$(document).ready(function() {
	getDestinations();
	
	function getDestinations() {
		$.ajax({
			type: "GET",
			url: "/api/destinations",
			success: function(data) {
				var select = $("select#address");
				$.each(data, function(index, destination) {
					var option = $("<option value='' id='" + destination.id + "'>" + destination.name + ", " + destination.country + "</option>");
					
					select.append(option);
				});
			}
		});
	}
	
	getAirline();
	
	function getAirline() {
		$.ajax({
			type: "GET",
			url: "/api/airlines/1",
			success: function(data) {
				$("input#name").val(data.name);
				$("input#description").val(data.description);
				
				$("select#address option").each(function() {
					this.selected = (this.text == (data.destination.name + ", " + data.destination.country));
				});
			}
		});
	}
	
	$("form#editAirlineForm").submit(function(e) {
		e.preventDefault();
		
		var name = $("input#name").val();
		var address = $("select#address").find(":selected").attr("id");
		var description = $("input#description").val();
		
		if(name == "" || description == "") {
			showMessage("Some fields are empty!", "red");
		} else {
			var airline = {
				"name": name,
				"destination": {
					"id": address
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