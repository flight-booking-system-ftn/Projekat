$(document).ready(function(){
	
	$.get('/api/airlines', function(data){
        console.log(data);
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
        airline = null;
        repeatPassword = $("#rep_passwordAirlineAdmin").val();

           
        var check = checkFields(username, password, firstName, lastName, email,repeatPassword);
        
        if(check){
            $.get('/api/airlines/'+$('#airlineAirlineAdmin').val(),function(airlineData){
                data = {
                    username,
                    password,
                    firstName,
                    lastName,
                    email,
                    airline: airlineData
                }
                console.log(data);
                $.ajax({
                    url: '/auth/registerAirlineAdmin',
                    type: "POST",
                    data: JSON.stringify(data),
                    contentType: "application/json; charset=utf-8;",
                    dataType: "text",
                    success: function(data){
                        $(location).attr('href',"/");
                    	
                    },
            		error: function (jqXHR, exception) {
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
            	        alert(msg);
            		}
                });
            });
        };
    });
});



var checkFields = function(username, password, firstName, lastName, email,repeatPassword){
    
    if(password != repeatPassword){
    	alert("Difference between passwords!");
        return false;
    }
    if(validateEmail(email) === false){
    	alert("email wrong format!");
        return false;
    }
    return true;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

