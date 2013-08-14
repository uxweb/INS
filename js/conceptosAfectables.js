$(function() {
	
	// CARGA LOS CONCEPTOS DE CADA PROYECTO
	$.ajax({
		type: 'POST',
		url: 'modulos/conceptos/GetConceptos.php',
		dataType: 'json',
		
		success: function(json) {
			try{
				
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
			
			$.each(json.Proyectos, function() {
				var _proyecto = this;
				
				_blocks = $('<div id="' + this.idProyecto + '" class="block">'
			          	+    '<h3 class="block-title">' + this.Proyecto + '</h3>'
			          	+      '<ul class="menu hz-menu">'
			          	+		 '<li><span class="icon add"></span><span class="text agrega-concepto">Agregar Concepto</span></li>'
			          	+		 '<li><span class="icon delete"></span><span class="text elimina-concepto">Eliminar Conceptos (<span class="items">0</span>)</span></li>'
			          	+	   '</ul>'
			          	+	 '<div class="block-content">'
			          	+		'<div class="content">'
						+          	'<table>'
						+              '<thead>'
						+              '  <tr>'
						+              '    <th>&nbsp;</th>'
						+              '    <th>Concepto</th>'
						+              '    <th>Naturaleza</th>'
						+              '    <th>Aplica Interfaz</th>'
						+              '    <th>Aplica Facturaci&oacute;n</th>'
						+              '    <th>Aplica Imp. Seg. Social</th>'
						+              '    <th>Aplica Imp. Estatal</th>'
						+              '  </tr>'
						+              '</thead>'
						+          		'<tbody></tbody>'
				        +  			'</table>'
				        + 		'</div>'
		                + 	 '</div>'
		                +   '</div>');
		        
		        var _tableContent = _blocks.find('tbody');
				
				$.each(this.Conceptos, function()
				{
					$('<tr>'
					+	'<td class="row-selector"><span class="unchecked"></span></td>'
	      			+	'<td>' + this.Concepto + '</td>'
	      			+	'<td>' + this.Naturaleza + '</td>'
	      			+	'<td class="row-status"><span class="aplica-interfaz ' + (this.AplicaInterfaz == 1 ? 'active' : 'inactive') + '"></span></td>'
	      			+	'<td class="row-status"><span class="aplica-factura ' + (this.AplicaFacturacion == 1 ? 'active' : 'inactive') + '"></span></td>'
	      			+	'<td class="row-status"><span class="aplica-imss ' + (this.AplicaIMSS == 1 ? 'active' : 'inactive') + '"></span></td>'
	      			+	'<td class="row-status"><span class="aplica-estatal ' + (this.AplicaEstatal == 1 ? 'active' : 'inactive') + '"></span></td>'
	      			+ '</tr>'
      				)
      				.data({'idProyecto': _proyecto.idProyecto, 'idConcepto': this.idConcepto})
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
				LIGHTBOX.title = 'Nuevo Concepto para -' + _tgt.parents('ul').prev().text() + '-';
				LIGHTBOX.content = '<form id="form-concepto">'
				+ '<div><label for="conceptos-nomina">Concepto de Nomina</label><select id="conceptos-nomina"></select></div>'
				+ '<div><label for="nombre-concepto">Nombre de Concepto</label><input id="nombre-concepto" class="inputtext required" type="text" maxlength="50" /></div>'
				+ '<div><label for="naturalezas-concepto">Naturaleza</label><select id="naturalezas-concepto"></select></div>'
				+ '<div><label for="aplica-interfaz">Aplica Interfaz</label><input id="aplica-interfaz" type="checkbox" value="1" /></div>'
				+ '<div><label for="aplica-facturacion">Aplica Facturaci&oacute;n</label><input id="aplica-facturacion" type="checkbox" value="1" /></div>'
				+ '<div><label for="aplica-imss">Aplica Imp. Seg. Social</label><input id="aplica-imss" type="checkbox" value="1" /></div>'
				+ '<div><label for="aplica-estatal">Aplica Imp. Estatal</label><input id="aplica-estatal" type="checkbox" value="1" /></div>'
				+ '<div class="form-buttons"><input type="button" class="button aceptar" value="Aceptar" /><input type="button" class="button cancelar" value="Cancelar" /></div>'
				+ '</form>';
				
				LIGHTBOX.show();
				
				$('#form-concepto .form-buttons')
				.click(function(event)
				{
					var _tgt = $(event.target);
					
					if(_tgt.is('.aceptar'))
					{
						if($.trim($('input#nombre-concepto').val()).length < 1)
						{
							messageConsole.displayMessage('Debe escribir un nombre para el concepto.', 'error');
							$('input#nombre-concepto').focus();
							return false;
						}
						
						var _idConceptoNomina = $('select#conceptos-nomina').val();
						var _nombreConcepto = $('input#nombre-concepto').val();
						var _naturaleza = $('select#naturalezas-concepto').val();
						var _aplicaInterfaz = $('input#aplica-interfaz').is(':checked') ? 1 : 0;
						var _aplicaFacturacion = $('input#aplica-facturacion').is(':checked') ? 1 : 0;
						var _aplicaIMSS = $('input#aplica-imss').is(':checked') ? 1 : 0;
						var _aplicaEstatal = $('input#aplica-estatal').is(':checked') ? 1 : 0;
						
						$.ajax({
							type: 'POST',
							url: 'modulos/conceptos/AgregaConcepto.php',
							data: {p: _idProyecto
								 , c: _idConceptoNomina
								 , n: _nombreConcepto
								 , nt: _naturaleza
								 , ai: _aplicaInterfaz
								 , af: _aplicaFacturacion
								 , am: _aplicaIMSS
								 , ae: _aplicaEstatal
							 },
							 dataType: 'json'
							 
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
						 	 	} catch(e){
						 	 		messageConsole.displayMessage('Error: ' + e.message, 'error');
									return false;
						 	 	}

					 	 		$('<tr>'
								+	'<td class="row-selector"><span class="unchecked"></span></td>'
				      			+	'<td>' + _nombreConcepto + '</td>'
				      			+	'<td>' + $('select#naturalezas-concepto :selected').text() + '</td>'
				      			+	'<td class="row-status"><span class="aplica-interfaz ' + (_aplicaInterfaz == 1 ? 'active' : 'inactive') + '"></span></td>'
				      			+	'<td class="row-status"><span class="aplica-factura ' + (_aplicaFacturacion == 1 ? 'active' : 'inactive') + '"></span></td>'
				      			+	'<td class="row-status"><span class="aplica-imss ' + (_aplicaIMSS == 1 ? 'active' : 'inactive') + '"></span></td>'
				      			+	'<td class="row-status"><span class="aplica-estatal ' + (_aplicaEstatal == 1 ? 'active' : 'inactive') + '"></span></td>'
				      			+ '</tr>'
			      				)
			      				.data({'idProyecto': _idProyecto, 'idConcepto': _idConceptoNomina})
			      				.appendTo(_table);
			      				
			      				LIGHTBOX.hide();
			      				
								messageConsole.displayMessage('Se agreg&oacute; correctamente el concepto.', 'success');
								$('tbody tr:nth-child(odd)').addClass('zebra');
					 	 	 },
					 	 	 complete: function()
					 	 	 {
					 	 	 	_tgt.siblings().andSelf().removeAttr('disabled').removeClass('disabled');
					 	 	 }
						});
					}
					else if(_tgt.is('.cancelar'))
					{
						LIGHTBOX.hide();
					}
					
					event.preventDefault();
				});
				
				$.ajax({
					type: 'POST',
					url: 'modulos/conceptos/GetConceptosNomina.php',
					data: {p: _tgt.parents('.block').attr('id')},
					dataType: 'json',
					
					beforeSend: function()
					{
						$('select.#conceptos-nomina')
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
						} catch(e){
							messageConsole.displayMessage('Error: ' + e.message, 'error');
							return false;
						}

						var _conceptos = null;

						$.each(json.Conceptos, function()
						{
							_conceptos += '<optgroup label="' + this.TipoConcepto+ '">';
							
							$.each(this.Conceptos, function()
							{
								_conceptos += '<option value="' + this.idConcepto+ '">' + this.Concepto + '</option>';
							});
							
							_conceptos += '</optgroup>';
						});
						
						$('select.#conceptos-nomina').append(_conceptos).removeAttr('disabled');
						
						$('select.#conceptos-nomina')
						.change(function(){
							$('#nombre-concepto').val($(this).find('option:selected').text());
						});
					},
					complete: function()
					{
						$('select.#conceptos-nomina').children('#load-option').remove();
						$('#nombre-concepto').val($('select.#conceptos-nomina option:selected').text());
					}
				});
				
				$.ajax({
					type: 'POST',
					url: 'modulos/conceptos/GetNaturalezasConcepto.php',
					dataType: 'json'
					
					beforeSend: function()
					{
						$('select.#naturalezas-concepto')
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
						} catch(e){
							messageConsole.displayMessage('Error: ' + e.message, 'error');
							return false;
						}
						
						var _naturalezas = null;
						
						$.each(json.Naturalezas, function()
						{
							_naturalezas += '<option value="' + this.idNaturaleza + '">' + this.Naturaleza + '</option>';
						});
						
						$('select.#naturalezas-concepto').append(_naturalezas).removeAttr('disabled');
					},
					complete: function()
					{
						$('select.#naturalezas-concepto').children('#load-option').remove();
					}
				});
			} else if ( _tgt.is('.elimina-concepto') ) {

				var _items = parseInt($(this).find('.items').text());
				var _itemCounter = $(this).find('.items');
				
				if(_items < 1)
				{
					messageConsole.displayMessage('Debe seleccionar al menos un concepto para realizar esta operacion.', 'error');
					return false;
				}
				
				if(confirm(_items + ' conceptos seran eliminados\nContinuar?'))
				{
					$.each($(this).next().find('tr.selected'), function()
					{
						_item = this;
						
						/* PETICION PARA ELIMINAR EL CONCEPTO*/
						$.ajax({
							type: 'POST',
							url: 'modulos/conceptos/EliminaConcepto.php',
							data: {p: $(_item).data('idProyecto'), c: $(_item).data('idConcepto')},
							dataType: 'json',
							async: false, // PETICION SINCRONA PARA NO PERDER LA REFERENCIA DE CADA ITEM
							
							success: function(json) {
								try{
									if(!json.success)
									{
										messageConsole.displayMessage(json.errorMessage, 'error');
										return false;
									}
								} catch(e){
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

	$('.block-content').live('click', function(event) {

			var _tgt = $(event.target);

			if(_tgt.is('span') && _tgt.parent().is('.row-selector')) {

		    	_tgt
		    		.toggleClass('checked unchecked')
		    		.parents('tr')
		    		.toggleClass('selected');

		    	$(this)
		    		.prev()
		    		.find('.items')
		    		.text($(this).find('tr.selected').size());

	    	} else if(_tgt.is('span') && _tgt.parent().is('.row-status')) {

	    		var _idTipoAplica = null;
	    		
	    		if(_tgt.hasClass('aplica-interfaz'))
	    			_idTipoAplica = 1;
	    		if(_tgt.hasClass('aplica-factura'))
	    			_idTipoAplica = 2;
	    		if(_tgt.hasClass('aplica-imss'))
	    			_idTipoAplica = 3;
	    		if(_tgt.hasClass('aplica-estatal'))
	    			_idTipoAplica = 4;

	    		//console.log(_tgt.parents('tr').data('idProyecto') + ' - ' + _tgt.parents('tr').data('idConcepto') + ' - ' + _idTipoAplica);

	    		/*
				 * MANEJA LOS CAMBIOS DE LOS ESTATUS DE LAS APLICACIONES
				 * DE CADA CONCEPTO
				*/
	    		$.ajax({
	    			type: 'POST',
	    			url: 'modulos/conceptos/SetAplicaConcepto.php',
	    			data: {p: _tgt.parents('tr').data('idProyecto'), c: _tgt.parents('tr').data('idConcepto'), a: _idTipoAplica},
	    			dataType: 'json',
	    			
	    			success: function(json) {
	    				try {
		    				if ( ! json.success ) {
		    					messageConsole.displayMessage(json.errorMessage, 'error');
		    					return false;
		    				}
	    				} catch(e) {
	    					messageConsole.displayMessage('Error: ' + e.message, 'error');
							return false;
	    				}
	    				
	    				var _aplicaTargets = '';
	    				var _classSwitch = 'active';
	    				
	    				switch( _idTipoAplica ) {
	    					
	    					case 1: {
	    						_classSwitch = 'inactive';
	    						break;
	    					}
	    					case 2: {
	    						_tgt.parent()
	    						.siblings('.row-status')
	    						.children('.aplica-interfaz')
	    						.removeClass('active inactive')
	    						.addClass('active');
	    						
								_aplicaTargets = '.aplica-imss, .aplica-estatal';
								_classSwitch = 'inactive';
	    						break;
    						}
    						default:{
    							_aplicaTargets = '.aplica-nomina, .aplica-factura'
    							_classSwitch = 'active';
							}
	    				}

	    				_tgt
	    				.toggleClass('active inactive')
	    				.parent()
						.siblings('.row-status')
						.children(_aplicaTargets)
						.removeClass('active inactive')
						.addClass(_classSwitch);
	    			}
	    		});
	    	}
	});
});