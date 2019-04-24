$(document).ready(function() {

	$(document).on('submit',"#add_room", function(e){
        e.preventDefault();
        var roomNumber = $("#roomNumberField").val();
        var bedNumber = $("#roomBedNumberField").val();
        var floor = $("#roomFloorField").val();
        var price = $("#roomPriceField").val();
         $.get('/api/hotels/1', function(hotelData){
             console.log("HOTEL DATA: ", hotelData);
             data = {
                 "roomNumber" : roomNumber,
                 "bedNumber": bedNumber,
                 "floor" : floor,
                 "price" : price,
                 "hotel": hotelData
             };
             console.log(data);
             $.ajax({
                 type : 'POST',
                 url : "/api/rooms",
                 contentType : 'application/json',
                 data : JSON.stringify(data),
                 success: function(){
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
             })
         });
        });
    });