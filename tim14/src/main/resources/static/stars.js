$(document).ready(function(){
  
  /* 1. Visualizing things on Hover - See next part for action on click */
  $('#stars li').on('mouseover', function(){
    var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on
   
    // Now highlight all the stars that's not after the current hovered star
    $(this).parent().children('li.star').each(function(e){
      if (e < onStar) {
        $(this).addClass('hover');
      }
      else {
        $(this).removeClass('hover');
      }
    });
    
  }).on('mouseout', function(){
    $(this).parent().children('li.star').each(function(e){
      $(this).removeClass('hover');
    });
  });
  
  
  /* 2. Action to perform on click */
  $('#stars li').on('click', function(){
    var onStar = parseInt($(this).data('value'), 10); // The star currently selected
    var stars = $(this).parent().children('li.star');
    
    for (i = 0; i < stars.length; i++) {
      $(stars[i]).removeClass('selected');
    }
    
    for (i = 0; i < onStar; i++) {
      $(stars[i]).addClass('selected');
    }
    
    var entityID= $("#entityID").val();
    console.log(entityID);
    if(entityID.startsWith("vehicle")){
    $.ajax({
		type : 'POST',
		url : "/api/setGradeForVehicle/"+entityID.substring(7)+"/"+onStar,
		headers: createAuthorizationTokenHeader(),
		dataType : "application/json"})
    }
    
    else if(entityID.startsWith("rent")){
        $.ajax({
    		type : 'POST',
    		url : "/api/setGradeForRent/"+entityID.substring(4)+"/"+onStar,
    		headers: createAuthorizationTokenHeader(),
    		dataType : "application/json"})
        }
  });
  
  
  
});


function responseMessage(msg) {
  $('.success-box').fadeIn(200);  
  $('.success-box div.text-message').html("<span>" + msg + "</span>");
}