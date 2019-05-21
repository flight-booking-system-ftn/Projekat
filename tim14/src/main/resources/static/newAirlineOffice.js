$(document).ready(function() {
	$("form#newOfficeForm").submit(function(e) {
		e.preventDefault();
		
		var name = $("input#name").val();
		var address = $("input#address").val();
		var phone = $("input#phone").val();
		var email = $("input#email").val();
		
		var office = {
			"name": name,
			"address": address,
			"phone": phone,
			"email": email
		};
		
		$.ajax({
			type: "POST",
			url: "/api/airlineOffice/add",
			headers: createAuthorizationTokenHeader(),
			data: JSON.stringify(office),
			success: function(response) {
				showMessage(response, "green");
			},
			error: function(response) {
				showMessage(response, "red");
			}
		});
	});
});