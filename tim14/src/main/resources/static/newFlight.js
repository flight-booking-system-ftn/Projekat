$(document).ready(function() {
    $("#newFlightForm").submit(function(e) {
        e.preventDefault();

        var departureDate = $("input#departureDate").val();
        var returnDate = $("input#returnDate").val();
        var flightTime = $("input#flightTime").val();
        var flightLength = $("input#flightLength").val();
        var stopNumber = $("input#stopNumber").val();
        var businessClassSeats = $("input#businessClassSeats").val();
        var economyClassSeats = $("input#economyClassSeats").val();
        var firstClassSeats = $("input#firstClassSeats").val();
        var businessTicketPrice = $("input#businessTicketPrice").val();
        var economyTicketPrice = $("input#economyTicketPrice").val();
        var firstTicketPrice = $("input#firstTicketPrice").val();

        if(departureDate === "" || returnDate === "" || flightTime === "" || flightLength === "" || stopNumber === "" || businessClassSeats === "" || economyClassSeats === "" || firstClassSeats === "" || businessTicketPrice === "" || economyTicketPrice === "" || firstTicketPrice === "") {
            alert("Neki podaci nisu popunjeni.")
            return;
        } else if(flightTime < 0 || flightLength < 0 || stopNumber < 0 || businessClassSeats < 0 || economyClassSeats < 0 || firstClassSeats < 0 || businessTicketPrice < 0 || economyTicketPrice < 0 || firstTicketPrice < 0) {
            alert("Vrednost ne moze biti negativna.");
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/flights',
            contentType: 'application/json',
            data: JSON.stringify({
                "departureDate": new Date(departureDate),
                "returnDate": new Date(returnDate),
                "flightTime": flightTime,
                "flightLength": flightLength,
                "stopNumber": stopNumber,
                "businessClassSeats": businessClassSeats,
                "economyClassSeats": economyClassSeats,
                "firstClassSeats": firstClassSeats,
                "businessClassPrice": businessTicketPrice,
                "economyClassPrice": economyTicketPrice,
                "firstClassPrice": firstTicketPrice
            }),
            success: function() {
                $(location).attr('href', '/');
            }
        });
    });
});