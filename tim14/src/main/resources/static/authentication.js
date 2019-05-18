function getJwtToken(){
	return localStorage.getItem('jwtToken');
}

function setJwtToken(token){
	localStorage.setItem('jwtToken', token);
}

function removeJwtToken(){
	localStorage.removeItem('jwtToken');
}

function createAuthorizationTokenHeader(){
	var token = getJwtToken('jwtToken')
	
	if(token){
		return {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json; charset=utf-8;'
          };
	} else{
		return {
            'Content-Type': 'application/json; charset=utf-8;'
          };
	}
}