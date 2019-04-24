function showMessage(message, color) {
    var snackbar = $("<div id='snackbar'></div>")
    $("body").append(snackbar);

    var x = document.getElementById("snackbar");
    x.className = "show";
    $("div#snackbar").css("background-color", color);
    $("div#snackbar").text(message);
    setTimeout(function() { x.className = x.className.replace("show", ""); $("div#snackbar").remove(); }, 3000);
}