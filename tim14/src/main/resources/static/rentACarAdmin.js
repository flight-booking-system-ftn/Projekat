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
	
});