$(document).ready(function() {
	$(document).on('submit',"#add_airline", function(e){
	e.preventDefault();
	var name = $(".field").eq(0).val();
    var address = $(".field").eq(1).val();
    var description = $(".field").eq(2).val();
    var destinations = $(".field").eq(3).val();
    var flights = $(".field").eq(4).val();
    var quick = $(".field").eq(5).val();
    var config = $(".field").eq(6).val();
    var price = $(".field").eq(7).val();
    $.ajax({
		type : 'POST',
		url : "/airlines",
		contentType : 'application/json',
		data : JSON.stringify({
            "name" : name,
            "address" : address,
            "description": description,
            "destinations": destinations,
            "flights": flights,
            "quickReservationTickets" : quick,
            "flightConfiguration" : config,
            "pricelist" : price
        }),
		success: function(){
			$(location).attr('href',"/");
		}
})
	})});