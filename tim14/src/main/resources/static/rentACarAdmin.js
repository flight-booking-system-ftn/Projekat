$(document).ready(function() {

	$.ajax({
		type: 'GET',
		url: '/auth/getInfo',
		headers: createAuthorizationTokenHeader(),
		success: function(data){
			if(data.passwordChanged){
				$('#passwordChangedTRUE').show();
				$('#passwordChangedFALSE').hide();
				$.ajax({
		            type : 'GET',
		            url : '/api/rentAdmin/rent',
		            headers: createAuthorizationTokenHeader(),
		            success: function(data){
		            	 $.get({url:'/api/getGradeForRent',
		     	    		headers: createAuthorizationTokenHeader()}, function(data){
		     	    		var i = 0;
		     	    		var onStar = data;
		     	    		var stars = $('.li.star');
		     	    		console.log("AAAA", onStar);
		     	    		$("ul li").each(function() {
		     	    			$(this).removeClass('selected');
		     	   		    })  
		     	    		$("ul li").each(function() {
		     	    			if(i<onStar){
		     	    				$(this).addClass('selected');
		     	    				i++;}
		     	    			else return false;
		     	   		    })
		     	       })
						console.log("Admin's rent: ", data);
		                $('#pNameOfChosenRentRemove').text(data.name);
		                $('#pDescriptionOfChosenRentRemove').text(data.description);
		                $('#pDestinationOfChosenRentRemove').text(data.destination.name +
		                    ", " + data.destination.country);
		                renderBranchOfficesTable();
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
			}else{
				$('#passwordChangedTRUE').hide();
				$('#passwordChangedFALSE').show();
			}
		},
		error: function (jqXHR) {
        	if (jqXHR.status == 401) {
				showMessage('Login as rent administrator!', "orange");
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
					showMessage('Login as rent administrator!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  " + exception, "red");
				}
			}
		});

	});
	
    $(document).on('click','#addVehicleBtn',function(){
        $(location).attr('href',"/vehicle.html");
    });
    
    $(document).on('click','#addBranchOfficeBtn',function(){
        $(location).attr('href',"/branchOffice.html");
    });
    
    $(document).on('click','#allVehicles',function(){
    	renderTableRentVehicles();
    	$("#allVehiclesContainer").css("display", "block");
    });
    
    $(document).on('click','#quitAllVehicles',function(){
    	$("#allVehiclesContainer").css("display", "none");
    });
    
    $(document).on('click','#editRentBtn', function(){
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
	});
    
    $(document).on('click', "#showReports", function(){
    	$("#chartContainer").css('display', 'block');
    	
    })
    
    $(document).on('click', '#showRentIncomes', function(){
    	console.log("e");
    	var startCheck = $('#startIncomeRent').val();
    	var endCheck = $('#endIncomeRent').val();
    	if(startCheck == "" || endCheck == ""){
    		showMessage("Enter start and end date", "orange");
    		return;
    	}
    	var start = stringToDate($('#startIncomeRent').val());
    	console.log(start);
    	var end = stringToDate($('#endIncomeRent').val());
    	if(start>end){
    		showMessage("Start date must be later then end date", "orange");
    		return;
    	}
    	var start = stringToDate($('#startIncomeRent').val())- 24*60*60*1000
    	var end = stringToDate($('#endIncomeRent').val()) + 24*60*60*1000
    	$.get({url: '/api/getRentIncomes/'+start+'/'+end, 
			headers: createAuthorizationTokenHeader()}, function(income){
				console.log(income);
				$("#rentIncomeVal").html(income);
			})
    })
    
    $(document).on('click', '#showGraph', function(){
    	var ctx = $("#myChart");
    	var type = $("#chartType").val();
    	if(type=="daily"){
    		$.get({url: '/api/getDailyVehicles', 
    			headers: createAuthorizationTokenHeader()}, function(data){
    				console.log("data", data);
			    	var myChart = new Chart(ctx, {
			    	  type: 'bar',
			    	  data: {
			    	    labels: data.x,
			    	    datasets: [{
			    	      label: 'Number of vehicles',
			    	      data: data.x,
			    	      backgroundColor:[
			    	        'rgba(54, 162, 235, 0.3)',
			    	        'rgba(75, 192, 192, 0.3)',
			    	        'rgba(54, 162, 235, 0.3)',
			    	        'rgba(75, 192, 192, 0.3)',
			    	        'rgba(54, 162, 235, 0.3)',
			    	        'rgba(75, 192, 192, 0.3)',
			    	        'rgba(54, 162, 235, 0.3)',
			    	        'rgba(75, 192, 192, 0.3)',
			    	        'rgba(54, 162, 235, 0.3)',
			    	        'rgba(75, 192, 192, 0.3)',
			    	        'rgba(54, 162, 235, 0.3)',
			    	        'rgba(75, 192, 192, 0.3)',
			    	        'rgba(54, 162, 235, 0.3)',
			    	        'rgba(75, 192, 192, 0.3)'
			    	      ],
			    	      borderColor: [
			    	        'rgba(54, 162, 235, 1)',
			    	        'rgba(75, 192, 192, 1)',
			    	        'rgba(54, 162, 235, 1)',
			    	        'rgba(75, 192, 192, 1)',
			    	        'rgba(54, 162, 235, 1)',
			    	        'rgba(75, 192, 192, 1)',
			    	        'rgba(54, 162, 235, 1)',
			    	        'rgba(75, 192, 192, 1)',
			    	        'rgba(54, 162, 235, 1)',
			    	        'rgba(75, 192, 192, 1)',
			    	        'rgba(54, 162, 235, 1)',
			    	        'rgba(75, 192, 192, 1)',
			    	        'rgba(54, 162, 235, 1)',
			    	        'rgba(75, 192, 192, 1)'
			    	      ],
			    	      borderWidth: 1
			    	    }]
			    	 },
			    })
			 })
    	}else if(type=="weekly"){
    		$.get({url: '/api/getWeeklyVehicles', 
    			headers: createAuthorizationTokenHeader()}, function(data){
    				console.log("data", data);
			    	var myChart = new Chart(ctx, {
			    	  type: 'bar',
			    	  data: {
			    	    labels: data.x,
			    	    datasets: [{
			    	      label: 'Number of vehicles',
			    	      data: data.y,
			    	      backgroundColor: [
			    	    	  	'rgba(54, 162, 235, 0.3)',
				    	        'rgba(75, 192, 192, 0.3)',
				    	        'rgba(54, 162, 235, 0.3)',
				    	        'rgba(75, 192, 192, 0.3)',
				    	        'rgba(54, 162, 235, 0.3)',
				    	        'rgba(75, 192, 192, 0.3)',
				    	        'rgba(54, 162, 235, 0.3)',
				    	        'rgba(75, 192, 192, 0.3)',
				    	        'rgba(54, 162, 235, 0.3)',
				    	        'rgba(75, 192, 192, 0.3)',
				    	        'rgba(54, 162, 235, 0.3)',
				    	        'rgba(75, 192, 192, 0.3)'
			    	      ],
			    	      borderColor: [
			    	    	  	'rgba(54, 162, 235, 1)',
				    	        'rgba(75, 192, 192, 1)',
				    	        'rgba(54, 162, 235, 1)',
				    	        'rgba(75, 192, 192, 1)',
				    	        'rgba(54, 162, 235, 1)',
				    	        'rgba(75, 192, 192, 1)',
				    	        'rgba(54, 162, 235, 1)',
				    	        'rgba(75, 192, 192, 1)',
				    	        'rgba(54, 162, 235, 1)',
				    	        'rgba(75, 192, 192, 1)',
				    	        'rgba(54, 162, 235, 1)',
				    	        'rgba(75, 192, 192, 1)'
			    	      ],
			    	      borderWidth: 1
			    	    }]
			    	 },
			    })
			 })
    	}else if(type=="monthly"){
    		$.get({url: '/api/getMonthlyVehicles', 
    			headers: createAuthorizationTokenHeader()}, function(data){
    				console.log("data", data);
			    	var myChart = new Chart(ctx, {
			    	  type: 'bar',
			    	  data: {
			    	    labels: data.x,
			    	    datasets: [{
			    	      label: 'Number of vehicles',
			    	      data: data.y,
			    	      backgroundColor: [
			    	    	  'rgba(54, 162, 235, 0.3)',
				    	      'rgba(75, 192, 192, 0.3)',
				    	      'rgba(54, 162, 235, 0.3)',
				    	      'rgba(75, 192, 192, 0.3)',
				    	      'rgba(54, 162, 235, 0.3)',
				    	      'rgba(75, 192, 192, 0.3)',
				    	      'rgba(54, 162, 235, 0.3)',
				    	      'rgba(75, 192, 192, 0.3)',
				    	      'rgba(54, 162, 235, 0.3)',
				    	      'rgba(75, 192, 192, 0.3)',
				    	      'rgba(54, 162, 235, 0.3)',
				    	      'rgba(75, 192, 192, 0.3)'
			    	      ],
			    	      borderColor: [
			    	    	  'rgba(54, 162, 235, 1)',
				    	      'rgba(75, 192, 192, 1)',
				    	      'rgba(54, 162, 235, 1)',
				    	      'rgba(75, 192, 192, 1)',
				    	      'rgba(54, 162, 235, 1)',
				    	      'rgba(75, 192, 192, 1)',
				    	      'rgba(54, 162, 235, 1)',
				    	      'rgba(75, 192, 192, 1)',
				    	      'rgba(54, 162, 235, 1)',
				    	      'rgba(75, 192, 192, 1)',
				    	      'rgba(54, 162, 235, 1)',
				    	      'rgba(75, 192, 192, 1)'
			    	      ],
			    	      borderWidth: 1
			    	    }]
			    	 },
			    })
			 })
    	}
			  
    })
    
    $(document).on('click', "#hideReports", function(){
    	$("#chartContainer").css('display', 'none');
    	
    })
    
    $(document).on('click','#quitDialogEditRentInfo', function(){
		$('#dialogEditRentInformation').css('display','none');
	});
    
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
    
	$(document).on('click','#logoutBtn',function(){
    	removeJwtToken();
        $(location).attr('href',"/logout");
	});
	
	$(document).on('click','#quitDialogRentView',function(){
	    	$('#selectedRentVehiclesTable').html(`<tr><th>Brand</th><th>Model</th><th>Type</th><th>Branch office</th><th>Grade</th><th>Full price</th><th>Select</th></tr>`);
	        $('#dialogRentView').css("display","none");
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
        else if(e.target.id.startsWith("editVehicleID")){
        	var id = e.target.id.substr(13);
            console.log("vehicle ", id);
            $.ajax({
            	type: 'GET',
            	url: '/api/vehicle/' + id,
            	headers: createAuthorizationTokenHeader(),
            	success: function(data){
            		$("#vehicleBranchOfficeEdit").html('');
            		$.get({url: '/api/rentBranchess', 
            			headers: createAuthorizationTokenHeader()}, function(branch){
            		var select = document.getElementById("vehicleBranchOfficeEdit");
            		console.log(branch);
                    for(var i=0;i<branch.length;i++){
                        var red = branch[i];
                        select.options[select.options.length] = new Option(''+red.destination.name,''+red.id);
                    }
                    //$("#vehicleBranchOfficeEdit").val("" + data.branch.id);
            		$('#priceEditVehicle').val(data.price);
            		$('#hiddenPForUser').val(id);
            		$('#dialogEditHRentVehicle').css('display', 'block');
            			})},
            	error: function (jqXHR) {
                	if (jqXHR.status == 401) {
    					showMessage('Login as rent administrator!', "orange");
    				}else{
    					showMessage('[' + jqXHR.status + "]  ", "red");
    				}
                }
            });
            }
	});
	 
	$(document).on('click', '#editRentVehicleBtn', function(){
		var price = $('#priceEditRoom').val();
		var price = $('#priceEditVehicle').val();
		var branch = $('#vehicleBranchOfficeEdit option:selected').val();
		if(price < 0){
			showMessage('Price must be positive number!', 'orange');
			return;
		}
		
		$.ajax({
        	type: 'GET',
        	url: '/api/vehicle/' + $('#hiddenPForUser').val(),
        	headers: createAuthorizationTokenHeader(),
        	success: function(vehicle){
        		vehicle.price = parseInt(price);
        		var link = '/api/branchOffice/'+$("#vehicleBranchOfficeEdit option:selected" ).val();
        		$.get(link, function(branches){
        			vehicle.branchOffice= branches;
        		})
        		console.log("Vehicle: ", vehicle);
        		$.ajax({
        			type: 'PUT',
        			url: '/api/editVehicle',
        			headers: createAuthorizationTokenHeader(),
        			data : JSON.stringify(vehicle),
        			success: function(data){
        				console.log(data);
        				showMessage('Vehicle is successfully changed!', 'green');
        				$('#dialogEditHRentVehicle').css('display', 'none');
        				renderTableAllRentVehicles();
        			},
        			error: function (jqXHR) {
                    	if (jqXHR.status == 401) {
        					showMessage('Login as rent administrator!', "orange");
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
	
	$(document).on('click', "#quitDialogEditRentVehicle", function(){
		$('#dialogEditHRentVehicle').css('display', 'none');
	})
	
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
			if($('#discountId').val() < 0 || $('#discountId').val() > 100){
				showMessage("Discount must be between 0% and 100% ", 'orange');
				return;
			}
			var price = calculatePrice(selected_vehicles, $('#vehicleSearchDayNumber').val());
			var discount = $('#discountId').val()
			price = Math.round(price);
			if(selected_vehicles.length == 0){
				showMessage("Select at least 1 vehicle!", "orange");
				return;
			}
			var link = '/api/branchOffice/'+$("#endDestination option:selected" ).val();
			$.get(link, function(office){
			var reservation = {
				"start": new Date(start),
				"end": new Date(end),
				"vehicles": selected_vehicles,
				"rentACar": selected_vehicles[0].rentACar,
				"price": price,
				"discount": discount,
				"endBranchOffice" : office
			};
			console.log("Vehicle reservation: ", reservation);
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
				$('#vehicleTableRemove').html(`<tr><th>Brand</th><th>Model</th><th>Type</th><th>Branch office</th><th>Grade</th><th>Price per day</th><th></th><th></th></tr>`);
				for(var i=0;i<vehicles.length;i++){
					var red = vehicles[i];
					removeVehicleID = "removeVehicleID"+ red.id;
					editVehicleID="editVehicleID" + red.id;
					$('#vehicleTableRemove tr:last').after(`<tr><td>${red.brand}</td><td>${red.model}</td><td>${red.type}</td><td>${red.branchOffice.destination.name}</td><td>-</td><td>${red.price}</td><td>
					<button id=${removeVehicleID}>Remove vehicle</button></td><td><button id=${editVehicleID}>Edit vehicle</button></td></tr>`);
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

	var renderTableRentVehicles = function(){
		$.ajax({
			type: 'GET',
			url: '/api/allVehicles',
			headers: createAuthorizationTokenHeader(),
			success: function(vehicles){
				console.log(vehicles)
				$('#allVehiclesTable').html(`<tr><th>Brand</th><th>Model</th><th>Type</th><th>Branch office</th><th>Grade</th><th>Price per day</th></tr>`);
				for(var i=0;i<vehicles.length;i++){
					var red = vehicles[i];
					var forGrade = `<section class='rating-widget'>
					<div class='rating-stars text-center' height="20" width="100">
					  <ul>
					      <li class='star' title='Poor' data-value='1'>
		    			  	<i class='fa fa-star fa-fw'></i>
			   			 </li>
			     		 <li class='star' title='Fair' data-value='2'>
			        		<i class='fa fa-star fa-fw'></i>
			      		 </li>
			     		 <li class='star' title='Good' data-value='3'>
			       			<i class='fa fa-star fa-fw'></i>
			      		 </li>
			     		 <li class='star' title='Excellent' data-value='4'>
			        		<i class='fa fa-star fa-fw'></i>
			      		 </li>
			      		 <li class='star' title='WOW!!!' data-value='5'>
			        	 	<i class='fa fa-star fa-fw'></i>
			     		 </li>
		    		 </ul>
  				</div>	
  			</section>`
			$('#allVehiclesTable tr:last').after(`<tr><td>${red.brand}</td><td>${red.model}</td><td>${red.type}</td><td>${red.branchOffice.destination.name}</td><td>${forGrade}</td><td>${red.price}</td></tr>`);
			$.get({url:'/api/getMediumGradeForVehicle/'+red.id,
				headers: createAuthorizationTokenHeader()}, function(data){
	     	    	var i = 0;
	     	    	var onStar = data;
	     	    	var stars = $('.li.star');
	     	    	console.log("AAAA", onStar);
	     	    	$("ul li").each(function() {
	     	    		$(this).removeClass('selected');
	     	   		})  
	     	    	$("ul li").each(function() {
	     	    		if(i<onStar){
	     	    			$(this).addClass('selected');
	     	    			i++;
	     	    		}
	     	    		else
	     	    			return false;
	     	   		 })
	     	      })
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
	var renderBranchOfficesTable = function(){
		
		$.get({url: '/api/branchOfficeByRentt',
			headers: createAuthorizationTokenHeader()}, function(offices){
	        console.log("Offices: ", offices);
	        $('#RentBranchOfficeTable').html(`<tr><th>Address</th><th>City</th><th>Country</th><th></tr>`);
	        for(var i=0;i<offices.length;i++){
	            var red = offices[i];
	            $('#RentBranchOfficeTable tr:last').after(`<tr><td>${red.destination.address}</td><td>${red.destination.name}</td><td>${red.destination.country}</td></tr>`);
	        }
	    });
	}