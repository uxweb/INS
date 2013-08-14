$(function() {
	
	// CARGA LA CLAVE PARA LOS TRABAJADORES DEL PROYECTO
	var claveProyecto =
	{
		container: '#claves tbody',
		getURL: 'modulos/claves/GetClavesProyectos.php',
		setURL: 'modulos/claves/SetClaveProyecto.php',
		
		cargaClaves: function()
		{
			_cp = this;
			
			$.ajax({
				type: 'GET',
				url: this.getURL,
				data: {},
				dataType: 'json',
				cache: false,
				timeout: 10000,
				
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
					
					$.each(json.Claves, function() {
						$('<tr><th>' + this.Proyecto + '</th><td class="editable"><input type="text" class="inputtext" value="' + this.Clave + '" /></td><td class="editable"><input type="button" class="button aceptar" value="Guardar"/></td></tr>')
						.find(':button')
						.data('idProyecto', this.idProyecto)
						.end()
						.appendTo(_cp.container);
					});
					
					$('tr:even').addClass('zebra');
					
					$(_cp.container).bind('click', function(event)
					{
						var _tgt = $(event.target);
						
						var _clave = _tgt.parent().prev().find('input').val();
						
						if(_tgt.is('.button'))
						{
							$.ajax({
								type: 'POST',
								url: _cp.setURL,
								data: {p: _tgt.data('idProyecto'), c: _clave},
								dataType: 'json',
								cache: false,
								timeout: 10000,
								
								success: function(json)
								{
									try{
										if(!json.success)
										{
											messageConsole.displayMessage(json.errorMessage, 'error');
											return false;
										}
										
										messageConsole.displayMessage('El codigo se guardó correctamente.', 'success');
									} catch(e){
										messageConsole.displayMessage('Error: ' + e.message, 'error');
										return false;
									}
								}
							});
						}
					});
				}
			});
		}
	};
	
	claveProyecto.cargaClaves();
});