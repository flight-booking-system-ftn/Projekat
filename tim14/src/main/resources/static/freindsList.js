var globalFriends = null;

$(document).ready(function(){

	$.get({url:'/api/registeredUser/allFriends',
		headers: createAuthorizationTokenHeader()}, function(data){
			console.log("all friends: ", data);	 
			var friends = data;
			globalFriends = friends;
			friends.sort((a, b) => (a.firstName > b.firstName) ? 1 : -1)
			console.log("vehicle data",friends);
			$('#friendsList').html(`<tr><th>Username</th><th>First name</th><th>Last Name</th><th>Email</th><th></th></tr>`);
			for(var i=0;i<friends.length;i++){
				var red = friends[i];
				console.log("-----------aaa->", red);
				buttonID = "unfriendBtn"+ red.id;
				console.log("-->", red);
				$('#friendsList tr:last').after(`<tr><td>${red.username}</td><td>${red.firstName}</td><td>${red.lastName}</td><td>${red.email}</td><td><button id=${buttonID}>Unfreind</button></td></tr>`);
			}
		});
	
	$(document).on('click', "#startSort", function(){
		var criteria = $("#sortCriteria").val();
		console.log("Global", globalFriends);
		var friends = globalFriends;
		console.log("Local", friends);
		if(criteria == "first")
			friends.sort((a, b) => (a.firstName > b.firstName) ? 1 : -1);
		else
			friends.sort((a, b) => (a.lastName > b.lastName) ? 1 : -1);
		console.log("vehicle data",friends);
		$('#friendsList').empty();
		var friends = globalFriends;
		$('#friendsList').html(`<tr><th>Username</th><th>First name</th><th>Last Name</th><th>Email</th><th></th></tr>`);
		for(var i=0;i<friends.length;i++){
			var red = friends[i];
			console.log("-----------aaa->", red);
			buttonID = "unfriendBtn"+ red.id;
			console.log("-->", red);
			$('#friendsList tr:last').after(`<tr><td>${red.username}</td><td>${red.firstName}</td><td>${red.lastName}</td><td>${red.email}</td><td><button id=${buttonID}>Unfreind</button></td></tr>`);
		}
	})
	
	$(document).on('click', "#friendsCancel", function(){
		 $(location).attr('href',"/registeredUser.html");
	})
})