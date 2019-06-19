$(document).ready(function(){
	
	$.get('/api/airlines', function(data){
        var select = document.getElementById("airlineAirlineAdmin");
        for(var i=0;i<data.length;i++){
            var red = data[i];
            select.options[select.options.length] = new Option(''+red.name,''+red.id);
        }
    });

    $(document).submit('#airlineAdminForm',function(e){
    	e.preventDefault();
        data = {}
        username = $("#usernameAirlineAdmin").val();
        password = $("#passwordAirlineAdmin").val();
        firstName = $("#firstNameAirlineAdmin").val();
        lastName = $("#lastNameAirlineAdmin").val();
        email = $("#emailAirlineAdmin").val();
        city = $("#cityAirlineAdmin").val();
        phone = $("#phoneAirlineAdmin").val();
        
        airline = null;
        repeatPassword = $("#rep_passwordAirlineAdmin").val();

           
        var check = checkFields(password, email, repeatPassword);
        
        if(check){
        	if($('#airlineAirlineAdmin').val() == ""){
        		showMessage("No airline in system!", "orange");
        		return;
        	}
        	$.ajax({
    			type : 'GET',
    			url : '/api/airlines/'+$('#airlineAirlineAdmin').val(),
    			headers: createAuthorizationTokenHeader(),
    			success: function(airlineData){
    				data = {
	                    username,
	                    password,
	                    firstName,
	                    lastName,
	                    email,
	                    city,
	                    "phoneNumber": phone,
	                    "airline": airlineData
	                }
    				$.ajax({
                        url: '/auth/registerAirlineAdmin',
                        type: "POST",
                        data: JSON.stringify(data),
                        headers: createAuthorizationTokenHeader(),
                        dataType: "text",
                        success: function(data){
                        	showMessage("Airline admin added successfully!", "green");
                            $(location).attr('href',"/systemAdmin.html");
                        },
                        error: function (jqXHR, exception) {
                        	if (jqXHR.status == 401) {
            					showMessage('Login as system admin!', "orange");
        					}else{
        						showMessage('[' + jqXHR.status + "]  " + exception, "red");
        					}
                        }
                    });
    			},
    			error: function (jqXHR, exception) {
    				if (jqXHR.status == 401) {
    					showMessage('Login first!', "orange");
					}else{
						showMessage('[' + jqXHR.status + "]  " + exception, "red");
					}
    			}
        	});
        };
    });
});



var checkFields = function(password, email, repeatPassword){
    if(password != repeatPassword){
    	showMessage("Difference between passwords!", "orange");
        return false;
    }
    if(validateEmail(email) === false){
    	showMessage("email wrong format!", "orange");
        return false;
    }
    return true;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

