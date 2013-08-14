var LISTAASISTENCIA = {
	container: '#lista_asistencia',
	
	clear: function()
	{
		$(this.container).empty();
	},
	
	generaListasAsistencia: function()
	{
		_la = this;
		
		var params = {'in': PERIODOS.selectedItem.idNomina, 'r': null};
		
		params.r = $(OPCIONES.container).find('#recalcula').is(':enabled:checked') ? 1 : 0;

		LIGHTBOX.title = 'Generando Listas de Asistencia ...';
		LIGHTBOX.closeButton = false;
		LIGHTBOX.closeOverlay = false;
		LIGHTBOX.content = '<div class="ajax-loader"></div>';
		
		$.ajax({
			type: 'POST',
			url: 'modulos/lanzamiento/GeneraListas.php',
			data: params,
			dataType: 'json',
			
			beforeSend: function()
			{
				_la.clear();
				LIGHTBOX.show();
			},
			success: function(json)
			{
				if( json == null )
				{
					messageConsole.displayMessage('No se pudo obtener una respuesta.', 'error');
					return false;
				}
					
				if( ! json.success )
				{
					messageConsole.displayMessage(json.errorMessage, 'error');
					return false;
				}
				
				messageConsole.displayMessage('Las listas de asistencia se generaron correctamente.', 'success');
				
				// ACTUALIZA LA REFERENCIA DE EL PERIODO
				PERIODOS.selectedItem.idEstatus = 1;
				
				// ACTUALIZA EL ICONO Y MENSAJE DE ESTATUS DEL PERIODO
				$(PERIODOS.container)
				.find('.selected')
				.prev('.icon')
				.removeClass('no-generada').addClass('generada').attr({'title': 'L.A. Generadas', 'alt': 'L.A. Generadas'})
				.parent()
				.data('idEstatus', PERIODOS.selectedItem.idEstatus);
				
				
				// HABILITA LAS OPCIONES
				var elements = '';
				if( PERIODOS.selectedItem.idEstatus == 1 )
					elements = '#borra-listas, #genera-listas, #consulta-listas';
				else
					elements = '#genera-listas';
					
				OPCIONES.enable(elements);
			},
			complete: function()
			{
				LIGHTBOX.hide();
			}
		});
	},
	eliminaListasAsistencia: function() {

		var _la = this;
		
		LIGHTBOX.title = 'Borrando Listas de Asistencia ...';
		LIGHTBOX.closeButton = false;
		LIGHTBOX.closeOverlay = false;
		LIGHTBOX.content = '<div class="ajax-loader"></div>';
		
		$.ajax({
			type: 'POST',
			url: 'modulos/lanzamiento/EliminaListas.php',
			data: {'in': PERIODOS.selectedItem.idNomina},
			dataType: 'json',
			
			beforeSend: function()
			{
				_la.clear();
				LIGHTBOX.show();
			},
			success: function(json)
			{
				if(json == null)
				{
					messageConsole.displayMessage('No se pudo obtener una respuesta.', 'error');
					return false;
				}
					
				if(!json.success)
				{
					messageConsole.displayMessage(json.errorMessage, 'error');
					return false;
				}
				
				messageConsole.displayMessage('Las listas de asistencia se borraron correctamente.', 'success');
				
				// ACTUALIZA LA REFERENCIA DE EL PERIODO
				PERIODOS.selectedItem.idEstatus = 0;
				
				// ACTUALIZA EL ICONO Y MENSAJE DE ESTATUS DEL PERIODO
				$(PERIODOS.container)
				.find('.selected')
				.prev('.icon')
				.removeClass('generada').addClass('no-generada').attr({'title': 'L.A. No Generadas', 'alt': 'L.A. No Generadas'})
				.parent()
				.data('idEstatus', PERIODOS.selectedItem.idEstatus);
				
				
				// HABILITA LAS OPCIONES
				var elements = '';
				if(PERIODOS.selectedItem.idEstatus == 1)
					elements = '#borra-listas, #genera-listas, #consulta-listas';
				else
					elements = '#genera-listas';
					
				OPCIONES.enable(elements);
			},
			complete: function()
			{
				LIGHTBOX.hide();
			}
		});
	},
	
	consultaAsistencia: function() {

		var _la = this;
		
		$.ajax({
			type: 'POST',
			url: 'modulos/lanzamiento/GetAsistenciaEmpleados.php',
			data: {'in': PERIODOS.selectedItem.idNomina},
			dataType: 'json',
			
			beforeSend: function()
			{
				_la.clear();
				
				OPCIONES.disable();
				$('#consulta-listas')
				.toggleClass('consultar ajax-loader');
			},
			success: function(json)
			{
				if(json == null)
				{
					messageConsole.displayMessage('No se pudo obtener una respuesta.', 'error');
					return false;
				}
				
				if(!json.success)
				{
					messageConsole.displayMessage(json.errorMessage, 'error');
					return false;
				}
				
				// GENERA LOS ENCABEZADOS PARA LOS DIAS DEL PERIODO
				var headers = '';
				
				$.each(json.DiasPeriodo.Dias, function()
				{
					headers += '<th class="dia" idLista="' + this.idListaAsistencia + '">' + this.Dia + '</br>' + this.Fecha + '</th>';
				})
				
				// GENERA EL CUERPO DE LA TABLA
				var body = '';
				
				$.each(json.Empleados, function(){
					body += '<tr>'
						  + '  <td class="row-selector"><span class="unchecked"></span></td>'
						  + '  <td>' + this.CodigoEmpleado + '</td>'
						  + '  <td>' + this.Nombre + '</td>';
						  
					$.each(this.Asistencia, function()
					{
						body += '<td class="numerico' + (this.Cantidad > 0 ? ' asistio' : ' falta') + '">' + this.Cantidad + '</td>';
					});
					
					body += '<td>' + (this.AlmacenDestino == null ? '' : this.AlmacenDestino) + '</td>'
						  + '</tr>';
				});
				
				var tablaAsistencia = $('<table id="tabla_asistencia">'
									  + '  <thead>'
									  + '    <tr>'
									  + '      <th class="row-selector"></th>'
									  + '      <th>C&oacute;digo</th>'
									  + '      <th>Trabajador</th>'
									  + headers
									  + '      <th>Almacen</th>'
									  + '    </tr>'
									  + '  </thead>'
									  + '  <tbody>'
									  + body
									  + '  </tbody>'
									  + '</table>'
								);
				$('#lista_asistencia').append(tablaAsistencia);
				$('#tabla_asistencia tbody tr:odd').addClass('zebra');
				
				// HANDLER PARA SELECCION DE LISTAS DE ASISTENCIA
				$('#tabla_asistencia').click(function(event)
				{
				    var tgt = $(event.target);
				
				    if(tgt.is('th.dia'))
				    {
				        var ix = parseInt(tgt.index()) + 1;
				        tgt.toggleClass('selected');
				        $(this).find('tbody td:nth-child(' + ix + ')').toggleClass('selected');
				    }
				});
			},
			error: function()
			{
				OPCIONES.enable('');
				$('#consulta-listas')
				.toggleClass('consultar ajax-loader');
			},
			complete: function()
			{
				OPCIONES.enable('');
				$('#consulta-listas')
				.toggleClass('consultar ajax-loader');
			}
		});
	},
	
	enviaListasAsistencia: function() {

		var selectedLists = $('#tabla_asistencia th.dia.selected').length;
		
		if(selectedLists > 0)
		{
			if( ! confirm('Se enviaran solo las listas de asistencia seleccionadas, Continuar?') )
				return false;
		}
		else
		{
			if( ! confirm('Se enviaran todas las listas de asistencia, Continuar?') )
				return false;
		}
		
		var _la = this;
		
		LIGHTBOX.title = 'Enviando Listas de Asistencia ...';
		LIGHTBOX.closeButton = false;
		LIGHTBOX.closeOverlay = false;
		LIGHTBOX.content = '<div class="ajax-loader"></div></br><center><div id="estatus_envio">Enviando listas ...</div></center>';

		var lista = null;

		$.ajax({
			type: 'POST',
			url: 'modulos/lanzamiento/EnviaListas.php',
			data: {
				idNom: PERIODOS.selectedItem.idNomina
			},
			dataType: 'json',
			
			beforeSend: function()
			{
				LIGHTBOX.show();
			},
			success: function(json)
			{
				try{					
					if(!json.success)
					{
						messageConsole.displayMessage(json.errorMessage, 'error');
						return false;
					}
					
					messageConsole.displayMessage('Las listas de asistencia se enviaron correctamente al SAO.', 'success');
				}
				catch(e){
					messageConsole.displayMessage('Error: ' + e.message, 'error');
					return false;
				}
			},
			error: function()
			{
				LIGHTBOX.hide();
			},
			complete: function()
			{
				LIGHTBOX.hide();
			}
		});
	}
};


