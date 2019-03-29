
function rentacarProfil() {
	console.log("profil");
	$.get("/rentacars/1",function(data){
		console.log(data);
		renderRentcar(data);
	});
}

function renderRentcar(rentacar) {
	console.log("render rentacar");
	var tabela = $('#tabeleRent');
	tabela
			.append('<tr><th>Name</th><td><input type = "text" class = "field" value = "'
					+ rentacar.name
					+ '"></td></tr>'
					+ '<tr><th>Address</th><td><input type = "text" class = "field" value = "'
					+ rentacar.address
					+ '"></td></tr>'
					+ '<tr><th>Description</th><td><input type = "text" class = "field" value = "'
					+ rentacar.description
					+ '"></td></tr>'
					+ '<tr><th>Services</th><td><input type = "text" class = "field" value = "'
					+ rentacar.services
					+ '"></td></tr>'
					+ '<tr><th>Vehicles</th><td><input type = "text" class = "field" value = "'
					+ rentacar.vehicles
					+ '"></td></tr>'
					+ '<tr><th>Offices</th><td><input type = "text" class = "field" value = "'
					+ rentacar.offices + '"></td></tr>'
					+'<tr><td colspan="2"><input type = "submit" id="save" value="Save"></td></tr>');
}

$(document).ready(function() {
	rentacarProfil();

	$(document).on('submit', "#edit_rent", function(e) {
		e.preventDefault();
		var name = $(".field").eq(0).val();
		var address = $(".field").eq(1).val();
		var description = $(".field").eq(2).val();
		var services = $(".field").eq(3).val();
		var vehicles = $(".field").eq(4).val();
		var offices = $(".field").eq(4).val();
		$.ajax({
			type : 'PUT',
			url : '/rentacars/1',
			contentType : 'application/json',
			data : JSON.stringify({
				"name" : name,
				"address" : address,
				"description" : description,
				"services" : services,
				"vehicles" : vehicles,
				"offices" : offices
			}),
			success: function(){
				$(location).attr('href',"/");
			}
		})
	})
})