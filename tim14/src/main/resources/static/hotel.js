$(document).ready(function() {
	$(document).on('submit', "#add_hotel", function(e) {
		e.preventDefault();
		var name = $(".field").eq(0).val();
		var address = $(".field").eq(1).val();
		var description = $(".field").eq(2).val();
		var services = $(".field").eq(3).val();
		var rooms = $(".field").eq(4).val();
		$.ajax({
			type : 'POST',
			url : "/hotels",
			contentType : 'application/json',
			data : JSON.stringify({
				"name" : name,
				"address" : address,
				"description" : description,
				"services" : services,
				"rooms" : rooms,
			}),
			success: function(){
				$(location).attr('href',"/");
			}
		})
	})
});