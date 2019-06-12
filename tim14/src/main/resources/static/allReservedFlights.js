$(document).ready(function(){

	$.get({url:'/api/allUsedFlights',
		headers: createAuthorizationTokenHeader()}, function(data){
			console.log("all flights: ", data);	 
			var flights = data;
			console.log("flight data",flights);
			$('#flightsHistory').html(`<tr><th>From</th><th>To<th>Departure date</th><th>Arrival date</th><th>Rate</th></tr>`);
			for(var i=0;i<flights.length;i++){
				var red = flights[i];
				console.log("-----------aaa->", red);
				buttonID = "rateBtn"+ red.id;
				console.log("-->", red);
				$('#flightsHistory tr:last').after(`<tr><td>${red.from.name}</td><td>${red.to.name}</td><td>${red.departureDate}</td><td>${red.arrivalDate}</td><td><button id=${buttonID}>Rate</button></td></tr>`);
			}
			$('#rateDiv').css("display","none");
		})
	$(document).on('click','table button',function(e){
		console.log(e.target.id);
		if(e.target.id.startsWith("rateBtn")){
	        var id = e.target.id.substr(7);
	        $("#entityID").val("flight"+id);
	        console.log("flight id: ", id);
	        $.get({url:'/flight/getGradeForFlight/'+id,
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
	    				i++;}
	    			else return false;
	   		    })	    			
	        $('#rateDiv').css("display","block");
	       })
		}
	})
	
	$(document).on('click', "#allFlightsCancel", function(){
        $(location).attr('href',"/registeredUser.html");
	})
})


function formatDate(date) {
    month = '' + (date.getMonth() + 1);
    day = '' + date.getDate();
    year = date.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
	return [year, month, day].join('-');

}