
function rentacarProfil() {
		$.ajax({
			type: 'GET',
			url: '/api/rentAdmin/rent',
			headers: createAuthorizationTokenHeader(),
			success: function(data){
				$('#editRentInfoName').val(data.name);
				$('#editRentInfoAddress').val(data.destination.address);
				$('#editRentInfoDescription').val(data.description);
				$('#dialogEditRentInformation').css('display','block');
			},
			error: function (jqXHR) {
            	if (jqXHR.status == 401) {
					showMessage('Login as rent administrator!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  ", "red");
				}
            }
		});
	}

function renderRentcar(rentacar) {
	console.log(rentacar);
	var tabela = $('#tabeleRent');
	tabela
			.append('<tr><th>Name</th><td><input type = "text" class = "field" value = "'
					+ rentacar.name
					+ '"><input type="hidden" id="idRent" value="'+rentacar.id+'"></td></tr>'
					+ '<tr><th>Address</th><td><input type = "text" class = "field" value = "'
					+ rentacar.destination.name
					+ '"></td></tr>'
					+ '<tr><th>Description</th><td><input type = "text" class = "field" value = "'
					+ rentacar.description
					+ '"></td></tr>'
					+'<tr><td colspan="2"><input type = "submit" id="save" value="Save"></td></tr>');
}

$(document).ready(function() {
	rentacarProfil();

	$(document).on('submit', "#edit_rent", function(e) {
		e.preventDefault();
		var name = $(".field").eq(0).val();
		var address = $(".field").eq(1).val();
		var description = $(".field").eq(2).val();
		var id = $("#idRent").val();
		$.ajax({
			type : 'PUT',
			url : '/rentacars/'+id,
			contentType : 'application/json',
			data : JSON.stringify({
				"name" : name,
				"description" : description
			}),
			success: function(){
				$(location).attr('href',"/");
			}
		})
	})
	
	$(document).on('click','#confirmChangesRentInformationBtn', function(){
		var name = $('#editRentInfoName').val();
		var address = $('#editRentInfoAddress').val();
		var description = $('#editRentInfoDescription').val();
		if(name == ""){
			showMessage('Rent name cannot be empty!', "orange");
			return;
		}
		if(address == ""){
			showMessage('Address cannot be empty!', "orange");
			return;
		}
		if(description == ""){
			showMessage('Description cannot be empty!', "orange");
			return;
		}
		
		$.ajax({
			type: 'GET',
			url: '/api/rentAdmin/rent',
			headers: createAuthorizationTokenHeader(),
			success: function(data){
				data.name = name;
				data.destination.address = address;
				data.description = description;
				$.ajax({
					type: 'PUT',
					url: '/api/changeRent',
					headers: createAuthorizationTokenHeader(),
        			data : JSON.stringify(data),
					success: function(data2){
						showMessage('Rent is successfully changed!', "green");
						$('#dialogEditRentInformation').css('display','none');
					},
					error: function (jqXHR) {
		            	if (jqXHR.status == 401) {
							showMessage('Login as rent administrator!', "orange");
						}else if(jqXHR.status == 406){
							showMessage('Rent name must be unique!', "orange");
						}else{
							showMessage('[' + jqXHR.status + "]  ", "red");
						}
		            }
				});
			},
			error: function (jqXHR) {
            	if (jqXHR.status == 401) {
					showMessage('Login as rent administrator!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  ", "red");
				}
            }
		});
	});
})