$(function() {
	
	// CARGA LOS CONCEPTOS DE CADA PROYECTO
	$.ajax({
		url: 'modulos/porcentajes/GetPorcentajesFacturacion.php',
		dataType: 'json',
		
		success: function(json) {
			try {
				
				if( !json.success ) {
					
					messageConsole.displayMessage(json.errorMessage, 'error');
					return false;
				}
				
				if( json.noRows ) {
					messageConsole.displayMessage(json.noRowsMessage, 'error');
					return false;
				}
				
			} catch(e) {
				messageConsole.displayMessage('Error: ' + e.message, 'error');
				return false;
			}
			
			var _blocks = null;
			
			$.each(json.Proyectos, function()
			{
				var _proyecto = this;
				_blocks = $('<div id="' + this.IDProyecto + '" class="block">'
			          	+    '<h3 class="block-title">' + this.Proyecto + '</h3>'
			          	+      '<ul class="menu hz-menu">'
			          	+		 '<li><span class="icon add"></span><span class="text agrega-concepto">Nuevo Porcentaje</span></li>'
			          	+		 '<li><span class="icon delete"></span><span class="text elimina-concepto">Eliminar Porcentajes (<span class="items">0</span>)</span></li>'
			          	+	   '</ul>'
			          	+	 '<div class="block-content">'
			          	+		'<div class="content">'
						+          	'<table class="scrollTable" cellspacing="0" cellpadding="0">'
						+              '<thead class="fixedHeader">'
						+              '  <tr>'
						+              '    <th>&nbsp;</th>'
						+              '    <th>Vigencia</th>'
						+              '    <th>% IMSS</th>'
						+              '    <th>% Impuesto Estatal</th>'
						+              '    <th>% Administraci&oacute;n</th>'
						+              '    <th>% I.V.A.</th>'
						+              '  </tr>'
						+              '</thead>'
						+          		'<tbody class="scrollContent"></tbody>'
				        +  			'</table>'
				        + 		'</div>'
		                + 	 '</div>'
		                +   '</div>');
		        
		        var _tableContent = _blocks.find('tbody');
				
				$.each(this.Porcentajes, function()
				{
					$('<tr>'
					+	'<td class="row-selector"><span class="unchecked"></span></td>'
	      			+	'<td>' + this.Vigencia + '</td>'
	      			+	'<td>' + this.IMSS + '</td>'
	      			+	'<td>' + this.ImpuestoEstatal + '</td>'
	      			+	'<td>' + this.Administracion + '</td>'
	      			+	'<td>' + this.IVA + '</td>'
	      			+ '</tr>'
      				)
      				.data({'IDProyecto': _proyecto.IDProyecto, 'IDPorcentaje': this.IDPorcentaje})
      				.appendTo(_tableContent);
				});
				
				$('#module-content').append(_blocks);
			});

			$('tbody tr:nth-child(odd)').addClass('zebra');
		}
	});
	
	$('.block .menu').live('click', function(event) {

		var _tgt = $(event.target);
		var _idProyecto = _tgt.parents('.block').attr('id');
		var _table = $(this).next().find('tbody');
		
		if(_tgt.is('.agrega-concepto'))
		{
			LIGHTBOX.title = 'Nuevo Porcentaje para -' + _tgt.parents('ul').prev().text() + '-';
			LIGHTBOX.content = '<form id="form-porcentajes">'
			+ '<div><label for="vig">Vigencia a partir de</label><input id="vig" class="inputtext required" type="text" maxlength="7" /><input type="hidden" id="vigencia" /></div>'
			+ '<div><label for="imss">% IMSS</label><input id="imss" class="inputtext required" type="text" maxlength="7" /></div>'
			+ '<div><label for="estatal">% Impuesto Estatal</label><input id="estatal" class="inputtext required" type="text" maxlength="7" /></div>'
			+ '<div><label for="administracion">% Administraci&oacute;n</label><input id="administracion" class="inputtext required" type="text" maxlength="7" /></div>'
			+ '<div><label for="iva">% I.V.A.</label><input id="iva" class="inputtext required" type="text" maxlength="7" /></div>'
			+ '<div class="form-buttons"><input type="button" class="button aceptar" value="Aceptar" /><input type="button" class="button cancelar" value="Cancelar" /></div>'
			+ '</form>';
			
			LIGHTBOX.show();
			
			$('#vig').datepicker(
				{
				   dateFormat: 'dd-mm-yy',
				   altField: '#vigencia',
				   altFormat: 'yy-mm-dd',
				   showWeek: 'true',
				   firstDay: '1',
				   showOtherMonths: "true",
				   selectOtherMonths: "true",
				   buttonImage: "img/calendar/calendar_light-green_16x16.png",
				   showOn: "both",
				   buttonImageOnly: true
				 }
			);
			
			/*
			 * RESTRINGE LA ENTRADA A NUMEROS EN LOS CAMPOS DEL FORMULARIO
			 * QUE REPRESENTAN LOS PORCENTAJES
			*/ 
			$('#form-porcentajes input.inputtext.required')
			.keypress(function(event)
			{
				if(!(event.which <= 57 && event.which >= 46))
				{
					messageConsole.displayMessage('Solo se permiten valores numericos.', 'error');
					$(event.target).focus();
					return false;
				}

				// SI YA HAY PUNTO DECIMAL, NO PERMITIR OTRO
				if((event.charCode == 46 || event.keyCode == 46) && ($(this).val().indexOf('.')) >= 0)
				{
					return false;
				}
			});
			
			/*
			 * CLICK HANDLER PARA LOS BOTONES DEL FORMULARIO
			*/
			$('#form-porcentajes .form-buttons')
			.click(function(event)
			{
				var _tgt = $(event.target);
				
				if(_tgt.is('.aceptar'))
				{
					var _error = false;
					
					/*
					 * VALIDA QUE LA VIGENCIA ESTE SELECCIONADA
					*/
					if($.trim($('input#vigencia').val()).length < 1)
					{
						messageConsole.displayMessage('Seleccione una fecha de vigencia.', 'error');
						$('input#vigencia').focus();
						_error = true;
						return false;
					}
					
					/*
					 * VALIDA QUE LOS CAMPOS TENGAN VALORES
					*/
					$('#form-porcentajes input.inputtext.required')
					.each(function()
					{
						if($.trim($(this).val()).length == 0)
						{
							messageConsole.displayMessage('Debe escribir un valor en el campo.', 'error');
							$(this).focus();
							_error = true;
							return false;
						}
					});
					
					if(!_error)
					{
						var _vigencia = $('input#vigencia').val();
						var _imss = $('input#imss').val();
						var _estatal = $('input#estatal').val();
						var _administracion = $('input#administracion').val();
						var _iva = $('input#iva').val();
						
						$.ajax({
							type: 'POST',
							url: 'modulos/porcentajes/registraPorcentajes.php',
							data: { p: _idProyecto
								  , v: _vigencia
								  , im: _imss
								  , ie: _estatal
								  , ia: _administracion
								  , iv: _iva
							 },
							 dataType: 'json',
							 
							 beforeSend: function()
							 {
							 	_tgt.siblings().andSelf().attr('disabled', 'disabled').addClass('disabled');
						 	 },
						 	 success: function(json)
						 	 {
						 	 	if(!json.success)
						 	 	{
						 	 		messageConsole.displayMessage(json.errorMessage, 'error');
						 	 		return false;
						 	 	}

					 	 		$('<tr>'
								+	'<td class="row-selector"><span class="unchecked"></span></td>'
				      			+	'<td>' + _vigencia + '</td>'
				      			+	'<td>' + _imss + '</td>'
				      			+	'<td>' + _estatal + '</td>'
				      			+	'<td>' + _administracion + '</td>'
				      			+	'<td>' + _iva + '</td>'
				      			+ '</tr>'
			      				)
			      				.data({'IDProyecto': _idProyecto, 'IDPorcentaje': json.IDPorcentaje})
			      				.appendTo(_table);
			      				
			      				LIGHTBOX.hide();
			      				
								messageConsole.displayMessage('Se agregaron correctamente los porcentajes.', 'success');
								$('tbody tr:nth-child(odd)').addClass('zebra');
					 	 	 },
					 	 	 complete: function()
					 	 	 {
					 	 	 	_tgt.siblings().andSelf().removeAttr('disabled').removeClass('disabled');
					 	 	 }
						});
					}						
				}
				else if(_tgt.is('.cancelar'))
				{
					LIGHTBOX.hide();
				}
				
				event.preventDefault();
			});
		}
		/*
		 * ELIMINA PORCENTAJES
		*/
		else if(_tgt.is('.elimina-concepto'))
		{
			var _items = parseInt($(this).find('.items').text());
			var _itemCounter = $(this).find('.items');
			
			if(_items < 1)
			{
				messageConsole.displayMessage('Debe seleccionar al menos un elemento para realizar esta operacion.', 'error');
				return false;
			}
			
			if(confirm(_items + ' porcentajes seran eliminados\nContinuar?'))
			{
				$.each($(this).next().find('tr.selected'), function()
				{
					_item = this;
					
					/* PETICION PARA ELIMINAR EL CONCEPTO*/
					$.ajax({
						type: 'POST',
						url: 'modulos/porcentajes/EliminaPorcentaje.php',
						data: {ip: $(_item).data('IDPorcentaje')},
						dataType: 'json',
						async: false, // PETICION SINCRONA PARA NO PERDER LA REFERENCIA DE CADA ITEM
						
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
							
							$(_item).remove();
							_items--;
							_itemCounter.text(_items);
							
						}
					});
				});
			}
		}
    });

	$('.block-content')
		.live('click', function(event)
		{
			var _tgt = $(event.target);

			if(_tgt.is('span') && _tgt.parent().is('.row-selector'))
			{
		    	_tgt
		    		.toggleClass('checked unchecked')
		    		.parents('tr')
		    		.toggleClass('selected');

		    	$(this)
		    		.prev()
		    		.find('.items')
		    		.text($(this).find('tr.selected').size());
	    	}
		});
});