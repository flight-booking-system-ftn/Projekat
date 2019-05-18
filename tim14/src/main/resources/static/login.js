var loginUrl = "auth/login";

$(document).ready(function() {
	$(document).on('submit', '#loginForm', function(e) {
		e.preventDefault();
		var username = $('#username').val();
		var password = $('#password').val();
		if (username == "" || password == "") {
			alert("You havent enetered usernme or password");
			return;
		} else {
			console.log(username, password);
			$.ajax({
				type : 'POST',
				url : loginUrl,
				contentType : 'application/json',
				data : JSON.stringify({
					username,
					password
				}),
				dataType: 'json',
				success : function(response) {
					setJwtToken(response.accessToken);			
					$(location).attr('href', response.redirectionURL);
				},
				error: function (xhr, status) {
					showMessage('Login failed!', 'red');
				}
			});
		}
	})
})
