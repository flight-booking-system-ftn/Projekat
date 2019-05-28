$(document).ready(function() {
	$(document).on('submit', "#registrationForm", function(e) {
	e.preventDefault();
	
    var check = true;
    $(".field").each(function() {
        if($(this).val() == ""){
            check = false;
            return false;
        }
    });
    if(check == false){
        alert("Field can't be empty!");
    }
    else{
        var username = $(".field").eq(0).val();
        var password = $(".field").eq(1).val();
        var password2 = $(".field").eq(2).val();
        if(password !=password2){
        	alert("Different passwords!")
        	return false;
        }
        var firstName = $(".field").eq(3).val();
        var lastName = $(".field").eq(4).val();
        var city = $(".field").eq(5).val();
        var phone = $(".field").eq(6).val();
        var email = $(".field").eq(7).val();
        $.ajax({
			type : 'POST',
			url : "/auth/registration",
			contentType : 'application/json',
			dataType : "text",
			data : JSON.stringify({
	            "username" : username,
	            "password" : password,
	            "firstName": firstName,
	            "lastName": lastName,
	            "city": city,
	            "phoneNumber": phone,
	            "email" : email,
	            "friendList1" : null,
	            "friendList2" : null,
	            "flightReservations" : null,
	            "roomReservations" : null,
	            "vehicleReservations" : null,
	            "bonusPoints" : 0,
	            "enables": false
	            
	        }),
			success : function(data) {
				showMessage('Email is sent. You must confirm your registration.', "orange");
			},
        	error : function(err){
        		showMessage("Registration failed!", "red");
        	}
		});
    }})})