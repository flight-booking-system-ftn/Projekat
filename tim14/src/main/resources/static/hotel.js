$(document).ready(function() {
	$.get('/api/destinations', function(data){
        
		var select = document.getElementById("hotelDestination");
		console.log(data);
        for(var i=0;i<data.length;i++){
            var red = data[i];
            select.options[select.options.length] = new Option(''+red.name,''+red.id);
        }
    });

	$(document).on('submit',"#add_hotel", function(e){
		e.preventDefault();
		var name = $("#hotelNameField").val();
		var description = $("#hotelDescriptionField").val();
		var services = getServices(); 
		if(!services){
			return;
		}
		var link = '/api/destinations/'+$("#hotelDestination option:selected" ).val();
		$.get(link, function(destinationData){
			data = {
				name,
				description,
				"destination": destinationData,
				"services": services
			}
			console.log(data);
			$.ajax({
				type : 'POST',
				url : "/api/hotels",
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
	})
});

var getServices = function(){
	services = []
	for(var i=1;i<4;i++){
		if($(`#service${i}option`).prop('checked')){
			if($(`#service${i}price`).val() != null && $(`#service${i}price`).val() > 0){
				services.push({
					"name": `Hotel service${i}`,
					"price": $(`#service${i}price`).val()
				});
			}else{
				alert('Price of service must be positive number!');
				return false;
			}
		}
	}
	return services;
}