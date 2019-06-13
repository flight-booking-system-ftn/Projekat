$(document).ready(function(){

	$.get({url:'/api/registeredUser/allFriends',
		headers: createAuthorizationTokenHeader()}, function(data){
			console.log("all friends: ", data);	 
			var friends = data;
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
	})