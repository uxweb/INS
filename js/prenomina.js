/*
 * OBJETO PRENOMINA
*/
var PRENOMINA = {

	container: '#prenom',
	
	generaPrenomina: function() {
		var that = this;
		
		var _params = {p: null, ip: null, r: null};

		_params.p = PROYECTOS.selectedItem;
		_params.ip = PERIODOS.selectedItem.IDPeriodo;
		_params.r = $(OPCIONES.container).find('#recalcula').is(':enabled:checked') ? 1 : 0;
		
		LIGHTBOX.title = 'Generando Pren&oacute;mina ...';
		LIGHTBOX.closeButton = false;
		LIGHTBOX.closeOverlay = false;
		LIGHTBOX.content = '<div class="ajax-loader"></div>';

		$.ajax({
			type: 'POST',
			url: 'modulos/prenomina/GeneraPrenomina.php',
			data: _params,
			dataType: 'json',
			
			beforeSend: function()
			{
				that.clear();
				LIGHTBOX.show();
			},
			success: function(json)
			{
				try{
					if ( ! json.success ) {

						messageConsole.displayMessage(json.errorMessage, 'error');
						return false;
					}

					messageConsole.displayMessage('La pren&oacute;mina se gener&oacute; correctamente.', 'success');
					
					// ACTUALIZA LA REFERENCIA DE EL PERIODO
					PERIODOS.selectedItem.IDEstatus = 1;
					PERIODOS.selectedItem.IDNomina = json.IDNomina;
					
					// ACTUALIZA EL ICONO Y MENSAJE DE ESTATUS DEL PERIODO
					$(PERIODOS.container)
					.find('.selected')
					.prev('.icon')
					.removeClass('no-generada').addClass('generada').attr({'title': 'Generada', 'alt': 'Generada'})
					.parent()
					.data({'IDEstatus': PERIODOS.selectedItem.IDEstatus, 'IDNomina': PERIODOS.selectedItem.IDNomina});
					
					
					// HABILITA LAS OPCIONES
					var elements = '';
					if ( PERIODOS.selectedItem.IDEstatus == 1 )
						elements = '#borra-nomina, #genera-nomina, #consulta-nomina';
					else
						elements = '#genera-nomina';
						
					OPCIONES.enable(elements);
					
				} catch(e) {
					messageConsole.displayMessage('Error: ' + e.message, 'error');
				}
			},
			error: function() { LIGHTBOX.hide(); },
			complete: function() { LIGHTBOX.hide();	}
		});
	},

	borraPrenomina: function() {

		if ( ! confirm('La prenomina sera borrada, Continuar?') )
			return false;
		
		var that = this;
		
		LIGHTBOX.title = 'Borrando Pren&oacute;mina ...';
		LIGHTBOX.closeButton = false;
		LIGHTBOX.closeOverlay = false;
		LIGHTBOX.content = '<div class="ajax-loader"></div>';
		LIGHTBOX.show();
		
		$.ajax({
			type: 'POST',
			url: 'modulos/prenomina/EliminaPrenomina.php',
			data: {
				"in": PERIODOS.selectedItem.IDNomina
			},
			dataType: 'json',
			success: function(json) {
				try {
					if ( ! json.success ) {

						messageConsole.displayMessage(json.errorMessage, 'error');
						return false;
					}

					that.clear();
					messageConsole.displayMessage('La prenómina se borró correctamente.', 'success');
					
					// ACTUALIZA LAS REFERENCIAS DE EL PERIODO
					PERIODOS.selectedItem.IDEstatus = 0;
					PERIODOS.selectedItem.IDNomina = null;
					
					// ACTUALIZA ICONO Y MENSAJE DE ESTATUS DEL PERIODO
					$(PERIODOS.container)
					.find('.selected')
					.prev('.icon')
					.removeClass('generada')
					.addClass('no-generada')
					.attr({
						'title': 'No Generada',
						'alt': 'No Generada'
					})
					.parent()
					.data({
						'IDEstatus': PERIODOS.selectedItem.IDEstatus,
						'IDNomina': PERIODOS.selectedItem.IDNomina
					});
					
					// DESHABILITA BORRAR Y CONSULTAR PERIODO
					$(OPCIONES.container)
					.find('#borra-nomina, #consulta-nomina')
					.attr('disabled', 'disabled').addClass('disabled');

				} catch(e) {
					messageConsole.displayMessage('Error: ' + e.message, 'error');
				}
			},
			error: function() {	LIGHTBOX.hide(); },
			complete: function() { LIGHTBOX.hide();	}
		});
	},

	consultaPrenomina: function() {
		
		var that = this;
		
		$.ajax({
			url: 'modulos/prenomina/GetPrenomina.php',
			data: {
				"in": PERIODOS.selectedItem.IDNomina
			},
			dataType: 'json',
			
			beforeSend: function() {
				that.clear();
				
				OPCIONES.disable();
				$('#consulta-nomina')
				.toggleClass('consultar ajax-loader');
			},
			success: function(json) {
				
				try {
					
					if ( ! json.success ) {
						messageConsole.displayMessage(json.errorMessage, 'error');
						return false;
					}
					
					var _toolbar = 
						$('<ul class="menu hz-menu table-toolbar">'
					   	+   '<li class="select-all-rows">'
					   	+     '<span class="icon unchecked"></span>'
					   	+   '</li>'
					   	+   '<li>'
					   	+     '<span class="tool">Mostrar:</span><span class="tool-option selected"><a class="show-all">Todos</a></span><span class="tool-option "><a class="show-inconsistent">Inconsistentes</a></span>'
					   	+   '</li>'
					   	+ '</ul>');
	
					var _tblEmpleados =
						$('<div class="table-container"><table id="tabla_empleados" class="tabla-empleados">'
					   + '<colgroup>'
					   +   '<col class="icon" />'
					   +   '<col class="codigo" />'
					   +   '<col/>'
					   +   '<col class="nss" />'
					   +   '<col class="rfc" />'
					   +   '<col span="2"class="fecha" />'
					   +   '<col/>'
					   +   '<col span="2" class="monto"/>'
					   +   '<col class="icon" />'
					   + '</colgroup>'
					   + '<thead>'
					   +   '<tr>'
					   +     '<th></th>'
					   +     '<th>Código</th>'
					   +     '<th>Nombre</th>'
					   +     '<th>NSS</th>'
					   +     '<th>RFC</th>'
					   +     '<th>Alta</th>'
					   +     '<th>Baja</th>'
					   +     '<th>Categoria</th>'
					   +     '<th>Importe Jornales</th>'
					   +     '<th>Importe Por Distribuir</th>'
					   +     '<th></th>'
					   +   '</tr>'
					   + '</thead>'
					   + '<tbody>'
					   + '</tbody>'
					   + '</table></div>');
					
					_toolbar.click(function(event) {
						
						var $tgt = $(event.target);
	
						if( $tgt.is('.show-all') ) {
							
							$('#tabla_empleados tbody tr').removeClass('zebra');
							
							$(that.container).find('table.tabla-empleados tbody tr').show();
							$('#tabla_empleados tbody tr:odd').addClass('zebra');
							$tgt.parent().addClass('selected').siblings().removeClass('selected');
							
						} else if( $tgt.is('.show-inconsistent') ) {
							
							$('#tabla_empleados tbody tr').removeClass('zebra');
							
							$(that.container).find('table.tabla-empleados tbody tr').not('.inconsistente').hide();
							$tgt.parent().addClass('selected').siblings().removeClass('selected');
							$('#tabla_empleados tbody tr:visible:odd').addClass('zebra');
						}
						
						event.preventDefault();
					});
					
					var _contenido = _tblEmpleados.find('tbody');
					var _inconsist = null;
					var _total = 0;
					
					$.each( json.Empleados, function() {
						
						_inconsist = this.Inconsistencias.length;
						
						$('<tr' + (_inconsist > 0 ? ' class="inconsistente"' : '') + '>'
						+ '  <td class="row-selector"><span class="unchecked"></span></td>'
						+ '  <td>' + this.CodigoEmpleado + '</td>'
						+ '  <td>' + this.NombreEmpleadoNOM + '</td>'
						+ '  <td>' + this.NSSNOM + '</td>'
						+ '  <td>' + this.RFCNOM + '</td>'
						+ '  <td>' + this.FechaAltaNOM + '</td>'
						+ '  <td>' + this.FechaBajaNOM + '</td>'
						+ '  <td>' + this.CategoriaNOM + '</td>'
						
						+ '  <td class="numerico">' + this.ImporteTotal + '</td>'
						+ '  <td class="numerico">' + this.PorDistribuir + '</td>'
						+ '  <td class="row-action"><span' + (_inconsist > 0 ? ' title="Tiene inconsistencias"' : '') + ' class="' + (_inconsist > 0 ? 'warning' : 'ok') + '"></span></td>'
						+ '</tr>'
					   )
					   .data('Inconsistencias', this.Inconsistencias)
					   .appendTo(_contenido);
					});
					
					if( json.Total > 0 ) {
						_tblEmpleados.find('table').append('<tfoot class="total"><tr><th colspan="8">TOTAL</th><th class="numerico">' + json.TotalFormat + '</th><th class="numerico">' + json.TotalPorDistribuirFormat + '</th><th>&nbsp;</th></tr></tfoot>');
					}
					
					_toolbar.appendTo(that.container);
					_tblEmpleados.appendTo(that.container);
					$('#tabla_empleados tbody tr:odd').addClass('zebra');
					that.behaviorPrenomina();

				} catch(e) {
					messageConsole.displayMessage('Error: ' + e.message, 'error');
					return false;
				}
			},
			error: function() {
				
				OPCIONES.enable('');
				$('#consulta-nomina')
				.toggleClass('consultar ajax-loader');
			},
			complete: function() {
				
				OPCIONES.enable('');
				$('#consulta-nomina')
				.toggleClass('consultar ajax-loader');
			}
		});
	},
	
	behaviorPrenomina: function() {
		var _pr = this;
		
		$(this.container)
		.click(function(event)
		{
			var _tgt = $(event.target);
			
			if(_tgt.is('.warning'))
			{
				_pr.closePopup();

				var _incs = $('<div class="popup inconsistencias">'
						   + '  <div class="inconsistencias-close"></div>'
						   + '  <h5 class="inconsistencias-title">INCONSISTENCIAS</h5>'
						   + '  <div class="inconsistencias-content"></div>'
						   + '</div>'
					   	   )
					   	   .find('.inconsistencias-close')
					   	   .click(function(event){
					   	   		_pr.closePopup();
					   	   })
					   	   .end();
			
				var _content = _incs.find('.inconsistencias-content');
				
				// Crea cada una de las inconsistencias de el empleado
				$.each(_tgt.parent().parent().data('Inconsistencias'), function()
				{
					var _inconsist = $( '<div class="inconsistencia">'
									  + '  <div class="inconsistencia-tipo">' + this.Tipo + ' (' + this.Causa + ')</div>'
									  + '</div>'
								     );

					if($(this.Datos).size() > 0)
					{
						//console.log('Nom:' + this.Datos.Nomina + ' - SAO:' + this.Datos.SAO )
						$( '  <div class="table-container"><table class="inconsistencia-datos">'
						 + '    <thead>'
						 + '      <tr>'
						 + '        <th>NOMINA</th>'
						 + '        <th>SAO</th>'
						 + '      </tr>'
						 + '    </thead>'
						 + '    <tbody>'
						 + '      <tr>'
						 + '        <td>' + this.Datos.Nomina + '</td>'
						 + '        <td>' + this.Datos.SAO + '</td>'
						 + '      </tr>'
						 + '    </tbody>'
						 + '  </table></div>'
			    		).appendTo(_inconsist);
		    		}

			    	_inconsist.appendTo(_content);
				});
				
				
				_incs
				.appendTo('body')
		   	    .css({
		   	   		'top': (event.pageY - _incs.height()) + 'px',
		   	   		'left': ((event.pageX - 50) - _incs.width()) + 'px'
	   	    	});
				
				_tgt.closest('tr').addClass('selected');
				
				$(document).unbind('click');
				
				// Adiere un evento al documento para cerrar el popup
				// cuando se de clic fuera de el
				$(document)
				.bind('click', function(event)
				{
					// Si se da clic fuera del popup se cierra
					if(!$(event.target).closest('.popup').is('.popup'))
					{
						$(document).unbind('click');
						_pr.closePopup();
					}
					else
						return false;
				});
				
				event.stopPropagation();
			}
			
		});
	},
	clear: function()
	{
		$(this.container).empty();
	},
	closePopup: function()
	{
		var _pr = this;
		
		$(_pr.container).find('tr.selected').removeClass('selected');
		
		$('.popup').fadeOut('fast', function(){
			$(this).remove();
		});
	}
}

