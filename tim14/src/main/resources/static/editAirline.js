$(document).ready(function() {
	var destinations;
	
	getDestinations();
	
	function getDestinations() {
		$.ajax({
			type: "GET",
			url: "/api/destinations",
			async: false,
			success: function(data) {
				destinations = data;
				
				var select = $("select#address");
				$.each(destinations, function(index, destination) {
					var option = $("<option value=''>" + destination.name + ", " + destination.country + "</option>");
					
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
		var address = $("select#address").find(":selected").text()
		var description = $("input#description").val();
		
		var destination;
		for(var i = 0; i < destinations.length; i++) {
			if(destinations[i].name == address.split(", ")[0] && destinations[i].country == address.split(", ")[1]) {
				destination = destinations[i];
				break;
			}
		}
		
		if(name == "" || description == "") {
			showMessage("Some fields are empty!", "red");
		} else {
			var airline = {
				"name": name,
				"destination": destination,
				"description": description
			}
			
			$.ajax({
				type: "PUT",
				url: "/api/airlines",
				contentType: "application/json",
				data: JSON.stringify(airline),
				success: function(){
					$(location).attr('href',"/");
				}
			});
		}
	});
});