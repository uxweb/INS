$(function() {
	
	// CARGA LOS ALMACENES DE CADA PROYECTO
	$.ajax({
		type: 'POST',
		url: 'modulos/almacenes/GetAlmacenesCosto.php',
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
			}
			catch(e) {
				messageConsole.displayMessage('Error: ' + e.message, 'error');
				return false;
			}
			
			var _blocks = null;
			
			$.each(json.Proyectos, function() {
				
				var _proyecto = this;
				
				_blocks = $('<div id="' + this.idProyecto + '" class="block">'
			          	+    '<h3 class="block-title">' + this.Proyecto + '</h3>'
			          	+      '<ul class="menu hz-menu">'
			          	+		 '<li><span class="icon add"></span><span class="text agrega-concepto">Agregar Almacen</span></li>'
			          	+		 '<li><span class="icon delete"></span><span class="text elimina-almacen">Eliminar Almacenes (<span class="items">0</span>)</span></li>'
			          	+	   '</ul>'
			          	+	 '<div class="block-content">'
			          	+		'<div class="content">'
						+          	'<table class="scrollTable" cellspacing="0" cellpadding="0">'
						+              '<thead class="fixedHeader">'
						+              '  <tr>'
						+              '    <th>&nbsp;</th>'
						+              '    <th>Almacen</th>'
						+              '    <th>Almacen SAO</th>'
						+              '    <th>Tipo Costo</th>'
						+              '    <th>Cuenta Contable</th>'
						+              '    <th>Estatus</th>'
						+              '  </tr>'
						+              '</thead>'
						+          		'<tbody class="scrollContent"></tbody>'
				        +  			'</table>'
				        + 		'</div>'
		                + 	 '</div>'
		                +   '</div>');
		        
		        var _tableContent = _blocks.find('tbody');
				
				$.each(this.Almacenes, function() {
					
					$('<tr>'
					+	'<td class="row-selector"><span class="unchecked"></span></td>'
	      			+	'<td>' + this.Nombre + '</td>'
	      			+	'<td>' + this.NombreAlmacenSAO + '</td>'
	      			+	'<td>' + this.TipoCosto + '</td>'
	      			+	'<td>' + this.CuentaContable + '</td>'
	      			+	'<td class="row-status"><span class="aplica-interfaz ' + (this.EstaActivo == 1 ? 'active' : 'inactive') + '"></span></td>'
	      			+ '</tr>'
      				)
      				.data({'idProyecto': _proyecto.idProyecto, 'idAlmacen': this.idAlmacen})
      				.appendTo(_tableContent);
				});
				
				$('#module-content').append(_blocks);
			});

			$('tbody tr:nth-child(odd)').addClass('zebra');
		}
	});
	
	$('.block .menu')
		.live('click', function(event)	
		{
			var _tgt = $(event.target);
			var _idProyecto = _tgt.parents('.block').attr('id');
			var _table = $(this).next().find('tbody');
			
			if(_tgt.is('.agrega-concepto'))
			{
				LIGHTBOX.title = 'Nuevo Almacen para -' + _tgt.parents('ul').prev().text() + '-';
				LIGHTBOX.content = '<form id="form-almacen">'
				+ '<div><label for="nombre-almacen">Nombre de Almacen</label><input id="nombre-almacen" class="inputtext required" type="text" maxlength="50" /></div>'
				+ '<div><label for="tipos-costo">Tipo de Costo</label><select id="tipos-costo"></select></div>'
				+ '<div><label for="almacenes-sao">Almacen SAO</label><select id="almacenes-sao"></select></div>'
				+ '<div><label for="cuenta-contable">Cuenta Contable</label><input id="cuenta-contable" class="inputtext required" type="text" maxlength="30" /></div>'
				+ '<div class="form-buttons"><input type="button" class="button aceptar" value="Aceptar" /><input type="button" class="button cancelar" value="Cancelar" /></div>'
				+ '</form>';
				
				LIGHTBOX.show();
				
				$('#form-almacen .form-buttons')
				.click(function(event)
				{
					var _tgt = $(event.target);
					
					if(_tgt.is('.aceptar'))
					{
						var _error = false;
						
						/*
						 * VALIDA QUE LOS CAMPOS TENGAN VALORES
						*/
						$('#form-almacen input.inputtext.required')
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
							var _nombreAlmacen = $('input#nombre-almacen').val();
							var _idTipoCosto = $('select#tipos-costo').val();
							var _idAlmacenSAO = $('select#almacenes-sao').val();
							var _cuentaContable = $('input#cuenta-contable').val();

							$.ajax({
								type: 'POST',
								url: 'modulos/almacenes/AgregaAlmacen.php',
								data: {p: _idProyecto
									 , n: _nombreAlmacen
									 , tc: _idTipoCosto
									 , as: _idAlmacenSAO
									 , cc: _cuentaContable
								 },
								 dataType: 'json',
								 
								 beforeSend: function()
								 {
								 	_tgt.siblings().andSelf().attr('disabled', 'disabled').addClass('disabled');
							 	 },
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
	
						 	 		$('<tr>'
									+	'<td class="row-selector"><span class="unchecked"></span></td>'
					      			+	'<td>' + _nombreAlmacen + '</td>'
					      			+	'<td>' + $('select#almacenes-sao :selected').text() + '</td>'
					      			+	'<td>' + $('select#tipos-costo :selected').text() + '</td>'
					      			+	'<td>' + _cuentaContable + '</td>'
					      			+	'<td class="row-status"><span class="estatus inactive"></span></td>'
					      			+ '</tr>'
				      				)
				      				.data({'idProyecto': _idProyecto, 'idAlmacen': json.idAlmacen})
				      				.appendTo(_table);
				      				
				      				LIGHTBOX.hide();
				      				
									messageConsole.displayMessage('Se agreg&oacute; correctamente el almacen.', 'success');
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
				
				$.ajax({
					type: 'GET',
					url: 'modulos/almacenes/GetTiposCosto.php',
					dataType: 'json',
					
					beforeSend: function()
					{
						$('select.#tipos-costo')
						.attr('disabled', 'disabled')
						.append('<option id="load-option">cargando opciones ...</option>');
					},
					success: function(json)
					{
						try {
							if(!json.success)
							{
								messageConsole.displayMessage(json.errorMessage, 'error');
								return false;
							}
							
							var _tiposCosto = null;
	
							$.each(json.TiposCosto, function()
							{
								_tiposCosto += '<option value="' + this.idTipoCosto + '">' + this.TipoCosto + '</option>';
							});
							
							$('select.#tipos-costo').append(_tiposCosto).removeAttr('disabled');
						} catch(e) {
							messageConsole.displayMessage('Error: ' + e.message, 'error');
						}
					},
					complete: function()
					{
						$('select.#tipos-costo').children('#load-option').remove();
					}
				});
				
				$.ajax({
					type: 'POST',
					url: 'modulos/almacenes/GetAlmacenesSAO.php',
					data: {p: _idProyecto},
					dataType: 'json',
					
					beforeSend: function()
					{
						$('select.#almacenes-sao')
						.attr('disabled', 'disabled')
						.append('<option id="load-option">cargando opciones ...</option>');
					},
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
						
						var _almacenes = null;
						
						$.each(json.AlmacenesSAO, function()
						{
							_almacenes += '<option value="' + this.idAlmacen + '">' + this.Almacen + '</option>';
						});
						
						$('select.#almacenes-sao').append(_almacenes).removeAttr('disabled');
					},
					complete: function()
					{
						$('select.#almacenes-sao').children('#load-option').remove();
					}
				});
			}
			/*
			 * ELIMINA ALMACENES
			*/
			else if(_tgt.is('.elimina-almacen'))
			{
				var _items = parseInt($(this).find('.items').text());
				var _itemCounter = $(this).find('.items');
				
				if(_items < 1)
				{
					messageConsole.displayMessage('Debe seleccionar al menos un almacen para realizar esta operacion.', 'error');
					return false;
				}
				
				if(confirm(_items + ' almacenes seran eliminados\nContinuar?'))
				{
					$.each($(this).next().find('tr.selected'), function()
					{
						_item = this;
						
						/* PETICION PARA ELIMINAR EL ALMACEN*/
						$.ajax({
							type: 'POST',
							url: 'modulos/almacenes/EliminaAlmacen.php',
							data: {ia: $(_item).data('idAlmacen')},
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
	    	else if(_tgt.is('span') && _tgt.parent().is('.row-status'))
	    	{
	    		/*
				 * MANEJA EL CAMBIO DE ESTATUS
				*/
	    		$.ajax({
	    			type: 'POST',
	    			url: 'modulos/almacenes/SetEstatusAlmacen.php',
	    			data: {ia: _tgt.parents('tr').data('idAlmacen')},
	    			dataType: 'json',
	    			
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
								
	    				_tgt.toggleClass('active inactive');
	    			}
	    		});
	    	}
		});
});