$(function(){
	
	PERIODOS.container = '#prenominas .selector-content';
	PERIODOS.dataURL = 'modulos/lanzamiento/GetListaPrenominas.php';
	
	PERIODOS.onSelect = function()
	{
		LISTAASISTENCIA.clear();

		var elements = '';
		
		if(PERIODOS.selectedItem.idEstatus == 1)
			elements = '#borra-listas, #genera-listas, #consulta-listas';
		else if(PERIODOS.selectedItem.idEstatus == 0)
			elements = '#genera-listas';
		
        OPCIONES.enable(elements);
	};

	PROYECTOS.onSelect = function()
	{		
		OPCIONES.disable();
		LISTAASISTENCIA.clear();
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
			if(_tgt.is('#genera-listas') && _tgt.is(':enabled'))
			{
				LISTAASISTENCIA.generaListasAsistencia();
			}
			// HANDLER PARA BORRAR LA PRENOMINA
			else if(_tgt.is('#borra-listas') && _tgt.is(':enabled'))
			{
				LISTAASISTENCIA.eliminaListasAsistencia();
			}
			else if(_tgt.is('#consulta-listas') && _tgt.is(':enabled'))
			{
				LISTAASISTENCIA.consultaAsistencia();
			}
			else if(_tgt.is('#envia-listas') && _tgt.is(':enabled'))
			{
				LISTAASISTENCIA.enviaListasAsistencia();
			}
		});
	};
	
	PROYECTOS.init();
});