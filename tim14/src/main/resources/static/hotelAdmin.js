all_rooms = [];
selected_rooms = [];
all_hotel_services = [];
selected_hotel_services = [];

$(document).ready(function() {
	
	$.ajax({
		type: 'GET',
		url: '/auth/getInfo',
		headers: createAuthorizationTokenHeader(),
		success: function(data){
			if(data.passwordChanged){
				$('#passwordChangedTRUE').show();
				$('#passwordChangedFALSE').hide();
			}else{
				$('#passwordChangedTRUE').hide();
				$('#passwordChangedFALSE').show();
			}
		},
		error: function (jqXHR) {
        	if (jqXHR.status == 401) {
				showMessage('Login as hotel administrator!', "orange");
			}else{
				showMessage('[' + jqXHR.status + "]  " + exception, "red");
			}
        }
	});
	
	$(document).on('click','#firstTimeChangePassword', function(){
		//var currentPass = $('#oldPasswordField').val();
		var newPassword = $('#newPasswordField').val();
		var repNewPassword = $('#reNewPasswordField').val();
		if(newPassword == "" || repNewPassword == ""){
			showMessage("Please fill all the fields!", 'orange');
			return;
		}
		if(newPassword != repNewPassword){
			showMessage('New password and repeat new password fields must be equals!', 'orange');
			return;
		}
		
		$.ajax({
			type: 'POST',
			url: '/auth/initChangePassword',
			headers: createAuthorizationTokenHeader(),
			data : JSON.stringify({
				'currentPassword': '',
				newPassword,
				repNewPassword
			}),
			success: function(check){
				if(check){
					showMessage('Login once again and enjoy!', 'green');
			        $(location).attr('href',"/logout");
				}else{
					showMessage('Old password is not correct!', 'orange');
				}
			},
			error: function (jqXHR, exception) {
				if (jqXHR.status == 401) {
					showMessage('Login as hotel administrator!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  " + exception, "red");
				}
			}
		});

	});
	
	
	
	$.ajax({
        type : 'GET',
        url : '/api/hotelAdmin/hotel',
        headers: createAuthorizationTokenHeader(),
        success: function(data){
			console.log("Admin's hotel: ", data);
			$('#hiddenPForUserHotelID').val(data.id);
            $('#pNameOfChosenHotelRR').text(data.name);
            $('#pDescriptionOfChosenHotelRR').text(data.description);
            $('#pDestinationOfChosenHotelRR').text(data.destination.name +
                ", " + data.destination.country);
            renderTableAllRoomsAndServicesOfHotel();
            $('#dialogHotelViewRR').css('display', 'block');
        },
        error: function (jqXHR) {
        	if (jqXHR.status == 401) {
				showMessage('Login as hotel administrator!', "orange");
			}else{
				showMessage('[' + jqXHR.status + "]  " + exception, "red");
			}
        }
    });
	$('#showHotelInfoBtn').css('display', 'none');
	$('#quitDialogHotelViewRR').css('display','none');

	$(document).on('click', '#addRoomBtn', function() {
		$(location).attr('href', "/room.html");
	});

	$(document).on('click','#logoutBtn',function(){
    	removeJwtToken();
        $(location).attr('href',"/logout");
	});

	$(document).on('click','#quitDialogHotelView',function(){
        $('#dialogHotelView').css('display', 'none');
	});

	$(document).on('click', '#makeQuickReservation', function() {
		$('#dialogHotelView').css('display', 'block');
		$.ajax({
            type : 'GET',
            url : '/api/hotelAdmin/hotel',
            headers: createAuthorizationTokenHeader(),
            success: function(data){
				console.log("Admin's hotel: ", data);
				$('#hotelIdField').val(data.id);
                $('#pNameOfChosenHotel').text(data.name);
                $('#pDescriptionOfChosenHotel').text(data.description);
                $('#pDestinationOfChosenHotel').text(data.destination.name +
                    ", " + data.destination.country);
                $('#roomSearchArrivalDate').val(formatDate(new Date()));
                renderHotelServiceTable(data.id);
            },
            error: function (jqXHR) {
                if(jqXHR.status == 401){
                    showMessage("You don't have permission for getting current hotel!", "red");
                }
            }
        });
	});

	$(document).on('click','#roomSearchBtn', function(){
        var hotelId = $('#hotelIdField').val();
        var start = stringToDate($('#roomSearchArrivalDate').val());
		var end = start + $('#roomSearchDayNumber').val()*24*60*60*1000;
        var TwoBedRooms = $('#roomSearch2Bed').prop('checked');
        var ThreeBedRooms = $('#roomSearch3Bed').prop('checked');
        var FourBedRooms = $('#roomSearch4Bed').prop('checked');
        console.log('Hotel id: ', hotelId ,'....', start, end, TwoBedRooms, ThreeBedRooms, FourBedRooms);

        renderRoomTable(hotelId, start, end, TwoBedRooms, ThreeBedRooms, FourBedRooms, $('#roomSearchDayNumber').val());
	});
	
	$(document).on('click','#makeHotelReservationBtn', function(){
		selected_rooms = [];
		selected_hotel_services = [];
        for(var i=0;i<all_rooms.length;i++){
			var red = all_rooms[i];
			if($('#roomCheckbox'+ red.id).prop('checked')){
				delete red.hotel.hibernateLazyInitializer;
				delete red.hotel.destination.hibernateLazyInitializer;
				selected_rooms.push(red);
			}
		}
		for(var i=0;i<all_hotel_services.length;i++){
			var red = all_hotel_services[i];
			if($('#hotelServiceCheckbox'+ red.id).prop('checked')){
				delete red.hotel.hibernateLazyInitializer;
				delete red.hotel.destination.hibernateLazyInitializer;
				selected_hotel_services.push(red);
			}
		}
		var start = stringToDate($('#roomSearchArrivalDate').val());
		var end = start + ($('#roomSearchDayNumber').val() - 1)*24*60*60*1000;
		if(selected_rooms.length == 0){
			showMessage("Select at least 1 room!", "orange");
			return;
		}
		var price = calculatePrice(selected_rooms, selected_hotel_services, $('#roomSearchDayNumber').val());
		var discount = (100 - $('#discountId').val())/100;
		price = price * discount;
		var reservation = {
			"start": new Date(start),
			"end": new Date(end),
			"rooms": selected_rooms,
			"services": selected_hotel_services,
			"hotel": selected_rooms[0].hotel,
			"price": price
		};
		console.log("Hotel reservation: ", reservation);
		$.ajax({
			type : 'POST',
			url : "/api/roomReservations",
			headers: createAuthorizationTokenHeader(),
			data : JSON.stringify(reservation),
			success: function(){
				showMessage('Quick room reservation successful!', "green");
				$(location).attr('href',"/hotelAdmin.html");
			},
			error: function (jqXHR, exception) {
				if (jqXHR.status == 401) {
					showMessage('Login as hotel administrator!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  " + exception, "red");
				}
			}
		})
	});
	
	$(document).on('click', '#editProfileBtn', function(){
		$.ajax({
			type : 'GET',
			url : '/auth/getInfo',
			headers: createAuthorizationTokenHeader(),
			success: function(adminData){
				console.log("Admin data: ", adminData);
				$('#firstNameHotelAdmin').val(adminData.firstName);
				$('#lastNameHotelAdmin').val(adminData.lastName);
				$('#emailHotelAdmin').val(adminData.email);
				$('#cityHotelAdmin').val(adminData.city);
				$('#phoneHotelAdmin').val(adminData.phoneNumber);
				
				$('#dialogEditHotelAdminProfile').css('display', 'block');
			},
			error: function (jqXHR, exception) {
				if (jqXHR.status == 401) {
					showMessage('Login first!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  " + exception, "red");
				}
			}
		})
	});
	
	$(document).on('click', '#editHotelAdminProfile', function(){
		var password = $('#passwordHotelAdmin').val();
		console.log(password, $('#rep_passwordHotelAdmin').val());
		if(password !== ""){
			var repeat = $('#rep_passwordHotelAdmin').val();
			if(repeat !== password){
				showMessage('Password and repeat password are not equal!', 'orange');
				return;
			}
		}
		var data = {
			password: $('#passwordHotelAdmin').val(),
			firstName: $('#firstNameHotelAdmin').val(),
			lastName: $('#lastNameHotelAdmin').val(),
			email: $('#emailHotelAdmin').val(),
			city: $('#cityHotelAdmin').val(),
			phone: $('#phoneHotelAdmin').val()
		}
		
		$.ajax({
			type : 'POST',
			url : "/api/updateHotelAdmin",
			headers: createAuthorizationTokenHeader(),
			data : JSON.stringify(data),
			success: function(){
				showMessage('Hotel admin successfully updated!', "green");
				$('#dialogEditHotelAdminProfile').css('display', 'none');
				if($('#passwordHotelAdmin').val() == ""){
					$(location).attr('href',"/hotelAdmin.html");
				}else{
					$(location).attr('href',"/logout");
				}
				
			},
			error: function (jqXHR, exception) {
				if (jqXHR.status == 401) {
					showMessage('Login as hotel administrator!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  " + exception, "red");
				}
			}
		})
	});
	
	$(document).on('click', '#quitDialogEditHotelAdmin', function(){
		$('#dialogEditHotelAdminProfile').css('display', 'none');
	});
	
	$(document).on('click', '#showHotelInfoBtn', function() {
		$('#showHotelInfoBtn').css('display', 'none');
		$.ajax({
            type : 'GET',
            url : '/api/hotelAdmin/hotel',
            headers: createAuthorizationTokenHeader(),
            success: function(data){
				console.log("Admin's hotel: ", data);
                $('#pNameOfChosenHotelRR').text(data.name);
                $('#pDescriptionOfChosenHotelRR').text(data.description);
                $('#pDestinationOfChosenHotelRR').text(data.destination.name +
                    ", " + data.destination.country);
                renderTableAllRoomsAndServicesOfHotel();
                $('#dialogHotelViewRR').css('display', 'block');
            },
            error: function (jqXHR) {
            	if (jqXHR.status == 401) {
					showMessage('Login as hotel administrator!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  ", "red");
				}
            }
        });
	});
	
	$(document).on('click', '#quitDialogHotelViewRR', function(){
		$('#dialogHotelViewRR').css('display', 'none');
	});
	
	$(document).on('click','table button',function(e){
        if(e.target.id.startsWith("removeRoomID")){
            var id = e.target.id.substr(12);
            console.log("Selektovana je soba sa id-em: ", id);
            $.ajax({
        		type: 'DELETE',
        		url: '/api/removeRoom/'+id,
        		headers: createAuthorizationTokenHeader(),
        		success: function(){
        			showMessage('Room successfully removed!', 'green');
        			$(location).attr('href',"/hotelAdmin.html");
        		},
        		error: function (jqXHR, exception) {
        			if (jqXHR.status == 401) {
        				showMessage('Login first!', "orange");
        			}else{
        				showMessage('[' + jqXHR.status + "]  " + exception, "red");
        			}
        		}
        	});
        }else if(e.target.id.startsWith("editRoomID")){
        	var id = e.target.id.substr(10);
            console.log("Selektovana je soba sa id-em: ", id);
            $.ajax({
            	type: 'GET',
            	url: '/api/room/' + id,
            	headers: createAuthorizationTokenHeader(),
            	success: function(data){
            		console.log("Room: ", data);
            		$("#bedNumberEditRoom").html('');
            		var select = document.getElementById("bedNumberEditRoom");
            		var array = [2,3,4];
                    for(var i=0;i<array.length;i++){
                        select.options[select.options.length] = new Option(array[i],''+array[i]);
                    }
                    $("#bedNumberEditRoom").val("" + data.bedNumber);
                    
                    $('#priceEditRoom').val(data.price);
                    $('#roomNumberEditRoom').val(data.roomNumber);
                    
                    $('#hiddenPForUser').val(id);
            		$('#dialogEditHotelRoom').css('display', 'block');
            	},
            	error: function (jqXHR) {
                	if (jqXHR.status == 401) {
    					showMessage('Login as hotel administrator!', "orange");
    				}else{
    					showMessage('[' + jqXHR.status + "]  ", "red");
    				}
                }
            });
        }else if(e.target.id.startsWith("hotelServiceApplyBtn")){
        	var id = e.target.id.substr(20);
	        var price = $('#hotelServiceSetPriceField'+id).val();
	        if(price == ""){
	        	showMessage('Price cannot be empty!', 'orange');
	        	return;
	        }
	        if(price < 0){
	        	showMessage('Price must be positive number!', 'orange');
	        	return;
	        }
	        $.ajax({
            	type: 'GET',
            	url: '/api/hotelServicesByID/' + id,
            	headers: createAuthorizationTokenHeader(),
            	success: function(data){
            		data.price = price;
            		$.ajax({
            			type: 'PUT',
            			url: '/api/changeHotelService',
            			headers: createAuthorizationTokenHeader(),
            			data : JSON.stringify(data),
            			success: function(data){
        					showMessage('Successfully updated hotel service price', "green");
            				renderTableAllRoomsAndServicesOfHotel();
            			},
            			error: function (jqXHR) {
                        	if (jqXHR.status == 401) {
            					showMessage('Login as hotel administrator!', "orange");
            				}else if (jqXHR.status == 406) {
            					showMessage('Hotel service must be unique!', "orange");
            				}else{
            					showMessage('[' + jqXHR.status + "]  ", "red");
            				}
                        }
            		});
            	},
            	error: function (jqXHR) {
                	if (jqXHR.status == 401) {
    					showMessage('Login as hotel administrator!', "orange");
    				}else{
    					showMessage('[' + jqXHR.status + "]  ", "red");
    				}
                }
            });
	        
        }
	});
	
	$(document).on('click', '#quitDialogEditHotelRoom', function(){
		$('#dialogEditHotelRoom').css('display', 'none');
	});
	
	$(document).on('click', '#editHotelRoomBtn', function(){
		var price = $('#priceEditRoom').val();
		var roomNumber = $('#roomNumberEditRoom').val();
		var bedNumber = $('#bedNumberEditRoom option:selected').val();
		if(roomNumber < 0){
			showMessage('Room number must be positive number!', 'orange');
			return;
		}
		if(price < 0){
			showMessage('Price must be positive number!', 'orange');
			return;
		}
		
		$.ajax({
        	type: 'GET',
        	url: '/api/room/' + $('#hiddenPForUser').val(),
        	headers: createAuthorizationTokenHeader(),
        	success: function(roomData){
        		roomData.price = parseInt(price);
        		roomData.roomNumber = parseInt(roomNumber);
        		roomData.bedNumber = parseInt(bedNumber);
        		console.log("ROOOOM: ", roomData);
        		$.ajax({
        			type: 'PUT',
        			url: '/api/changeRoom',
        			headers: createAuthorizationTokenHeader(),
        			data : JSON.stringify(roomData),
        			success: function(data){
        				console.log(data);
        				showMessage('Room is successfully changed!', 'green');
        				$('#dialogEditHotelRoom').css('display', 'none');
        				renderTableAllRoomsAndServicesOfHotel();
        			},
        			error: function (jqXHR) {
                    	if (jqXHR.status == 401) {
        					showMessage('Login as hotel administrator!', "orange");
        				}else if (jqXHR.status == 406) {
        					showMessage('Room number must be unique!', "orange");
        				}else{
        					showMessage('[' + jqXHR.status + "]  ", "red");
        				}
                    }
        		});
        	},
        	error: function (jqXHR) {
            	if (jqXHR.status == 401) {
					showMessage('Login as hotel administrator!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  ", "red");
				}
            }
        });
	});
	
	$(document).on('click','#addHotelServiceBtn', function(){
		$.ajax({
	        type : 'GET',
	        url : '/api/hotelAdmin/hotel',
	        headers: createAuthorizationTokenHeader(),
	        success: function(data){
				console.log("Admin's hotel: ", data);
				$('#myPServiceSave').val(data.id);
				$('#extraDiscountHotel').val(data.extraServiceDiscount);
				$('#dialogNewHotelService').css("display", "block");
	        },
	        error: function (jqXHR) {
	        	if (jqXHR.status == 401) {
					showMessage('Login as hotel administrator!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  " + exception, "red");
				}
	        }
	    });
		
	});
	
	$(document).on('click', '#confirmExtraDiscount', function(){
		var discount = $('#extraDiscountHotel').val();
		if(isNaN(discount) || discount == ""){
			showMessage('Discount must be a number', 'orange');
			return;
		}
		if(discount<0 || discount>100){
			showMessage('Discount is not in limit between 0% and 100%', 'orange');
			return;
		}
		
		$.ajax({
			type: 'PUT',
			url: '/api/setRoomDiscountServices',
			headers: createAuthorizationTokenHeader(),
			data : JSON.stringify({
				discount
			}),
			success: function(data){
				console.log(data);
				showMessage('Room discount on extra services is changed!', 'green');
				$('#dialogNewHotelService').hide();
			},
			error: function (jqXHR) {
            	if (jqXHR.status == 401) {
					showMessage('Login as hotel administrator!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  ", "red");
				}
            }
		});
		
		
	});
	
	$(document).on('click','#quitDialogHotelService', function(){
		$('#dialogNewHotelService').css("display", "none");
	});
	
	$(document).on('click','#confirmAddingHotelServiceBtn', function(){
		var name = $('#newHotelServiceName').val();
		if(name == ""){
			showMessage('Name cannot be empty text!', 'orange');
			return;
		}
		var price = $('#newHotelServicePrice').val();
		if(price < 0){
			showMessage('Price must be positive number!', 'orange');
			return;
		}
		var data = {price,name}
		console.log(data);
		$.ajax({
			type: 'POST',
			url: '/api/hotelService',
			headers: createAuthorizationTokenHeader(),
			data : JSON.stringify(data),
			success: function(data){
				showMessage('Hotel service is successfully added!', 'green');
				$('#dialogNewHotelService').css('display', 'none');
			},
			error: function (jqXHR) {
            	if (jqXHR.status == 401) {
					showMessage('Login as hotel administrator!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  ", "red");
				}
            }
		});
		
	});
	
	$(document).on('click','#editHotelBtn', function(){
		$.ajax({
			type: 'GET',
			url: '/api/hotelAdmin/hotel',
			headers: createAuthorizationTokenHeader(),
			success: function(data){
				$('#editHotelInfoName').val(data.name);
				$('#editHotelInfoAddress').val(data.destination.address);
				$('#editHotelInfoDescription').val(data.description);
				$('#dialogEditHotelInformation').css('display','block');
			},
			error: function (jqXHR) {
            	if (jqXHR.status == 401) {
					showMessage('Login as hotel administrator!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  ", "red");
				}
            }
		});
	});
	
	$(document).on('click','#quitDialogEditHotelInfo', function(){
		$('#dialogEditHotelInformation').css('display','none');
	});
	
	$(document).on('click','#confirmChangesHotelInformationBtn', function(){
		var name = $('#editHotelInfoName').val();
		var address = $('#editHotelInfoAddress').val();
		var description = $('#editHotelInfoDescription').val();
		if(name == ""){
			showMessage('Hotel name cannot be empty!', "orange");
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
			url: '/api/hotelAdmin/hotel',
			headers: createAuthorizationTokenHeader(),
			success: function(data){
				data.name = name;
				data.destination.address = address;
				data.description = description;
				$.ajax({
					type: 'PUT',
					url: '/api/changeHotel',
					headers: createAuthorizationTokenHeader(),
        			data : JSON.stringify(data),
					success: function(data2){
						showMessage('Hotel is successfully changed!', "green");
						$('#dialogEditHotelInformation').css('display','none');
					},
					error: function (jqXHR) {
		            	if (jqXHR.status == 401) {
							showMessage('Login as hotel administrator!', "orange");
						}else if(jqXHR.status == 406){
							showMessage('Hotel name must be unique!', "orange");
						}else{
							showMessage('[' + jqXHR.status + "]  ", "red");
						}
		            }
				});
			},
			error: function (jqXHR) {
            	if (jqXHR.status == 401) {
					showMessage('Login as hotel administrator!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  ", "red");
				}
            }
		});
	});
	
})


var renderHotelServiceTable = function(hotelId){
    $.get('/api/hotelServicesSearch/'+hotelId, function(servicesData){
        console.log("Hotel Services: ", servicesData);
		var services = servicesData;
		all_hotel_services = services;
        $('#selectedHotelServicesTable').html(`<tr><th>Name</th><th>Price</th><th>Select</th></tr>`);
        for(var i=0;i<services.length;i++){
            var red = services[i];
            checkBoxID = "hotelServiceCheckbox"+ red.id;
            $('#selectedHotelServicesTable tr:last').after(`<tr><td>${red.name}</td><td>${red.price}</td><td><input type="checkbox" id=${checkBoxID}></td></tr>`);
        }
        $('#dialogHotelView').css("display","block");
    });
}


var renderRoomTable = function(hotelId, arrivalDate, departureDate, TwoBedRooms, ThreeBedRooms, FourBedRooms, numDays){
    var text = `/${hotelId}/${arrivalDate}/${departureDate}/${TwoBedRooms}/${ThreeBedRooms}/${FourBedRooms}`;
    $.get('/api/roomsSearch'+text, function(RoomData){
		console.log("Rooms: ", RoomData);
		var rooms = RoomData;
		all_rooms = rooms;
		$('#selectedHotelRoomsTable').html(`<tr><th>Floor number</th><th>Number of beds</th><th>Grade</th><th>Full price</th><th>Select</th></tr>`);
		for(var i=0;i<rooms.length;i++){
			var red = rooms[i];
			checkBoxID = "roomCheckbox"+ red.id;
			$('#selectedHotelRoomsTable tr:last').after(`<tr><td>${red.floor}</td><td>${red.bedNumber}</td><td>-</td><td>${red.price*numDays}</td><td>
			<input type="checkbox" id=${checkBoxID}></td></tr>`);
		}
	});
}

var renderTableAllRoomsAndServicesOfHotel = function(){
	$.ajax({
		type: 'GET',
		url: '/api/unreservedRooms',
		headers: createAuthorizationTokenHeader(),
		success: function(rooms){
			$('#hotelRoomsTableRR').html(`<tr><th>Room number</th><th>Floor number</th><th>Number of beds</th><th>Grade</th><th>Price per day</th><th>Remove room</th><th>Change room</th></tr>`);
			rooms.sort((a, b) => (a.roomNumber > b.roomNumber) ? 1 : -1)
			for(var i=0;i<rooms.length;i++){
				var red = rooms[i];
				removeRoomID = "removeRoomID"+ red.id;
				var changeRoomID = "editRoomID" + red.id;
				$('#hotelRoomsTableRR tr:last').after(`<tr><td>${red.roomNumber}</td><td>${red.floor}</td><td>${red.bedNumber}</td><td>-</td><td>${red.price}</td><td>
				<button id=${removeRoomID}>Remove</button></td><td>
				<button id=${changeRoomID}>Change</button></td></tr>`);
			}
			
			$.get('/api/hotelServicesSearch/'+ $('#hiddenPForUserHotelID').val(), function(servicesData){
		        console.log("Hotel Services: ", servicesData);
				var services = servicesData;
		        $('#hotelServicesTableRR').html(`<tr><th>Name</th><th>Price</th><th>Change</th></tr>`);
		        for(var i=0;i<services.length;i++){
		            var red = services[i];
		            var buttonSEID = "hotelServiceApplyBtn"+ red.id;
		            var inputTextService = "hotelServiceSetPriceField" + red.id;
		            $('#hotelServicesTableRR tr:last').after(`<tr><td>${red.name}</td><td><input type="number" min="1" style="text-align:center;" value=${red.price} id=${inputTextService}></td><td><button id=${buttonSEID}>Change price</button></td></tr>`);
		        }
		    });
		},
		error: function (jqXHR, exception) {
			if (jqXHR.status == 401) {
				showMessage('Login first!', "orange");
			}else{
				showMessage('[' + jqXHR.status + "]  " + exception, "red");
			}
		}
	});
}

function formatDate(date) {
    month = '' + (date.getMonth() + 1);
    day = '' + date.getDate();
    year = date.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
	return [year, month, day].join('-');

}

function stringToDate(displayFormat){
	myDate=displayFormat.split("-");
	var newDate = myDate[1]+"/"+myDate[2]+"/"+myDate[0];
	console.log(newDate);
	return new Date(newDate).getTime();
}

function calculatePrice(rooms, services, days){
	price = 0;
	for(var i=0;i<rooms.length;i++){
		price += (days * rooms[i].price);
	}
	for(var i=0;i<services.length;i++){
		price += services[i].price;
	}

	return price;
}