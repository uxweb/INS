// JavaScript Document
$(function() {
//
	$(document).ajaxError(
		function(event, jqXHR, ajaxSettings, thrownError)
		{
			//console.log(JSON.stringify(jqXHR));
			//console.log(JSON.stringify(ajaxSettings));
			
			// Bloque try para atrapar la excepcion lanzada cuando se genera un timeout en la peticion
			try {
				var errorMessage = 'Estatus ' + jqXHR.status + ': ';
				var diplayError = true;
				
				if(jqXHR.readyState != 0)
				{
					switch(jqXHR.status)
					{
						case 404:
							errorMessage += 'La pagina ' + ajaxSettings.url + ' no existe.';//$(xhr.responseText)[5].innerHTML
							break;
						case 500:
							errorMessage += 'Error del servidor de internet.';
							break;
						default:
							errorMessage += jqXHR.statusText;//'Error desconcido.';
					}
				}
				else
				{					
					switch(jqXHR.statusText)
					{
						case 'timeout':
							errorMessage += 'Se termino el tiempo de espera asignado para realizar la petición.';
							break;
							
						// Don´t show error when a request is aborted by custom code
						case 'abort':
							errorMessage += 'Peticion abortada.';
							diplayError = false;
							break;
						/*
						case 'error':
							errorMessage += '';
							break;
						case 'notmodified':
							errorMessage += '';
							break;
						case 'parsererror':
							errorMessage += '';
							break;
						*/
						default:
							errorMessage += jqXHR.statusText;
							break;
					}
				}
				if(diplayError)
					messageConsole.displayMessage(errorMessage, 'error');
			}catch(e){
				messageConsole.displayMessage(e.message, 'error');
			}
		}
	);

	/*var LP = {
		container: '#lista-proyectos',
		dataURL: 'inc/GetListaProyectos.php',
		
		init: function()
		{
			var _lp = this;
			
			// hacer request ajax para obtener la lista de proyectos
			$.ajax({
				type: 'GET',
				url: _lp.dataURL,
				dataType: 'json',
				cache: false,
				
				success: function(json)
				{
					if(json.success == 0)
					{
						messageConsole.displayMessage(json.errorMessage, 'error');
					}
					else
					{
						$.each(json.Proyectos, function()
						{
							$('<li><a class="proyecto" href="' + this.idProyecto + '">' + this.Nombre + '</a></li>')
							.appendTo(_lp.container + ' ul');
						});
						
						$(_lp.container).hover(function(){
							$(this).children('ul').stop(true, true).slideDown('fast');
							}, function(){
								$(this).children('ul').slideUp('normal');
							});
		
							$('#lista-proyectos')
							.click(function(e)
							{
								var _tgt = $(e.target);

								if(_tgt.is('a.proyecto'))
								{
									// ESTABLECER COMO PROYECTO SELECCIONADO
									_tgt.parent().parent().find('a').removeClass('selected');
									_tgt.addClass('selected');
		
									$('#proyecto-activo')
									.text(_tgt.text());
									
									if(getURL() == 'claves_trabajadores.html')
									{
										console.log('solo en claves');
									}
								}
								
								$(this).children('ul').slideToggle('fast');
								
								e.preventDefault();
							});
					}
				}
			});
		},
	};*/
	
	// EVITA EL EVENTO SUBMIT EN LOS FORMULARIOS
	$('form')
	.live('submit', function(event){
		 event.preventDefault();
	 });

	//LP.init();
	messageConsole.init();
	
});


function getURL(){
	return location.href.substring(location.href.lastIndexOf('/') + 1)
}

// CONSOLA DE MENSAJES
var messageConsole =
{
	container: '#message-console',
	errorClass: 'error',
	successClass: 'success',
	infoClass: 'info',
	timerID: null,
	displayed: false,
	hideAfter: 5000,
	
	init: function()
	{
		var _mc = this;
		
		$('#console-toggler')
		.click(function(event)
		{				
			if($(this).hasClass('close'))
			{	
				_mc.hideConsole();
			}
			else
			{
				_mc.showConsole();
			}
		});
	},
	displayMessage: function(message, type)
	{
		var _msgClass = null;
		
		if(type == 'error')
			_msgClass = this.errorClass;
		if(type == 'success')
			_msgClass = this.successClass;
		if(type == 'info')
			_msgClass = this.infoClass;
		
		$(this.container).removeClass().addClass(_msgClass);
			
		$('#console-message').html(message)
		
		//console.log(this.timerID);
		
		if(this.timerID !== null)
		{
			//console.log(this.timerID);
			clearTimeout(this.timerID);
		}
		
		this.showConsole();
	},
	showConsole: function()
	{
		var _cl = this;
		//$(this.container).is(':visible')
		if(!this.displayed)
			$('#console-toggler').toggleClass('open close');
		
		$(this.container)
		.animate({
				bottom: '0'
		},{
			duration: 'fast',
			queue: false,
			complete: function()
			{
				_cl.displayed = true;
				
				_cl.timerID = setTimeout(function()
				{
					_cl.hideConsole();
				}, _cl.hideAfter)
			}
		} );
	},
	hideConsole: function()
	{
		var _cl = this;
		
		if(this.timerID !== null)
		{
			clearTimeout(this.timerID);
		}			
		
		$(this.container).animate({
				bottom: '-29px'
		},{
			duration: 'normal',
			queue: false,
			complete: function(){
				$('#console-toggler').toggleClass('open close');
				_cl.displayed = false;
			}
		} );
	}
};

/*
 * LIGHTBOX OBJECT
*/
var LIGHTBOX = {
	OLcontainer: '.overlay',
	LBcontainer: '.lightbox',
	title: 'Lightbox Title Here',
	content: null,
	closeButton: true,
	closeOverlay: true,
	
	show: function()
	{
		var _lb = this;
		// DISABLE WINDOW SCROLLBARS
		$('body').css({'overflow': 'hidden'});
		
		// CREA UN OVERLAY
		$('<div class="overlay"></div>')
		.hide()
		.css('opacity', 0.5)
		.insertBefore('#message-console')
		.fadeIn('fast')
		.click(function(event)
		{
			if(_lb.closeOverlay)
				_lb.hide();

			event.stopPropagation();
		});
		
		// CREA EL LIGHTBOX
		$('<div class="lightbox">'
		+ '  <div class="lightbox-title">' + this.title + '</div>'
		+ (_lb.closeButton ? '  <div class="lightbox-close"></div>' : '')
		+ '  <div class="lightbox-content"></div>'
		+ '</div>')
		.insertAfter(this.OLcontainer)
		.hide()
		.find('.lightbox-close')
		.click(function()
		{
			_lb.hide();
		})
		.end()
		.find('.lightbox-content')
		.append(this.content);
		
		this.position();
	},
	hide: function()
	{
		$(this.OLcontainer + ', ' + this.LBcontainer)
		.fadeOut('fast')
		.remove();

		$('body').css('overflow', 'auto');
	},
	position: function()
	{
		var top = ($(window).height() - $(this.LBcontainer).height()) / 2;
		var left = ($(window).width() - $(this.LBcontainer).width()) / 2;

		$(this.LBcontainer)
			.css({
				'top': (top + $(document).scrollTop()) + 'px',
				'left': left + 'px'
			})
			.fadeIn('slow');
	}
};