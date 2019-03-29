

function airlineProfil() {
	console.log("airline");

	$.get("/airlines/1",function(data){
		console.log(data);
		renderAirline(data);
	});
}

function renderAirline(airline) {
	console.log("render airline");
	var tabela = $('#tabeleAirline');
	tabela
			.append('<tr><th>Name</th><td><input type = "text" class = "field" value = "'
					+ airline.name
					+ '"></td></tr>'
					+ '<tr><th>Address</th><td><input type = "text" class = "field" value = "'
					+ airline.address
					+ '"></td></tr>'
					+ '<tr><th>Description</th><td><input type = "text" class = "field" value = "'
					+ airline.description
					+ '"></td></tr>'
					+ '<tr><th>Destinations</th><td><input type = "text" class = "field" value = "'
					+ airline.destinations
					+ '"></td></tr>'
					+ '<tr><th>Fligts</th><td><input type = "text" class = "field" value = "'
					+ airline.flights
					+ '"></td></tr>'
					+ '<tr><th>Quick reservations</th><td><input type = "text" class = "field" value = "'
					+ airline.quickReservationTickets
					+ '"></td></tr>'
					+ '<tr><th>Configuration</th><td><input type = "text" class = "field" value = "'
					+ airline.configuration
					+ '"></td></tr>'
					+ '<tr><th>Pricelist</th><td><input type = "text" class = "field" value = "'
					+ airline.pricelist + '"></td></tr>'
					+'<tr><td colspan="2"><input type = "submit" id="save" value="Save"></td></tr>');
	
}

$(document).ready(function() {
	airlineProfil();
	$(document).on('submit', "#edit_airline", function(e) {
		e.preventDefault();
		var name = $(".field").eq(0).val();
		var address = $(".field").eq(1).val();
		var description = $(".field").eq(2).val();
		var destinations = $(".field").eq(3).val();
		var flights = $(".field").eq(4).val();
		var quick = $(".field").eq(5).val();
		var config = $(".field").eq(6).val();
		var price = $(".field").eq(7).val();
		$.ajax({
			type : 'PUT',
			url : "/airlines/1",
			contentType : 'application/json',
			data : JSON.stringify({
				"name" : name,
				"address" : address,
				"description" : description,
				"destinations" : destinations,
				"flights" : flights,
				"quickReservationTickets" : quick,
				"flightConfiguration" : config,
				"pricelist" : price
			}),
			success: function(){
				$(location).attr('href',"/");
			}
		})
	})
});