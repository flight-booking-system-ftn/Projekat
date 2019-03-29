$(document).ready(function() {
	$(document).on('submit', "#add_vehicle", function(e) {
		e.preventDefault();
		var registration = $(".field").eq(0).val();
		var type = $(".field").eq(1).val();
		$.ajax({
			type : 'POST',
			url : "/vehicles",
			contentType : 'application/json',
			data : JSON.stringify({
				"registration" : registration,
				"type" : type
			}),
			success: function(){
				$(location).attr('href',"/");
			}
		})
	})
});