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
	    	$('#selectedRentVehiclesTable').html(`<tr><th>Brand</th><th>Model</th><th>Type</th><th>Grade</th><th>Full price</th><th>Select</th></tr>`);
	        $('#dialogRentView').css("display","none");
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
	                    showMessage("You don't have permission for getting current hotel!", "red");
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
					$(location).attr('href',"/");
					showMessage('Vehicle reservation successful!', "green");
				},
				error: function (jqXHR, exception) {
					showMessage('[' + jqXHR.status + "]  " + exception, "red");
				}
			})
		});});
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

	function calculatePrice(rooms,days){
		price = 0;
		for(var i=0;i<rooms.length;i++){
			price += (days * rooms[i].price);
		}
		return price;
	}