$(function()
{
	PERIODOS.onSelect = function()
	{
		PRENOMINA.clear();
		
		var elements = '';
		
		if(PERIODOS.selectedItem.IDEstatus == 1)
			elements = '#borra-nomina, #genera-nomina, #consulta-nomina';
		else if(PERIODOS.selectedItem.IDEstatus == 0)
			elements = '#genera-nomina';
		
        OPCIONES.enable(elements);
	}

	PROYECTOS.onSelect = function()
	{		
		OPCIONES.disable();
		PRENOMINA.clear();
		PERIODOS.fill();
	};
	
	PROYECTOS.onFill = function()
	{
		OPCIONES.disable();
		
		/*
		 * Handler para el formulario de opciones
		*/
		$('#form-opciones')
		.click(function(event){
			var _tgt = $(event.target);
			
			// HANDLER PARA GENERAR LA PRENOMINA
			if(_tgt.is('#genera-nomina') && _tgt.is(':enabled'))
			{
				PRENOMINA.generaPrenomina();
			}
			// HANDLER PARA BORRAR LA PRENOMINA
			else if(_tgt.is('#borra-nomina') && _tgt.is(':enabled'))
			{
				PRENOMINA.borraPrenomina();
			}
			else if(_tgt.is('#consulta-nomina') && _tgt.is(':enabled'))
			{
				PRENOMINA.consultaPrenomina();
			}
		});
	};
	
	PROYECTOS.init();
});