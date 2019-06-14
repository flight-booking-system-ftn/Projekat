$(document).ready(function(){
	
	 $(document).on('click','#addAirlineAdminBtn', function(){
        $(location).attr('href',"/newAirlineAdmin.html");
	 });
	 
    $(document).on('click','#addHotelAdminBtn', function(){
        $(location).attr('href',"/newHotelAdmin.html");
    });
    
    $(document).on('click','#addRentACarAdminBtn', function(){
        $(location).attr('href',"/newRentACarAdmin.html");
    });
    
    $(document).on('click','#logoutBtn', function(){
    	removeJwtToken();
        $(location).attr('href',"/logout");
	});
    
    $(document).on('click', '#addNewSystemAdminBtn', function(){
    	$('#dialogAddNewSysAdmin').css('display','block');
    });
    
    $(document).on('click', '#quitDialogNewSysAdmin', function(){
    	$('#dialogAddNewSysAdmin').css('display','none');
    });
    
    $(document).on('click','#addAirlineBtn',function(){
        $(location).attr('href',"/airline.html");
    });
    
    $(document).on('click','#addHotelBtn',function(){
        $(location).attr('href',"/hotel.html");
    });
    
    $(document).on('click','#addRentACarBtn',function(){
        $(location).attr('href',"/rentacar.html");
    });
    
    
    $(document).on('click', '#confirmAddingNewSysAdmin', function(){
    	
    	var username = $("#sysUsername").val();
        var password = $("#sysPassword").val();
        var repeatPassword = $("#sysRepPassword").val();
        var firstName = $("#sysFirstName").val();
        var lastName = $("#sysLastName").val();
        var email = $("#sysEmail").val();
        var phoneNumber = $('#sysPhone').val();
        var city = $('#sysCity').val();
        
        var check = checkFields(username, firstName, lastName, city, phoneNumber, password, repeatPassword, email);
        if(!check){
        	return;
        }
        
        var data = {
        	username,
        	password,
        	repeatPassword,
        	firstName,
        	lastName,
        	email,
        	phoneNumber,
        	city
        }
        
        $.ajax({
            url: '/auth/registerSystemAdmin',
            type: "POST",
            data: JSON.stringify(data),
            headers: createAuthorizationTokenHeader(),
            dataType: "text",
            success: function(data){
            	showMessage("System admin added successfully!", "green");
            	$('#dialogAddNewSysAdmin').css('display','none');
            },
            error: function (jqXHR, exception) {
            	if (jqXHR.status == 401) {
					showMessage('Login as system admin!', "orange");
				}else if (jqXHR.status == 406) {
					showMessage('Username and email must be unique!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  " + exception, "red");
				}
            }
        });
        
    });
    
});


var checkFields = function(username, firstName, lastName, city, phone, password, repeatPassword, email){
    if(username == ""){
    	showMessage("username cannot be empty!", "orange");
        return false;
    }
    
    if(password == ""){
    	showMessage("password cannot be empty!", "orange");
    	return false;
    }
    
    if(firstName == ""){
    	showMessage("first name cannot be empty!", "orange");
        return false;
    }
    
    if(lastName == ""){
    	showMessage("last name cannot be empty!", "orange");
        return false;
    }
    
    if(validateEmail(email) === false){
    	showMessage("email wrong format!", "orange");
        return false;
    }
    
    if(city == ""){
    	showMessage("city cannot be empty!", "orange");
        return false;
    }
    
    if(phone == ""){
    	showMessage("phone cannot be empty!", "orange");
        return false;
    }
    
    if(password != repeatPassword){
    	showMessage("Difference between passwords!", "orange");
        return false;
    }
    
    return true;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}