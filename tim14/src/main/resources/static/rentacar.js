$(document).ready(function() {
	

	$(document).on('submit',"#add_rent", function(e){
		e.preventDefault();
		var name = $("#rentNameField").val();
		var description = $("#rentDescriptionField").val();
		var services = getServices(); 
		if(!services){
			return;
		}
		
		if(isNaN($('#lonNumber').val()) || isNaN($('#latNumber').val())){
			showMessage('Latitude and Longitude must be a numbers!', 'orange');
			return;
		}
		
		var destination = {
			country: $('#countryName').val(),
			name: $('#cityName').val(),
			address: $('#addressName').val(),
			longitude: $('#lonNumber').val(),
			latitude: $('#latNumber').val(),
		}
		
		data = {
			name,
			description,
			destination,
			services
		}
		$.ajax({
			type : 'POST',
			url : "/api/rentacars",
			headers: createAuthorizationTokenHeader(),
			data : JSON.stringify(data),
			success: function(){
				showMessage('Rent-a-car added successfully!', 'green');
				$(location).attr('href',"/systemAdmin.html");
			},
			error: function (jqXHR, exception) {
				if (jqXHR.status == 401) {
					showMessage('Please login as system administrator!', 'orange');
				} else {
					showMessage(exception, 'red');
				}
			}
		});
	})
});

var getServices = function(){
	services = [];
	var allSer = ['Cooling','Air conditioner','Sidecar'];
	for(var i=1;i<4;i++){
		if($(`#service${i}option`).prop('checked')){
			if($(`#service${i}price`).val() != null && $(`#service${i}price`).val() > 0){
				services.push({
					"name": allSer[i-1],
					"price": $(`#service${i}price`).val()
				});
			}else{
				showMessage('Price of service must be positive number!', 'orange');
				return false;
			}
		}
	}
	return services;
}