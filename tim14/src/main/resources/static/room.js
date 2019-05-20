$(document).ready(function() {

	$(document).on('submit',"#add_room", function(e){
        e.preventDefault();
        var roomNumber = $("#roomNumberField").val();
        var bedNumber = $("#roomBedNumberField").val();
        var floor = $("#roomFloorField").val();
        var price = $("#roomPriceField").val();
        data = {
        	"roomNumber" : roomNumber,
            "bedNumber": bedNumber,
            "floor" : floor,
            "price" : price,
            "hotel": null
        };
        console.log(data);
        $.ajax({
            type : 'POST',
            url : "/api/rooms",
            headers: createAuthorizationTokenHeader(),
            data : JSON.stringify(data),
            success: function(){
                $(location).attr('href',"/hotelAdmin.html");
            },
            error: function (jqXHR, exception) {
                if(jqXHR.status == 401){
                    showMessage("You don't have permission for adding rooms!", "red");
                }
            }
        })
    });
});