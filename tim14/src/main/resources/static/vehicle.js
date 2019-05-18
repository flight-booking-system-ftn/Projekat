$(document).ready(function() {
	$(document).on('submit', "#add_vehicle", function(e) {
		e.preventDefault(); 
        var brand = $("#txt_vehicle_brand").val();
        var model = $("#txt_vehicle_model").val();
        var productionYear = $("#txt_vehicle_year").val();
        var seatsNumber = $("#txt_vehicle_seats").val();
        var type = $("#select_vehicle_type").val();
        var price = $("#txt_vehicle_price").val();
         $.get('/api/rentacars/1', function(rentData){
             console.log("Rent DATA: ", rentData);
             data = {
                 "brand": brand,
                 "model" : model,
                 "productionYear" : productionYear,
                 "type": type,
                 "seatsNumber": seatsNumber,
                 "price": price,
                 "type": type,
                 "rentACar" : rentData
             };
             console.log(data);
             $.ajax({
                 type : 'POST',
                 url : "/api/vehicles",
                 headers: createAuthorizationTokenHeader(),
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