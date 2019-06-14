$(document).ready(function(){

    $.get('/api/hotels', function(data){
        console.log(data);
        var select = document.getElementById("hotelHotelAdmin");
        for(var i=0;i<data.length;i++){
            var red = data[i];
            select.options[select.options.length] = new Option(''+red.name,''+red.id);
        }
    });

    $(document).submit('#hotelAdminForm',function(e){
        e.preventDefault();
        username = $("#usernameHotelAdmin").val();
        password = $("#passwordHotelAdmin").val();
        firstName = $("#firstNameHotelAdmin").val();
        lastName = $("#lastNameHotelAdmin").val();
        email = $("#emailHotelAdmin").val();
        repeatPassword = $("#rep_passwordHotelAdmin").val();
        phone = $('#phoneHotelAdmin').val();
        city = $('#cityHotelAdmin').val();
           
        var check = checkFields(password, email, repeatPassword);
        
        if(check){
        	if($('#hotelHotelAdmin').val() == ""){
        		showMessage("No hotel in system!", "orange");
        		return;
        	}
        	$.ajax({
    			type : 'GET',
    			url : '/api/hotels/'+$('#hotelHotelAdmin').val(),
    			headers: createAuthorizationTokenHeader(),
    			success: function(hotelData){
    				data = {
	                    username,
	                    password,
	                    firstName,
	                    lastName,
	                    email,
	                    city,
	                    "phoneNumber": phone,
	                    "hotel": hotelData
	                }
	                console.log(data);
    				$.ajax({
                        url: '/auth/registerHotelAdmin',
                        type: "POST",
                        data: JSON.stringify(data),
                        headers: createAuthorizationTokenHeader(),
                        dataType: "text",
                        success: function(data){
                        	showMessage("Hotel admin added successfully!", "green");
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
    		})
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

