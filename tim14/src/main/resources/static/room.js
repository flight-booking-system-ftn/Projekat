$(document).ready(function() {

	$("#roomBedNumberField").html('');
	var select = document.getElementById("roomBedNumberField");
	var array = [2,3,4];
    for(var i=0;i<array.length;i++){
        select.options[select.options.length] = new Option(array[i],''+array[i]);
    }
	
	$(document).on('submit',"#add_room", function(e){
        e.preventDefault();
        var roomNumber = $("#roomNumberField").val();
        var bedNumber = $("#roomBedNumberField option:selected").val();
        bedNumber = parseInt(bedNumber);
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
                }else if(jqXHR.status == 406){
                	showMessage("Hotel already have room with that roomNumber!", "orange");
                }
            }
        })
    });
});