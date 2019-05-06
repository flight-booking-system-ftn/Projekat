$(document).ready(function() {
	var pricelist;
	
	getPricelist();
	
	function getPricelist() {
		$.ajax({
			type: "GET",
			url: "/luggage/getPricelist",
			async: false,
			success: function(data) {
				pricelist = data;
				
				var table = $("table#luggagePricelistTable tbody");
				
				$.each(pricelist, function(index, luggage) {
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
				contentType: "application/json",
				data: JSON.stringify(luggage),
				success: function() {
					var table = $("table#luggagePricelistTable tbody");
					var tr = $("<tr></tr>");
					var dimensionsTD = $("<td>" + luggage.dimensions + "</td>");
					var weightTD = $("<td>" + luggage.weight + "</td>");
					var priceTD = $("<td>" + luggage.price + "</td>");
					
					tr.append(dimensionsTD);
					tr.append(weightTD);
					tr.append(priceTD);
					table.append(tr);
					
					showMessage("New item successfully added.", "green");
				},
				error: function(jqXHR, exception) {
					var msg = '';
					
        	        if (jqXHR.status == 0) {
        	            msg = 'Not connect.\n Verify Network.';
        	        } else if (jqXHR.status == 404) {
        	            msg = 'Requested page not found. [404]';
        	        } else if (jqXHR.status == 500) {
        	            msg = 'Internal Server Error [500].';
        	        } else if (exception === 'parsererror') {
        	            msg = 'Requested JSON parse failed.';
        	        } else if (exception === 'timeout') {
        	            msg = 'Time out error.';
        	        } else if (exception === 'abort') {
        	            msg = 'Ajax request aborted.';
        	        } else {
        	            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        	        }
        	        
        	        showMessage(msg);
				}
			});
		}
	});
});