$(function(){
	
	$('#main-menu > li')
	.has('ul')
	.hover(function(event){
		$(this)
		.children('ul')
		.stop(true, true)
		.css({
			'top': $(this).height() + 'px',
			'left': $(this).position().left + 'px'
		})
		.slideDown('fast');
	}, function(){
		$(this).children('ul').fadeOut('fast');
	});
	
	
	/*
	 * CLICK HANDLER PARA EL BOTON DE SALIDA
	*/
	$('#salir')
	.click(function(event){
					
		var resp = confirm('Realmente quiere salir? ...');
		
		if(!resp) {
			event.preventDefault();
		}
	});
});