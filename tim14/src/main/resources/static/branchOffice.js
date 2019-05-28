$(document).ready(function() {
	$.get('/api/destinations', function(data){
        
		var select = document.getElementById("branchOfficeDestination");
		console.log(data);
        for(var i=0;i<data.length;i++){
            var red = data[i];
            select.options[select.options.length] = new Option(''+red.name,''+red.id);
        }
    });

	$(document).on('submit',"#add_branch_office", function(e){
		e.preventDefault();
		var link = '/api/destinations/'+$("#branchOfficeDestination option:selected" ).val();
		$.get(link, function(destinationData){
			console.log(destinationData);
			$.ajax({
				type : 'POST',
				url : "/api/branchOffice",
				headers: createAuthorizationTokenHeader(),
				data : JSON.stringify(destinationData),
				success: function(){
					$(location).attr('href',"/rentACarAdmin.html");
				},
				error: function (jqXHR, exception) {
					var msg = '';
					if (jqXHR.status == 0) {
						msg = 'Not connect.\n Verify Network.';
					} else if (jqXHR.status == 404) {
						msg = 'Requested page not found. [404]';
					} else if (jqXHR.status == 500) {
						msg = 'Internal Server Error [500].';
					} else if (exception === 'parsererror') {
						msg = 'Requested JSON parse failed.';
					} else if (exception === 'timeout') {
						msg = 'Time out error.';
					} else if (exception === 'abort') {
						msg = 'Ajax request aborted.';
					} else {
						msg = 'Uncaught Error.\n' + jqXHR.responseText;
					}
					alert(msg);
				}
			})
		});
	})
});