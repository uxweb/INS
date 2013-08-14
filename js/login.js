$(function()
{
	$('#usuario').focus();
	
	$.ajax({
		
		type: 'POST',
		url: 'inc/CierraSesion.php',
		success: function()
		{
			//console.log('sesion cerrada');
		}
	});
	
	LOGINFORM = {
		
		container: '#login-form',
		
		login: function()
		{
			$.ajax({
				type: 'POST',
				url: 'inc/login.php',
				data: {usr: $(this.container).find('#usuario:text').val(), pwd: $(this.container).find('#clave:password').val()},
				cache: false,
				dataType: 'json',
				timeout: 5000,
				
				beforeSend: function()
				{
					$('#entrar').addClass('disabled').toggleClass('aceptar loading').addClass('loading').attr('disabled', 'disabled');
				},
				success: function(json)
				{
					try{
						if(!json.success)
						{
							$('#console')
							.stop(true, true)
							.html(json.errorMessage)
							.addClass('error')
							.slideDown(600)
							.delay(3000)
							.slideUp(1000);
							
							return false;
						}
						
						window.location.replace('index.php');
					}
					catch(e)
					{
						$('#console')
							.html(e.message)
							.addClass('error')
							.stop(true, true)
							.slideDown(600)
							.delay(3000)
							.slideUp(1000);
							
							return false;
					}
				},
				complete: function()
				{
					$('#entrar').removeClass('disabled').toggleClass('aceptar loading').removeAttr('disabled');
				}
				
			});
		}
	}
	
	$('#entrar').click(function(event){
		
		LOGINFORM.login();
		
		event.preventDefault();
	});
});