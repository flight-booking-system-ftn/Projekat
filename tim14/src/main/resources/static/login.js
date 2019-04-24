var loginUrl = "auth/login";


var TOKEN_KEY = 'jwtToken';

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
				data : formToJSON(username, password),
				success : function(response) {
					if (response == "") {
						alert("Login failed!");
						return;
					} else {
						console.log("E");
						setJwtToken(TOKEN_KEY, response.accessToken);			
					
					window.location.replace(response.redirectionURL);
				}
				}
			});
		}
	})
})
function formToJSON(username, password) {
	return JSON.stringify({
		"username" : username,
		"password" : password
	});
}