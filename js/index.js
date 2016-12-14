function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
function isNumeric(phone) {
  var regex = /^\d+$/;
  return regex.test(phone);
}

$(document).ready(function(){
	 $('#contact').submit(function(e){
        var fname = $.trim($('#Nombre').val());
        var femail = $.trim($('#Email').val());
        var ftelefon = $.trim($('#Phone').val());
        var fcodipostal = $.trim($('#CP').val());

        var errors = [];
        if (fname  === '') {
        	$("#errorName").removeClass('hidde');
            $("#errorName").addClass('visible');
            //$("#errName").css("display", "block");
            errors.push("El campo Nombre es obligatorio.");
        }else{
        	$("#errorName").addClass('hidde');
            $("#errorName").removeClass('visible');
            //$("#errName").css("display", "none");
        }
        if(!isEmail(femail)){
            $("#errorEmail").removeClass('hidde');
            $("#errorEmail").addClass('visible');
            errors.push("El campo Email no es correcto.");
        }else{
            $("#errorEmail").addClass('hidde');
            $("#errorEmail").removeClass('visible');
        }
        if(ftelefon.length != 9 || !isNumeric(ftelefon)){
            $("#errorPhone").removeClass('hidde');
            $("#errorPhone").addClass('visible');
            errors.push("El campo Teléfono solo acepta números de 9 dígitos.")
        }else{
            $("#errorPhone").addClass('hidde');
            $("#errorPhone").removeClass('visible');
        }
        if(fcodipostal.length != 5 || !isNumeric(fcodipostal)){
            $("#errorCode").removeClass('hidde');
            $("#errorCode").addClass('visible');
            errors.push("El campo Código Postal no es válido.")
        }else{
            $("#errorCode").addClass('hidde');
            $("#errorCode").removeClass('visible');
        }
        
        if(errors.length>0){
            e.preventDefault();
        } else{            
            $("input#enviar").prop('disabled', true);
        }
    });

    // Resize the canvas bitmap when the window is resized,
   window.addEventListener('resize', function onWindowResize(event) {   
   
      // Wait until the resizing events flood settles,
      if (onWindowResize.timeoutId) window.clearTimeout(onWindowResize.timeoutId);
      onWindowResize.timeoutId = window.setTimeout(adjustCanvasBitmapSize, 600);
   });   
});