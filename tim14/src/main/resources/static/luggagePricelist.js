$(document).ready(function() {
	getPricelist();
	
	function getPricelist() {
		$.ajax({
			type: "GET",
			url: "/api/airline/getPricelist",
			headers: createAuthorizationTokenHeader(),
			success: function(data) {
				var table = $("table#luggagePricelistTable tbody");
				
				$.each(data, function(index, luggage) {
					var tr = $("<tr></tr>");
					var dimensionsTD = $("<td>" + luggage.dimensions + "</td>");
					var weightTD = $("<td>" + luggage.weight + "</td>");
					var priceTD = $("<td>" + luggage.price + "</td>");
					
					tr.append(dimensionsTD);
					tr.append(weightTD);
					tr.append(priceTD);
					table.append(tr);
				});
			}
		});
	}
	
	$("form#newPricelistItem").submit(function(e) {
		e.preventDefault();
		
		var dimensions = $("input#dimensions").val();
		var weight = parseInt($("input#weight").val());
		var price = parseFloat($("input#price").val());
		
		if(dimensions == "") {
			showMessage("Dimensions must be entered.", "red");
		} else {
			var luggage = {
				"dimensions": dimensions,
				"weight": weight,
				"price": price
			}
			
			$.ajax({
				type: "POST",
				url: "/luggage/add",
				headers: createAuthorizationTokenHeader(),
				data: JSON.stringify(luggage),
				dataType: "text",
				success: function(response) {
					var table = $("table#luggagePricelistTable tbody");
					var tr = $("<tr></tr>");
					var dimensionsTD = $("<td>" + luggage.dimensions + "</td>");
					var weightTD = $("<td>" + luggage.weight + "</td>");
					var priceTD = $("<td>" + luggage.price + "</td>");
					
					tr.append(dimensionsTD);
					tr.append(weightTD);
					tr.append(priceTD);
					table.append(tr);
					
					showMessage(response, "green");
				},
				error: function(response) {
					showMessage(response.responseText, "red");
				}
			});
		}
	});
});