/*
 * PROYECTOS
*/
var PROYECTOS = {
	container: '#proyectos .selector-content',
	selectedItem: null,
	
	init: function() {
		
		this.fill();
	},
	fill: function()
	{
		var _pr = this;
		
		this.onFill();

		$.ajax({
			type: 'POST',
			url: 'inc/GetListaProyectos.php',
			dataType: 'json',
			timeout: 20000,
			cache: false,
			success: function(json)
			{
				try{
					if(!json.success)
					{
						messageConsole.displayMessage(json.errorMessage, 'error');
						return false;
					}
				} catch(e) {
					messageConsole.displayMessage('Error: ' + e.message, 'error');
					return false;
				}
				
				var _proyectos = $('<ul></ul>').addClass('menu vt-menu');
				
				$.each(json.Proyectos, function()
				{
					$('<li></li>')
					.html(this.Nombre)
					.data('IDProyecto', this.IDProyecto)
					.appendTo(_proyectos);
				});

				_proyectos
				.click(function(event)
				{
					var _tgt = $(event.target);
					
					if(_tgt.is('li') && !_tgt.is('.selected'))
					{
						_pr.select(_tgt);
					}
				});
				
				$(_pr.container).append(_proyectos);
			}
		});
	},
	select: function(opt)
	{
		// Previene que la lista de periodos
		// se llene con datos de varios proyectos si el usuario
		// no espera a que termine la peticion e inicia otra
		if(PERIODOS.fetching)
			PERIODOS.activeRequest.abort();
			
		this.selectedItem = opt.data('IDProyecto');
		opt.siblings().removeClass('selected').end().addClass('selected');
		this.onSelect();
	},
	onFill: function(){},
	onSelect: function(){}
};


/*
 * PERIODOS
*/	
var PERIODOS = {
	container: '#periodos .selector-content',
	dataURL: 'modulos/prenomina/GetListaPeriodosNomina.php',
	fetching: false,
	activeRequest: null,
	selectedItem: {},
	
	fill: function()
	{			
		var _per = this;
		
		_per.activeRequest =
		$.ajax({
			url: _per.dataURL,
			data: {p: PROYECTOS.selectedItem},
			dataType: 'json',
			timeout: 50000,
			//async: false,
			
			beforeSend: function()
			{
				_per.disable();
				_per.clear();
				_per.fetching = true;
			},
			success: function(json)
			{
				try {
					if( ! json.success)
					{
						messageConsole.displayMessage(json.errorMessage, 'error');
						return false;
					}
					
					var _periodos = $('<ul class="tree"></ul>');
					var _anio = null;
					var _mes = null;
					
					$.each(json.PerNomina, function()
					{
						_anio = $('<li><span class="handle closed"></span><span class="text">' + this.Anio + '</span></li>');
						_anio.appendTo(_periodos);
						
						$.each(this.Meses, function()
						{
							_mes = $('<ul><li><span class="handle closed"></span><span class="text">' + this.Mes + '</span></li></ul>');
							_mes.appendTo(_anio);
							
							var _periodos = $('<ul></ul>');
							
							$.each(this.Periodos, function()
							{
								var _estatusClass = null;
								
								switch(this.IDEstatus)
								{
									case 1:{
										_estatusClass = 'generada';
										break;
									}
									default:{
										_estatusClass = 'no-generada'
									}
								}
								
								$('<li><span class="icon ' + _estatusClass + '" title="' + this.Estatus + '"></span><span class="text periodo">' + this.Periodo + '</span></li>')
								 .data({'IDPeriodo': this.IDPeriodo
								 	  , 'IDEstatus': this.IDEstatus
								 	  , 'IDNomina': this.IDNomina
							 	  })
								 .appendTo(_periodos);
							});
							
							_mes.find('li').append(_periodos);
						});
					});
					
					$(_per.container).append(_periodos);
					
					_per.behavior();
					
				} catch(e){
					messageConsole.displayMessage('Error: ' + e.message, 'error');
				}
			},
			complete: function()
			{
				_per.enable();
				_per.fetching = false;
			}
		});
		
	},
	clear: function()
	{
		$(this.container + ' * ').not('.overlay').remove();
	},
	disable: function()
	{
		$(this.container).find('.overlay').fadeIn('fast');
	},
	enable: function()
	{
		$(this.container).find('.overlay').fadeOut('fast');
	},
	behavior: function()
	{
		var _pr = this;
		
		$(this.container + ' ul.tree')
		.find('ul')
		.hide()
		.end()
		.click(function(event)
		{
		    var _tgt = $(event.target);
		
		    if(_tgt.is('.handle, .text'))
		    {
		        if(_tgt.is('.text'))
		            _tgt.prev('.handle').toggleClass('closed opened')
		        else
		            _tgt.toggleClass('closed opened');

		        if(_tgt.prev().is('.icon') && !_tgt.is('.selected'))
		        {
		        	$(this).find('.text').removeClass('selected');
		        	
		            _pr.select(_tgt);
		        }

		        _tgt
		        .nextAll('ul')
		        .slideToggle();
		    }
		});
	},
	select: function(opt)
	{			
        opt.addClass('selected');
        
        this.selectedItem = {'IDPeriodo': opt.parent().data('IDPeriodo')
        				  , 'IDEstatus': opt.parent().data('IDEstatus')
        				  , 'IDNomina': opt.parent().data('IDNomina')};
        				  
        this.onSelect();
	},
	onSelect: function(){}
};


/*
 * OPCIONES
*/
var OPCIONES = {
	container: '#opciones .selector-content',
	disable: function()
	{
		$(this.container).find('input').attr('disabled', 'disabled').attr('checked', false).filter(':button').addClass('disabled');
	},
	enable: function(elements)
	{
		this.disable();
		
		if(elements.length == 0)
			elements = 'input';
		
		$(this.container).find(elements).removeAttr('disabled').removeClass('disabled');
		$(this.container).find(':checkbox').attr('checked', false).removeAttr('disabled');
	}
};