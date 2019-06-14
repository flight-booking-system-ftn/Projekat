$(document).ready(function(){

	$.get({url:'/api/allUsedVehicles',
		headers: createAuthorizationTokenHeader()}, function(data){
			console.log("all vehicles: ", data);	 
			var vehicles = data;
			console.log("vehicle data",vehicles);
			$('#vehiclesHistory').html(`<tr><th>Brand</th><th>Model</th><th>Type</th><th>Rate</th></tr>`);
			for(var i=0;i<vehicles.length;i++){
				var red = vehicles[i];
				console.log("-----------aaa->", red);
				buttonID = "rateBtn"+ red.id;
				console.log("-->", red);
				$('#vehiclesHistory tr:last').after(`<tr><td>${red.brand}</td><td>${red.model}</td><td>${red.type}</td><td><button id=${buttonID}>Rate</button></td></tr>`);
			}
			$('#iddd').css("display","none");
		})
	$(document).on('click','table button',function(e){
		console.log(e.target.id);
		if(e.target.id.startsWith("rateBtn")){
	        var id = e.target.id.substr(7);
	        $("#entityID").val("vehicle"+id);
	        console.log("vehicle id: ", id);
	        $.get({url:'/api/getGradeForVehicle/'+id,
	    		headers: createAuthorizationTokenHeader()}, function(data){
	    		var i = 0;
	    		var onStar = 0;
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
	        $('#outDiv').css("display","block");
	       })
		}
	})
	
	$(document).on('click', "#allVehiclesCancel", function(){
        $(location).attr('href',"/registeredUser.html");
	})
})

function displayDateFormat(date){
		myDate=date.split("-");
		return [myDate[2], myDate[1], myDate[0]].join('/');
	}