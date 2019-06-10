$(document).ready(function() {

    $(document).on('click','#addVehicleBtn',function(){
        $(location).attr('href',"/vehicle.html");
    });
    
    $(document).on('click','#addBranchOfficeBtn',function(){
        $(location).attr('href',"/branchOffice.html");
    });
    
    
    
	$(document).on('click','#logoutBtn',function(){
    	removeJwtToken();
        $(location).attr('href',"/logout");
	});
	
	$(document).on('click','#quitDialogRentView',function(){
	    	$('#selectedRentVehiclesTable').html(`<tr><th>Brand</th><th>Model</th><th>Type</th><th>Branch office</th><th>Grade</th><th>Full price</th><th>Select</th></tr>`);
	        $('#dialogRentView').css("display","none");
		});

	$(document).on('click', '#showRentInfoBtn', function() {
		$.ajax({
            type : 'GET',
            url : '/api/rentAdmin/rent',
            headers: createAuthorizationTokenHeader(),
            success: function(data){
				console.log("Admin's rent: ", data);
                $('#pNameOfChosenRentRemove').text(data.name);
                $('#pDescriptionOfChosenRentRemove').text(data.description);
                $('#pDestinationOfChosenRentRemove').text(data.destination.name +
                    ", " + data.destination.country);
                renderTableAllRentVehicles();
                $('#dialogRentViewRemove').css('display', 'block');
            },
            error: function (jqXHR) {
            	if (jqXHR.status == 401) {
					showMessage('Login as rent administrator!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  " + exception, "red");
				}
            }
        });
	});

	$(document).on('click', '#quitDialogRentViewRemove', function(){
		$('#dialogRentViewRemove').css('display', 'none');
	});

	$(document).on('click','table button',function(e){
        if(e.target.id.startsWith("removeVehicleID")){
            var id = e.target.id.substr(15);
            console.log("vehicle id: ", id);
            $.ajax({
        		type: 'DELETE',
        		url: '/api/removeVehicle/'+id,
        		headers: createAuthorizationTokenHeader(),
        		success: function(){
        			showMessage('Vehicle successfully removed!', 'green');
        			$(location).attr('href',"/rentACarAdmin.html");
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
	});
	 
	$(document).on('click', '#makeQuickReservation', function() {
			console.log("heeeej");
			$('#dialogRentView').css('display', 'block');
			$.ajax({
	            type : 'GET',
	            url : '/api/rentAdmin/rent',
	            headers: createAuthorizationTokenHeader(),
	            success: function(data){
					console.log("Admin's rent: ", data);
					$('#rentIdField').val(data.id);
	                $('#pNameOfChosenRent').text(data.name);
	                $('#pDescriptionOfChosenRent').text(data.description);
	                $('#pDestinationOfChosenRent').text(data.destination.name +
	                    ", " + data.destination.country);
	                $('#vehicleSearchArrivalDate').val(formatDate(new Date()));
	                var branches = "";
	                var res = "";
	                for(var j=0; j<data.offices.length; j++){
	                	branches = branches + data.offices[j].destination.name + ", ";
	                }
	                var len = branches.length-2;
	                res = branches.substring(0, len);
	                $('#pDestinationOfChosenRent').text(data.destination.name +
	                        ", " + data.destination.country);
	                $('#pBranchesOfChosenRent').text(res);
	                var link = '/api/rentBranches/'+$("#rentIdField").val();
	                $.get({url: link, 
	        			headers: createAuthorizationTokenHeader()}, function(data){
	                
	        		var select = document.getElementById("startDestination");
	        		var select2 = document.getElementById("endDestination");
	        		console.log(data);
	                for(var i=0;i<data.length;i++){
	                    var red = data[i];
	                    select.options[select.options.length] = new Option(''+red.destination.name,''+red.id);
	                    select2.options[select2.options.length] = new Option(''+red.destination.name,''+red.id);
	                }
	            });
	                $('#dialogRentView').css("display","block");
	            },
	            error: function (jqXHR) {
	                if(jqXHR.status == 401){
	                    showMessage("You don't have permission for getting current rent-a-car!", "red");
	                }
	            }
	        });
		});

		$(document).on('click','#vehicleSearchBtn', function(){
	        var rentId = $('#rentIdField').val();
	        var start = stringToDate($('#vehicleSearchArrivalDate').val());
			var end = start + $('#vehicleSearchDayNumber').val()*24*60*60*1000;
			var cars = $('#vehicleCars').prop('checked');
		    var motocycles = $('#vehicleMotocycles').prop('checked');
		    var e = document.getElementById("startDestination");
		    var startDest = e.options[e.selectedIndex].text
		    console.log('Rent: ', rentId ,'....', start, end, cars, motocycles, startDest);
	        renderVehicleTable(rentId, start, end, cars, motocycles,$('#vehicleSearchDayNumber').val(), startDest); });
		
		
		$(document).on('click','#makeRentReservationBtn',function(){
			selected_vehicles = [];
			console.log("VOZILAAAA: ", all_vehicles);
	        for(var i=0;i<all_vehicles.length;i++){
				var red = all_vehicles[i];
				if($('#vehicleCheckbox'+ red.id).prop('checked')){
					delete red.rentACar.hibernateLazyInitializer;
					delete red.rentACar.destination.hibernateLazyInitializer;
					selected_vehicles.push(red);
				}
			}
			var start = stringToDate($('#vehicleSearchArrivalDate').val());
			var end = start + ($('#vehicleSearchDayNumber').val()-1)*24*60*60*1000;	
			console.log("Selected vehicles: ", selected_vehicles);
			var price = calculatePrice(selected_vehicles, $('#vehicleSearchDayNumber').val());
			var discount = (100 - $('#discountId').val())/100;
			price = price * discount;
			var link = '/api/branchOffice/'+$("#endDestination option:selected" ).val();
			$.get(link, function(office){
			var reservation = {
				"start": new Date(start),
				"end": new Date(end),
				"vehicles": selected_vehicles,
				"rentACar": selected_vehicles[0].rentACar,
				"price": price,
				"endBranchOffice" : office
			};
			console.log("Vehicle reservation: ", reservation);
			if(reservation.vehicles.length == 0){
				showMessage("Select at least 1 vehicle!", "orange");
				return;
			}
			$.ajax({
				type : 'POST',
				url : "/api/vehicleReservations",
				headers: createAuthorizationTokenHeader(),
				data : JSON.stringify(reservation),
				success: function(){
					$(location).attr('href',"/rentACarAdmin.html");
					showMessage('Vehicle reservation successful!', "green");
				},
				error: function (jqXHR, exception) {
					showMessage('[' + jqXHR.status + "]  " + exception, "red");
				}
			})
		});});
		
		$(document).on('click', '#editProfileBtn', function(){
			$.ajax({
				type : 'GET',
				url : '/auth/getInfo',
				headers: createAuthorizationTokenHeader(),
				success: function(adminData){
					console.log("Admin data: ", adminData);
					$('#firstNameRentAdmin').val(adminData.firstName);
					$('#lastNameRentAdmin').val(adminData.lastName);
					$('#emailRentAdmin').val(adminData.email);
					$('#cityRentAdmin').val(adminData.city);
					$('#phoneRentAdmin').val(adminData.phoneNumber);

					$('#dialogEditRentAdminProfile').css('display', 'block');
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

		$(document).on('click', '#editRentAdminProfile', function(){
			var password = $('#passwordRentAdmin').val();
			console.log(password, $('#rep_passwordRentAdmin').val());
			if(password !== ""){
				var repeat = $('#rep_passwordRentAdmin').val();
				if(repeat !== password){
					showMessage('Password and repeat password are not equal!', 'orange');
					return;
				}
			}
			var data = {
				password: $('#passwordRentAdmin').val(),
				firstName: $('#firstNameRentAdmin').val(),
				lastName: $('#lastNameRentAdmin').val(),
				email: $('#emailRentAdmin').val(),
				city: $('#cityRentAdmin').val(),
				phone: $('#phoneRentAdmin').val()
			}

			$.ajax({
				type : 'POST',
				url : "/api/updateRentAdmin",
				headers: createAuthorizationTokenHeader(),
				data : JSON.stringify(data),
				success: function(){
					showMessage('Rent admin successfully updated!', "green");
					$('#dialogEditRentAdminProfile').css('display', 'none');
					if($('#passwordRentAdmin').val() == ""){
						$(location).attr('href',"/rentACarAdmin.html");
					}else{
						$(location).attr('href',"/logout");
					}

				},
				error: function (jqXHR, exception) {
					if (jqXHR.status == 401) {
						showMessage('Login as Rent administrator!', "orange");
					}else{
						showMessage('[' + jqXHR.status + "]  " + exception, "red");
					}
				}
			})
		});

		$(document).on('click', '#quitDialogEditRentAdmin', function(){
			$('#dialogEditRentAdminProfile').css('display', 'none');
		});
	})


	var renderVehicleTable = function(rentId, arrivalDate, departureDate, cars, motocycles, num, startDest){
	    var text = `/${rentId}/${arrivalDate}/${departureDate}/${cars}/${motocycles}/${startDest}`;
	    var link = '/api/vehiclesSearch'+text;
	    console.log(link);
	    $.get(link, function(VehicleData){
	            console.log("Vehicles: ", VehicleData);
	            var vehicles = VehicleData;
	            all_vehicles = vehicles;
	        	$('#selectedRentVehiclesTable').html(`<tr><th>Brand</th><th>Model</th><th>Type</th><th>Grade</th><th>Full price</th><th>Select</th></tr>`);
	            for(var i=0;i<vehicles.length;i++){
	                var red = vehicles[i];
	                checkBoxID = "vehicleCheckbox"+ red.id;
	                $('#selectedRentVehiclesTable tr:last').after(`<tr><td>${red.brand}</td><td>${red.model}</td><td>${red.type}</td><td>-</td><td>${red.price*num}</td><td>
	                <input type="checkbox" id=${checkBoxID}></td></tr>`);
	            }
	        });
	}

	var renderTableAllRentVehicles = function(){
		$.ajax({
			type: 'GET',
			url: '/api/unreservedVehicles',
			headers: createAuthorizationTokenHeader(),
			success: function(vehicles){
				console.log(vehicles)
				$('#vehicleTableRemove').html(`<tr><th>Brand</th><th>Model</th><th>Type</th><th>Branch office</th><th>Grade</th><th>Price per day</th><th></th></tr>`);
				for(var i=0;i<vehicles.length;i++){
					var red = vehicles[i];
					removeVehicleID = "removeVehicleID"+ red.id;
					$('#vehicleTableRemove tr:last').after(`<tr><td>${red.brand}</td><td>${red.model}</td><td>${red.type}</td><td>${red.branchOffice.destination.name}</td><td>-</td><td>${red.price}</td><td>
					<button id=${removeVehicleID}>Remove vehicle</button></td></tr>`);
				}
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

	function calculatePrice(vehicles, days){
		price = 0;
		for(var i=0;i<vehicles.length;i++){
			price += (days * vehicles[i].price);
		}
		return price;
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
		console.log(displayFormat);
		myDate=displayFormat.split("-");
		var newDate = myDate[1]+"/"+myDate[2]+"/"+myDate[0];
		console.log(newDate);
		return new Date(newDate).getTime();
	}

	function calculatePrice(vehicles,days){
		price = 0;
		for(var i=0;i<vehicles.length;i++){
			price += (days * vehicles[i].price);
		}
		return price;
	}