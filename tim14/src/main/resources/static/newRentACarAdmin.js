$(document).ready(function(){

    $.get('/api/rentacars', function(data){
        var select = document.getElementById("rentRentAdmin");
        for(var i=0;i<data.length;i++){
            var red = data[i];
            select.options[select.options.length] = new Option(''+red.name,''+red.id);
        }
    });

    $(document).submit('#rentACarAdminForm',function(e){
        
        e.preventDefault();
        data = {}
        username = $("#usernameRentACarAdmin").val();
        password = $("#passwordRentACarAdmin").val();
        firstName = $("#firstNameRentACarAdmin").val();
        lastName = $("#lastNameRentACarAdmin").val();
        email = $("#emailRentACarAdmin").val();
        phone = $('#phoneRentACarAdmin').val();
        city = $('#cityRentACarAdmin').val();
        rentACar = null;
        repeatPassword = $("#rep_passwordRentACarAdmin").val();

           
        var check = checkFields(password, email, repeatPassword);
        
        if(check){
        	if($('#rentRentAdmin').val() == ""){
        		showMessage("No rent-a-car in system!", "orange");
        		return;
        	}
        	$.ajax({
    			type : 'GET',
    			url : '/api/rentacars/'+$('#rentRentAdmin').val(),
    			headers: createAuthorizationTokenHeader(),
    			success: function(rentData){
    				data = {
	                    username,
	                    password,
	                    firstName,
	                    lastName,
	                    email,
	                    city,
	                    "phoneNumber": phone,
	                    "rentACar": rentData
	                }
    				$.ajax({
                        url: '/auth/registerRentACarAdmin',
                        type: "POST",
                        data: JSON.stringify(data),
                        headers: createAuthorizationTokenHeader(),
                        dataType: "text",
                        success: function(data){
                        	showMessage("Rent-a-car admin added successfully!", "green");
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

