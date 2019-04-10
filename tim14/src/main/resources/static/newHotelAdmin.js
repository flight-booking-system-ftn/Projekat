var addHotelAdmin = "/hotelAdmins";


$(document).ready(function(){

    $(document).submit('#hotelAdminForm',function(e){
        e.preventDefault();
        username = $("#usernameHotelAdmin").val();
        password = $("#passwordHotelAdmin").val();
        firstName = $("#firstNameHotelAdmin").val();
        lastName = $("#lastNameHotelAdmin").val();
        email = $("#emailHotelAdmin").val();
        repeatPassword = $("#rep_passwordHotelAdmin").val();

           
        var check = checkFields(username, password, firstName, lastName, email,repeatPassword);
        
        if(check){
            $.ajax({
                url: addHotelAdmin,
                type: "POST",
                data: JSON.stringify({
                	"username": username,
                	"password": password,
                	"firstName": firstName,
                	"lastName": lastName,
                	"email": email,
                	"hotel": null
 
                }),
                contentType: "application/json; charset=utf-8;",
                dataType: "text",
                success: function(data){
                    $(location).attr('href',"/");
                },
                error: function(e,t){
                	console.log("Error");
                }
            });
        };
    });
});



var checkFields = function(username, password, firstName, lastName, email,repeatPassword){
    if(username=="" || password=="" || firstName=="" || lastName=="" || email=="" || repeatPassword==""){
    	alert("Fields cannot be empty!");
        return false;
    }
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

