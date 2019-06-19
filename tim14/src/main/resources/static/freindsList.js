var globalFriends = null;

$(document).ready(function(){
	$.get({
		url:'/api/registeredUser/allFriends',
		headers: createAuthorizationTokenHeader()
	}, function(data) {
			var friends = data;
			globalFriends = friends;
			friends.sort((a, b) => (a.firstName > b.firstName) ? 1 : -1)
			$('#friendsList').html(`<tr><th>Username</th><th>First name</th><th>Last Name</th><th>Email</th><th></th></tr>`);
			for(var i=0;i<friends.length;i++){
				var red = friends[i];
				buttonID = "unfriendBtn"+ red.id;
				$('#friendsList tr:last').after(`<tr id='${red.id}'><td>${red.username}</td><td>${red.firstName}</td><td>${red.lastName}</td><td>${red.email}</td><td><input type='button' class='unfriend' value='Unfriend'></td></tr>`);
			}
		
	});
	
	$(document).on("click", "input.unfriend", function() {
		var userID = $(this).parent().parent().attr("id");
		var btn = $(this);
		
		$.ajax({
			type: "DELETE",
			url: "/api/registeredUser/removeFriend/" + userID,
			headers: createAuthorizationTokenHeader(),
			success: function(data) {
				$("#friendsList tr#" + userID).remove();
			}
		});});
    
	$(document).on('click', "#startSort", function(){
		var criteria = $("#sortCriteria").val();
		var friends = globalFriends;
		if(criteria == "first")
			friends.sort((a, b) => (a.firstName > b.firstName) ? 1 : -1);
		else
			friends.sort((a, b) => (a.lastName > b.lastName) ? 1 : -1);
		$('#friendsList').empty();
		var friends = globalFriends;
		$('#friendsList').html(`<tr><th>Username</th><th>First name</th><th>Last Name</th><th>Email</th><th></th></tr>`);
		for(var i=0;i<friends.length;i++){
			var red = friends[i];
			buttonID = "unfriendBtn"+ red.id;
			$('#friendsList tr:last').after(`<tr><td>${red.username}</td><td>${red.firstName}</td><td>${red.lastName}</td><td>${red.email}</td><td><button id=${buttonID}>Unfreind</button></td></tr>`);
		}
	})
	
	$(document).on('click', "#friendsCancel", function(){
		 $(location).attr('href',"/registeredUser.html");
	});
});
