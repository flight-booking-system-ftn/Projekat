var addRentACarAdmin = "/rentACarAdmins";


$(document).ready(function(){

    $(document).submit('#rentACarAdminForm',function(){
        
        data = {}
        username = $("#usernameRentACarAdmin").val();
        password = $("#passwordRentACarAdmin").val();
        firstName = $("#firstNameRentACarAdmin").val();
        lastName = $("#lastNameRentACarAdmin").val();
        email = $("#emailRentACarAdmin").val();
        rentACar = null;
        repeatPassword = $("#rep_passwordRentACarAdmin").val();

           
        var check = checkFields(username, password, firstName, lastName, email,repeatPassword);
        data = {
            username,
            password,
            firstName,
            lastName,
            email,
            rentACar
        }
        if(check){
            $.ajax({
                url: addRentACarAdmin,
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8;",
                dataType: "text",
                success: function(data){
                    $(location).attr('href',"/");
                },
                error: function(e,t){
                    $(location).attr('href',"/");
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

