$(document).ready(function() {
	$(document).on('submit', "#add_rentacar", function(e) {
		e.preventDefault();
		var name = $(".field").eq(0).val();
		var address = $(".field").eq(1).val();
		var description = $(".field").eq(2).val();
		var services = $(".field").eq(3).val();
		var vehicles = $(".field").eq(4).val();
		var offices = $(".field").eq(5).val();
		$.ajax({
			type : 'POST',
			url : "/rentacars",
			contentType : 'application/json',
			data : JSON.stringify({
				"name" : name,
				"address" : address,
				"description" : description,
				"services" : services,
				"vehicles" : vehicles,
				"offices" : offices
			}),
			success: function(){
				$(location).attr('href',"/");
			}
		})
	})
});