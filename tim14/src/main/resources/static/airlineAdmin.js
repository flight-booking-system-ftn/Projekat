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
				showMessage('Login as airline administrator!', "orange");
			}else{
				showMessage('[' + jqXHR.status + "]  ", "red");
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
					showMessage('Login as airline administrator!', "orange");
				}else{
					showMessage('[' + jqXHR.status + "]  ", "red");
				}
			}
		});

	});
	
	var options = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
	
	getAirports();
	
    function getAirports() {
    	$.ajax({
    		type: "GET",
    		url: "/api/airline/airports",
    		headers: createAuthorizationTokenHeader(),
    		success: function(data) {
    			var from = $("select#from");
    			var to = $("select#to");
    			var stops = $("div#stopsDiv");
    			var i = 0;
    	    	
    	    	$.each(data, function(index, airport) {
    	    		var fromOption = $("<option id='" + airport.id + "'>" + airport.name + " - " + airport.destination.name + ", " + airport.destination.country + "</option>")
    	    		var toOption = $("<option id='" + airport.id + "'>" + airport.name + " - " + airport.destination.name + ", " + airport.destination.country + "</option>")
    	    		var stopBox = $("<input type='checkbox' id='" + airport.id + "'><label for='" + airport.id + "'>" + airport.name + " - " + airport.destination.name + ", " + airport.destination.country + "</label>")
    	    		
    	    		from.append(fromOption);
    	    		to.append(toOption);
    	    		stops.append(stopBox);
    	    		stops.append("<br>");
    	    	});
    		},
    		error: function(response) {
    			showMessage(response.responseText, "orange");
    		}
    	});
    }
	
	getFlights();
	
	function getFlights() {
		$.ajax({
			type: "GET",
			url: "/api/airline/flights",
			headers: createAuthorizationTokenHeader(),
			success: function(data) {
				var table = $("table#flightsTable tbody");
				
				$.each(data, function(index, flight) {
					var tr = $("<tr id='" + flight.id + "'></tr>");
					var id = $("<input type='hidden' value='" + flight.id + "'>");
					var from = $("<td>" + flight.from.name + " - " + flight.from.destination.name + ", " + flight.from.destination.country + "</td>");
					var to = $("<td>" + flight.to.name + " - " + flight.to.destination.name + ", " + flight.to.destination.country + "</td>");
					var stops = $("<td>" + flight.stops.length + "</td>");
					var departureDate = $("<td>" + formatDate(new Date(flight.departureDate)) + "</td>");
					var arrivalDate = $("<td>" + formatDate(new Date(flight.arrivalDate)) + "</td>");
					var luggageQuantity = $("<td>" + flight.luggageQuantity + "</td>");
					var ticketPriceFirstClass = $("<td>" + flight.ticketPriceFirstClass + "</td>");
					var ticketPriceBusinessClass = $("<td>" + flight.ticketPriceBusinessClass + "</td>");
					var ticketPriceEconomyClass = $("<td>" + flight.ticketPriceEconomyClass + "</td>");
					var actions = $("<td><input type='button' class='edit' value='Edit seats'> &nbsp; &nbsp; &nbsp; &nbsp; <input type='button' class='makeQuickReservation' value='Make quick reservation'></td>");
					var forGrade = $("<td width='10%'><section class='rating-widget'>" +
							"<div class='rating-stars text-center' height='20' width='100'>" +
								"<ul>" +
									"<li class='star' title='Poor' data-value='1'>" +
										"<i class='fa fa-star fa-fw'></i>" +
									"</li>" +
									"<li class='star' title='Fair' data-value='2'>" +
									"<i class='fa fa-star fa-fw'></i>" +
									"</li>" +
									"<li class='star' title='Good' data-value='3'>" +
									"<i class='fa fa-star fa-fw'></i>" +
									"</li>" +
									"<li class='star' title='Excellent' data-value='4'>" +
									"<i class='fa fa-star fa-fw'></i>" +
									"</li>" +
									"<li class='star' title='WOW!!!' data-value='5'>" +
									"<i class='fa fa-star fa-fw'></i>" +
									"</li>" +
									"</ul>" +
									"</div>	" +
									"</section></td>");
					
					tr.append(id);
					tr.append(from);
					tr.append(to);
					tr.append(stops);
					tr.append(departureDate);
					tr.append(arrivalDate);
					tr.append(luggageQuantity);
					tr.append(ticketPriceFirstClass);
					tr.append(ticketPriceBusinessClass);
					tr.append(ticketPriceEconomyClass);
					tr.append(forGrade);
					tr.append(actions);
					
					table.append(tr);

					$.get({url:'/flight/getMediumGradeForFlight/'+flight.id,
						headers: createAuthorizationTokenHeader()}, function(data){
			     	    	var i = 0;
			     	    	var onStar = data;
			     	    	var stars = $('.li.star');
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
					
				});
			}
		});
	}
	
	
    $(document).on('click', "#showReports", function(){
    	$("#chartContainer").css('display', 'block');

    })

    $(document).on('click', '#showAirlineIncomes', function(){
    	var startCheck = $('#startIncomeAirline').val();
    	var endCheck = $('#endIncomeAirline').val();
    	if(startCheck == "" || endCheck == ""){
    		showMessage("Enter start and end date", "orange");
    		return;
    	}
    	var start = stringToDate($('#startIncomeAirline').val());
    	var end = stringToDate($('#endIncomeAirline').val());
    	if(start>end){
    		showMessage("Start date must be later then end date", "orange");
    		return;
    	}
    	var start = stringToDate($('#startIncomeAirline').val())- 24*60*60*1000
    	var end = stringToDate($('#endIncomeAirline').val()) + 24*60*60*1000
    	$.get({url: '/api/getAirlineIncomes/'+start+'/'+end, 
			headers: createAuthorizationTokenHeader()}, function(income){
				$("#airlineIncomeVal").html(income);
			})
    })

    $(document).on('click', '#showGraph', function(){
    	var ctx = $("#myChart");
    	var type = $("#chartType").val();
    	if(type=="daily"){
    		$.get({url: '/api/getDailyFlights', 
    			headers: createAuthorizationTokenHeader()}, function(data){
			    	var myChart = new Chart(ctx, {
			    	  type: 'bar',
			    	  data: {
			    	    labels: data.x,
			    	    datasets: [{
			    	      label: 'Number of flights',
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
    		$.get({url: '/api/getWeeklyFlights', 
    			headers: createAuthorizationTokenHeader()}, function(data){
			    	var myChart = new Chart(ctx, {
			    	  type: 'bar',
			    	  data: {
			    	    labels: data.x,
			    	    datasets: [{
			    	      label: 'Number of flights',
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
    		$.get({url: '/api/getMonthlyFlights', 
    			headers: createAuthorizationTokenHeader()}, function(data){
			    	var myChart = new Chart(ctx, {
			    	  type: 'bar',
			    	  data: {
			    	    labels: data.x,
			    	    datasets: [{
			    	      label: 'Number of flights',
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
	
	
	function formatDate(date) {
		return date.toLocaleDateString("en", options) + " " + (date.getHours() < 10 ? "0" + (date.getHours()) : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
	}
	
	$(document).on("click", "input.edit", function() {
		var seatsTableDiv = $("div#seatsTableDiv");
		var flightID = $(this).parent().parent().find("input[type='hidden']").attr("value");
		
		$.ajax({
			type: "GET",
			url: "/flight/" + flightID + "/seats",
			contentType: "text/html; charset=utf-8",
			dataType: "json",
			success: function(data) {
				
				seatsTableDiv.css("height", ((data.length / 3) * 55 + (data.length % 3 > 0 ? 20 : 0)) + "px");
				$.each(data, function(index, seat) {
					var bgcolor;
					if(seat.enabled == false)
						bgcolor = "#3a3a3a";
					else if(seat.busy == true)
						bgcolor = "#ff0000";
					else if(seat.type == "FIRST_CLASS")
						bgcolor = "#ffd700";
					else if(seat.type == "BUSINESS")
						bgcolor = "#0000ff";
					else
						bgcolor = "#00ff00";
					
					var seatDiv = $("<div style='background-color: " + bgcolor + ";' class='seatDivForEdit'><input type='hidden' value='" + seat.id + "'></div>");
					
					if(index % 3 == 0)
						seatDiv.css("clear", "left");
					
					seatsTableDiv.append(seatDiv);
				});
				
				$("div#editSeatsModal").show();
			}
		});
	});
	
	var previousSeat = undefined; //Ujedno i trenutno selektovano mesto
	$(document).on("click", "div.seatDivForEdit", function() {
		if($(this).css("background-color") == "rgb(255, 0, 0)")
			return;
		
		if(previousSeat != undefined) {
			previousSeat.css("border", "0");
		}
		$(this).css("border", "2px solid red");
		previousSeat = $(this);
		
		$("input#toggleSeat").removeAttr("disabled");
		$("input#deleteSeat").removeAttr("disabled");
	});
	
	$(document).on("click", "input#toggleSeat", function() {
		var seatID = previousSeat.find("input[type='hidden']").attr("value");
		
		$.ajax({
			type: "PUT",
			url: "seats/toggle/" + seatID,
			headers: createAuthorizationTokenHeader(),
			success: function(data) {
				var bgcolor;
				if(data.enabled == true) {
					if(data.type == "FIRST_CLASS")
						bgcolor = "#ffd700";
					else if(data.type == "BUSINESS")
						bgcolor = "#0000ff";
					else
						bgcolor = "#00ff00";
				} else {
					bgcolor = "#3a3a3a";
				}
				
				previousSeat.css("background-color", bgcolor);
				
				showMessage("Seat status successfully changed.", "green");
			}
		});
	});
	
	$(document).on("click", "input#deleteSeat", function() {
		var seatID = previousSeat.find("input[type='hidden']").attr("value");
		
		$.ajax({
			type: "DELETE",
			url: "seats/delete/" + seatID,
			headers: createAuthorizationTokenHeader(),
			success: function(data) {
				showMessage("Seat successfully deleted.", "green");
				previousSeat.remove();
			}
		});
	});
	
	var selectedFlight;
	$(document).on("click", "input.makeQuickReservation", function() {
		var seatsDiv = $("div#seatsDiv");
    	seatsDiv.empty();
    	
    	selectedFlight = $(this).parent().parent().attr("id");
    	
    	$.ajax({
			type: "GET",
			url: "/flight/" + selectedFlight + "/seats",
			contentType: "text/html; charset=utf-8",
			headers: createAuthorizationTokenHeader(),
			dataType: "json",
			success: function(data) {
				seatsDiv.css("height", ((data.length / 3) * 55 + (data.length % 3 > 0 ? 20 : 0)) + "px");
				
				$.each(data, function(index, seat) {
					var bgcolor;
					if(seat.enabled == false)
						bgcolor = "#3a3a3a";
					else if(seat.busy == true)
						bgcolor = "#ff0000";
					else if(seat.type == "FIRST_CLASS")
						bgcolor = "#ffd700";
					else if(seat.type == "BUSINESS")
						bgcolor = "#0000ff";
					else
						bgcolor = "#00ff00";
					
					var seatDiv = $("<div style='background-color: " + bgcolor + ";' class='seatDivForReservation' id='" + seat.id + "'><input type='hidden' value='" + seat.id + "'></div>");
					
					if(index % 3 == 0)
						seatDiv.css("clear", "left");
					
					seatsDiv.append(seatDiv);
				});
				
				$("div#reservationSeatsModal").show();
			}
		});
	});
	
	var selectedSeats = [];
	$(document).on("click", "div.seatDivForReservation", function() {
		if($(this).css("background-color") == "rgb(58, 58, 58)" || $(this).css("background-color") == "rgb(255, 0, 0)")
			return;
		
		var seatId = $($(this).children("input")[0]).attr("value");
		
		var exists = false;
		for(var i = 0; i < selectedSeats.length; i++) {
			if(selectedSeats[i] == seatId) {
				selectedSeats.splice(i, 1);
				$(this).css("border", "0");
				
				exists = true;
				
				if(selectedSeats.length == 0) {
					$("input#makeQuickReservation").attr("disabled", "disabled");
				}
				
				break;
			}
		}
		
		if(!exists) {
			selectedSeats.push(parseInt(seatId));
			$(this).css("border", "2px solid red");
			
			$("input#makeQuickReservation").removeAttr("disabled");
		}
	});
	
	$("input#makeQuickReservation").click(function() {
		$.ajax({
			type: "GET",
			url: "/flight/" + selectedFlight,
			headers: createAuthorizationTokenHeader(),
			success: function(flight) {
				var reservations = [];
				$.ajax({
					type: "POST",
					url: "/seats/getSelectedSeats",
					headers: createAuthorizationTokenHeader(),
					data: JSON.stringify(selectedSeats),
					success: function(seats) {
						seats.forEach(function(seat) {
							var price = 0;
							if(seat.type == "FIRST_CLASS")
								price = flight.ticketPriceFirstClass;
							else if(seat.type == "BUSINESS")
								price = flight.ticketPriceBusinessClass;
							else
								price = flight.ticketPriceEconomyClass;
							
							var reservation = {
								"flight": flight,
								"seat": seat,
								"price": price,
								"discount": parseInt($("input#discount").val())
							};
							
							reservations.push(reservation);
						});
						
						$.ajax({
							type: "POST",
							url: "/api/flightReservation/makeQuick",
							headers: createAuthorizationTokenHeader(),
				    		data: JSON.stringify(reservations),
				    		success: function(data) {
				    			showMessage("Quick reservation successfully created.", "green");
				    			
				    			selectedSeats.forEach(function(seatID) {
				    				$("div.seatDivForReservation#" + seatID).css("background-color", "red");
				    				$("div.seatDivForReservation#" + seatID).css("border", "0");
				    			});
				    			
				    			selectedSeats = [];
				    			$("input#makeQuickReservation").attr("disabled", "disabled");
				    		},
				    		error: function (jqXHR, exception) {
				    			if (jqXHR.status == 401) {
				    				showMessage("Not authenticated!", "red");
				    			} else{
				    				showMessage(jqXHR, "red");
				    			}
							}
						});
					}
				});
			}
		});
	});
	
	$(document).on("click", "span.close", function() {
		$("div#seatsTableDiv").empty();
		$("div#seatsDiv").empty();
		
		previousSeat = undefined;
		selectedSeats = [];
		
		$("input#toggleSeat").attr("disabled", "disabled");
		$("input#deleteSeat").attr("disabled", "disabled");
		$("input#makeQuickReservation").attr("disabled", "disabled");
		
		$("div#editSeatsModal").hide();
		$("div#reservationSeatsModal").hide();
	});
	
	$("button#profileBtn").click( function() {
		$.ajax({
			type: "GET",
			url: "/auth/getInfo",
			headers: createAuthorizationTokenHeader(),
			success: function(admin) {
				$("input#firstName").val(admin.firstName);
				$("input#lastName").val(admin.lastName);
				$("input#email").val(admin.email);
				$("input#city").val(admin.city);
				$("input#phone").val(admin.phoneNumber);
				
				$("div#dialogProfile").show();
			},
			error: function(response) {
				showMessage("You have been logged out. Please login again.", "red");
				$(location).attr('href',"/login.html");
			}
		});
	});
	
	$("button#saveProfile").click(function() {
		var newPassword = $("input#newPassword").val();
		var repeatedPassword = $("input#repeatedPassword").val();
		
		var firstName = $("input#firstName").val();
		var lastName = $("input#lastName").val();
		var email = $("input#email").val();
		var city = $("input#city").val();
		var phone = $("input#phone").val();
		
		if(newPassword != "" && repeatedPassword != newPassword) {
			showMessage("Repeated password doesn't match new password.", "orange");
			return;
		}
		
		var admin = {
			"password": newPassword,
			"firstName": firstName,
			"lastName": lastName,
			"email": email,
			"city": city,
			"phoneNumber": phone
		};
		
		$.ajax({
			type: "PUT",
			url: "/api/airlineadmins/updateProfile",
			headers: createAuthorizationTokenHeader(),
			data: JSON.stringify(admin),
			success: function() {
				showMessage("Profile successfully saved.", "green");
			}
		});
		
		$("div#dialogProfile").hide();
	});
	
	$("button#closeProfileDialog").click(function() {
		$("div#dialogProfile").hide();
	});
	
	$("button#addFlightBtn").click(function() {
		$("div#dialogNewFlight").show();
	});
	
	$("button#addFlight").click(function() {
		var from = $("select#from").find(":selected").attr("id");
    	var to = $("select#to").find(":selected").attr("id");
    	var stops = $("div#stopsDiv").children("input");
    	var departureDate = new Date($("input#departureDate").val());
    	var arrivalDate = new Date($("input#arrivalDate").val());
    	var length = parseInt($("input#length").val());
    	var rowsInFirstClass = parseInt($("input#rowsInFirstClass").val());
    	var rowsInBusinessClass = parseInt($("input#rowsInBusinessClass").val());
    	var rowsInEconomyClass = parseInt($("input#rowsInEconomyClass").val());
    	var luggageQuantity = parseInt($("input#luggageQuantity").val());
    	var ticketPriceFirstClass = parseInt($("input#ticketPriceFirstClass").val());
    	var ticketPriceBusinessClass = parseInt($("input#ticketPriceBusinessClass").val());
    	var ticketPriceEconomyClass = parseInt($("input#ticketPriceEconomyClass").val());
    	
    	if(!departureDate || !arrivalDate || !length || !luggageQuantity || !ticketPriceFirstClass || !ticketPriceBusinessClass || !ticketPriceEconomyClass) {
    		showMessage("Some fields are empty!", "red");
    		return;
    	} else if(departureDate - new Date() <= 0) {
			showMessage("The departure date can't be before current date!", "red");
			return;
    	} else if(arrivalDate - departureDate <= 0) {
    		showMessage("The date of landing can't be before the date of departure!", "red");
    		return;
		} else {
    		if(from == to) {
    			showMessage("The start destination can't be same as the end destination!", "red");
    			return;
    		} else 
	    		for(var i = 0; i < stops.length; i++)
	    			if(stops[i].checked && ($(stops[i]).next('label').text() == from || $(stops[i]).next('label').text() == to)) {
	    				showMessage("Some of the stops are same as start or end destination!", "red");
	    				return;
	    			}
    	}
    	
    	var selectedStops = [];
    	
    	for(var i = 0; i < stops.length; i++)
    		if(stops[i].checked) {
    			//selectedStops.push(findAirport($(stops[i]).next("label").text().split(" - ")[0], $(stops[i]).next("label").text().split(" - ")[1]));
    			selectedStops.push({
    				"id": $(stops[i]).attr("id")
    			});
    		}
    	
    	var seats = [];
    	
    	for(var i = 0; i < rowsInFirstClass * 3; i++) {
    		seats.push({
    			"seatRow": Math.ceil((i + 1) / 3),
    			"number": (i % 3) + 1,
    			"busy": false,
    			"enabled": true,
    			"type": "FIRST_CLASS"
    		});
    	}
    	
    	for(var i = rowsInFirstClass * 3; i < rowsInFirstClass * 3 + rowsInBusinessClass * 3; i++) {
    		seats.push({
    			"seatRow": Math.ceil((i + 1) / 3),
    			"number": (i % 3) + 1,
    			"busy": false,
    			"enabled": true,
    			"type": "BUSINESS"
    		});
    	}
    	
    	for(var i = rowsInFirstClass * 3 + rowsInBusinessClass * 3; i < rowsInFirstClass * 3 + rowsInBusinessClass * 3 + rowsInEconomyClass * 3; i++) {
    		seats.push({
    			"seatRow": Math.ceil((i + 1) / 3),
    			"number": (i % 3) + 1,
    			"busy": false,
    			"enabled": true,
    			"type": "ECONOMY"
    		});
    	}
    	
    	var flight = {
    		"from": {
    			"id": from
    		},
    		"to": {
    			"id": to
    		},
    		"stops": selectedStops,
    		"departureDate": departureDate,
    		"arrivalDate": arrivalDate,
    		"flightLength": length,
    		"luggageQuantity": luggageQuantity,
    		"flightDuration": (arrivalDate - departureDate)/1000/60/60,
    		"ticketPriceFirstClass": ticketPriceFirstClass,
    		"ticketPriceBusinessClass": ticketPriceBusinessClass,
    		"ticketPriceEconomyClass": ticketPriceEconomyClass,
    		"seats": seats
    	}
    	
    	$.ajax({
    		type: "POST",
    		url: "/flight/new",
    		headers: createAuthorizationTokenHeader(),
    		data: JSON.stringify(flight),
    		success: function(data) {
    			showMessage("Flight successully added.", "green");
    			
    			var table = $("table#flightsTable tbody");
    			
    			var tr = $("<tr id='" + data.id + "'></tr>");
				var id = $("<input type='hidden' value='" + data.id + "'>");
				var from = $("<td>" + data.from.name + " - " + data.from.destination.name + ", " + data.from.destination.country + "</td>");
				var to = $("<td>" + data.to.name + " - " + data.to.destination.name + ", " + data.to.destination.country + "</td>");
				var stops = $("<td>" + data.stops.length + "</td>");
				var departureDate = $("<td>" + formatDate(new Date(data.departureDate)) + "</td>");
				var arrivalDate = $("<td>" + formatDate(new Date(data.arrivalDate)) + "</td>");
				var luggageQuantity = $("<td>" + data.luggageQuantity + "</td>");
				var ticketPriceFirstClass = $("<td>" + data.ticketPriceFirstClass + "</td>");
				var ticketPriceBusinessClass = $("<td>" + data.ticketPriceBusinessClass + "</td>");
				var ticketPriceEconomyClass = $("<td>" + data.ticketPriceEconomyClass + "</td>");
				var actions = $("<td><input type='button' class='edit' value='Edit seats'> &nbsp; &nbsp; &nbsp; &nbsp; <input type='button' class='makeQuickReservation' value='Make quick reservation'></td>");
				var forGrade = $("<td width='10%'><section class='rating-widget'>" +
						"<div class='rating-stars text-center' height='20' width='100'>" +
							"<ul>" +
								"<li class='star' title='Poor' data-value='1'>" +
									"<i class='fa fa-star fa-fw'></i>" +
								"</li>" +
								"<li class='star' title='Fair' data-value='2'>" +
								"<i class='fa fa-star fa-fw'></i>" +
								"</li>" +
								"<li class='star' title='Good' data-value='3'>" +
								"<i class='fa fa-star fa-fw'></i>" +
								"</li>" +
								"<li class='star' title='Excellent' data-value='4'>" +
								"<i class='fa fa-star fa-fw'></i>" +
								"</li>" +
								"<li class='star' title='WOW!!!' data-value='5'>" +
								"<i class='fa fa-star fa-fw'></i>" +
								"</li>" +
								"</ul>" +
								"</div>	" +
								"</section></td>");
				
				tr.append(id);
				tr.append(from);
				tr.append(to);
				tr.append(stops);
				tr.append(departureDate);
				tr.append(arrivalDate);
				tr.append(luggageQuantity);
				tr.append(ticketPriceFirstClass);
				tr.append(ticketPriceBusinessClass);
				tr.append(ticketPriceEconomyClass);
				tr.append(forGrade);
				tr.append(actions);
				
				table.append(tr);
    			
    			$("div#dialogNewFlight").hide();
    		}
    	});
	});
	
	$("button#closeNewFlightDialog").click(function() {
		$("div#dialogNewFlight").hide();
	});
	
	$("button#addAirportBtn").click(function() {
		$("div#dialogNewAirport").show();
	});
	
	$("button#addAirport").click(function() {
		var airportName = $("input#airportName").val();
        var name = $("input#airportAddress").val();
        var address = $("input#airportPlace").val();
        var country = $("input#airportCountry").val();
        var latitude = $("input#airportLatitude").val();
        var longitude = $("input#airportLongitude").val();

        if(airportName == "" || name == "" || address == "" || country == "" || latitude == "" || longitude == "") {
            showMessage("Some fields are empty!", "red");
        } else {
        	$.ajax({
        		type: "POST",
        		url: "/airport/new",
        		headers: createAuthorizationTokenHeader(),
        		data: JSON.stringify({
                    "name": airportName,
                    "destination": {
                    	"name": name,
                    	"address": address,
                    	"country": country,
                    	"latitude": latitude,
                    	"longitude": longitude
                    }
        		}),
        		success: function(response) {
        			showMessage(response, "green");
        			
        			$("div#dialogNewAirport").show();
        		},
        		error: function(response) {
        			showMessage(response.responseText, "orange");
        		}
        	});
        }
	});
	
	$("button#closeNewAirportDialog").click(function() {
		$("div#dialogNewAirport").hide();
	});
	
	$("button#editAirlineBtn").click(function() {
		$.ajax({
			type: "GET",
			url: "/api/airline/getAirline",
			headers: createAuthorizationTokenHeader(),
			success: function(data) {
				$("input#airlineName").val(data.name);
				$("input#airlinePlace").val(data.destination.name);
				$("input#airlineAddress").val(data.destination.address);
		        $("input#airlineCountry").val(data.destination.country);
		        $("input#airlineLatitude").val(data.destination.latitude);
		        $("input#airlineLongitude").val(data.destination.longitude);
				$("input#description").val(data.description);
			}
		});
		
		$("div#dialogEditAirline").show();
	});
	
	$("button#editAirline").click(function() {
		var airlineName = $("input#airlineName").val();
		var name = $("input#airlinePlace").val();
        var address = $("input#airlineAddress").val();
        var country = $("input#airlineCountry").val();
        var latitude = $("input#airlineLatitude").val();
        var longitude = $("input#airlineLongitude").val();
		var description = $("input#description").val();
		
		if(name == "" || description == "") {
			showMessage("Some fields are empty!", "red");
		} else {
			var airline = {
				"name": name,
				"destination": {
                	"name": name,
                	"address": address,
                	"country": country,
                	"latitude": latitude,
                	"longitude": longitude
                },
				"description": description
			}
			
			$.ajax({
				type: "PUT",
				url: "/api/airlines",
				headers: createAuthorizationTokenHeader(),
				data: JSON.stringify(airline),
				dataType: "text",
				success: function(response) {
        			showMessage(response, "green");
        			
        			$("div#dialogEditAirline").hide();
        		},
        		error: function(response) {
        			showMessage(response.responseText, "red");
        		}
			});
		}
	});
	
	$("button#closeEditAirlineDialog").click(function() {
		$("div#dialogEditAirline").hide();
	});
	
	$("button#defineLuggagePricelistBtn").click(function(){
		$.ajax({
			type: "GET",
			url: "/api/airline/getPricelist",
			headers: createAuthorizationTokenHeader(),
			success: function(data) {
				var table = $("table#luggagePricelistTable tbody");
				table.empty();
				
				$.each(data, function(index, luggage) {
					var tr = $("<tr></tr>");
					var dimensionsTD = $("<td>" + luggage.dimensions + "</td>");
					var weightTD = $("<td>" + luggage.weight + "</td>");
					var priceTD = $("<td>" + luggage.price + "</td>");
					
					tr.append(dimensionsTD);
					tr.append(weightTD);
					tr.append(priceTD);
					
					table.append(tr);
				});
				
				$("div#dialogNewLuggagePricelistItem").show();
			}
		});
    });
	
	$("button#addPricelistItem").click(function() {
		var dimensions = $("input#dimensions").val();
		var weight = parseInt($("input#weight").val());
		var price = parseFloat($("input#price").val());
		
		if(dimensions == "") {
			showMessage("Dimensions must be entered.", "red");
		} else {
			var luggage = {
				"dimensions": dimensions,
				"weight": weight,
				"price": price
			}
			
			$.ajax({
				type: "POST",
				url: "/luggage/add",
				headers: createAuthorizationTokenHeader(),
				data: JSON.stringify(luggage),
				dataType: "text",
				success: function(response) {
					var table = $("table#luggagePricelistTable tbody");
					var tr = $("<tr></tr>");
					var dimensionsTD = $("<td>" + luggage.dimensions + "</td>");
					var weightTD = $("<td>" + luggage.weight + "</td>");
					var priceTD = $("<td>" + luggage.price + "</td>");
					
					tr.append(dimensionsTD);
					tr.append(weightTD);
					tr.append(priceTD);
					table.append(tr);
					
					showMessage("Item added to pricelist.", "green");
					
					$("div#dialogNewLuggagePricelistItem").hide();
				},
				error: function(response) {
					showMessage(response.responseText, "red");
				}
			});
		}
	});
	
	$("button#closeNewLuggagePricelistItemDialog").click(function() {
		$("div#dialogNewLuggagePricelistItem").hide();
	});
	
	$("button#logoutBtn").click(function(){
    	removeJwtToken();
        $(location).attr('href',"/logout");
    });
})

function stringToDate(displayFormat){
		myDate=displayFormat.split("-");
		var newDate = myDate[1]+"/"+myDate[2]+"/"+myDate[0];
		return new Date(newDate).getTime();
	}