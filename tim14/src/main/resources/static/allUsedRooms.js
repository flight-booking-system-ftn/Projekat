$(document).ready(function(){

	$.get({url:'/api/allUsedRooms',
		headers: createAuthorizationTokenHeader()}, function(data){
			console.log("all Rooms: ", data);	 
			var rooms = data;
			console.log("room data",rooms);
			$('#roomsHistory').html(`<tr><th>Room number</th><th>Bed number</th><th>Floor</th><th>Hotel></th><th>Rate</th></tr>`);
			for(var i=0;i<rooms.length;i++){
				var red = rooms[i];
				console.log("-----------aaa->", red);
				buttonID = "rateBtn"+ red.id;
				console.log("-->", red);
				$('#roomsHistory tr:last').after(`<tr><td>${red.roomNumber}</td><td>${red.bedNumber}</td><td>${red.floor}</td><td>${red.hotel.name}</td><td><button id=${buttonID}>Rate</button></td></tr>`);
			}
			$('#outDiv').css("display","none");
		})
	$(document).on('click','table button',function(e){
		console.log(e.target.id);
		if(e.target.id.startsWith("rateBtn")){
	        var id = e.target.id.substr(7);
	        $("#entityID").val("room"+id);
	        console.log("room id: ", id);
	        $.get({url:'/api/getGradeForRoom/'+id,
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
	        $('#outDiv').css("display","block");
	       })
		}
	})
	
	$(document).on('click', "#allRoomsCancel", function(){
        $(location).attr('href',"/registeredUser.html");
	})
})

function displayDateFormat(date){
		myDate=date.split("-");
		return [myDate[2], myDate[1], myDate[0]].join('/');
	}