<?php
if( isset($_GET['in']) ) {
	require_once("../../inc/DBConn.php");
	
	$data['success'] = 0;
	$data['errorMessage'] = null;
	
	$conn = modulosSAO();
	
	if( !$conn ) {
		$data['success'] = 0;
		$data['errorMessage'] = 'No se pudo establecer una conexion con el servidor de Base de Datos';
		
		echo json_encode($data);
		return;
	}
	
	$tsql = "{call [InterfazNominas].[uspPrenomina](?)}";
	
	$params = array($_GET['in']);
	
	$stmt = sqlsrv_query($conn, $tsql, $params);
	
	if( !$stmt ) {
		$data['success'] = 0;
		$data['errorMessage'] = getErrorMessage();
	
		echo json_encode($data);
		return;
	}
	else
		$data['success'] = 1;
	
	$data['Total'] = 0;
	$data['TotalPorDistribuir'] = 0;
	$counter = 0;
	
	while( $prenom = sqlsrv_fetch_object($stmt) )
	{
		$data['Total'] += $prenom->ImporteTotalJornales;
		$data['TotalPorDistribuir'] += $prenom->PorDistribuir;
		
		$data['Empleados'][] =
			array(
				  'IDEmpleado'		  => $prenom->IDEmpleadoNOM
				, 'CodigoEmpleado'    => $prenom->CodigoEmpleado
				, 'NombreEmpleadoNOM' => $prenom->NombreNOM
				, 'FechaAltaNOM' 	  => $prenom->FechaAltaNOM
				, 'FechaBajaNOM' 	  => $prenom->FechaBajaNOM
				, 'NSSNOM' 		   	  => $prenom->NSSNOM
				, 'RFCNOM' 		      => $prenom->RFCNOM
				, 'CategoriaNOM' 	  => $prenom->CategoriaNOM
				, 'ValorJornalNOM'    => $prenom->ValorJornalNOM
				, 'NombreEmpleadoSAO' => $prenom->NombreSAO
				, 'NSSSAO' 		   	  => $prenom->NSSSAO
				, 'RFCSAO' 		      => $prenom->RFCSAO
				, 'CategoriaSAO' 	  => $prenom->CategoriaSAO
				, 'ImporteTotal' 	  => $prenom->ImporteTotal
				, 'PorDistribuir' 	  => $prenom->PorDistribuir
				, 'Inconsistencias'   => array()
			);
	
		$inconsistencias = array();
		
		if( $prenom->ExistenciaSAO == 0 ) {
			
			$inconsistencias[] = array( 'Tipo' => "Existencia en SAO",
			    						'Causa' => "No se encontro en SAO, Esta Inhabilitado, No tiene obra asignada o NSS diferente.");
			
			if( $prenom->TieneNSS == 0 )
				$inconsistencias[] = array( 'Tipo' => "Numero de Seguro Social",
											'Causa' => "No tiene numero asignado en NOMINA.");
		} else {
			
			// Si el numero no es igual(entre 1-3)
			if( $prenom->IgualdadNSS < 4 )
				$inconsistencias[] = array( 'Tipo' => "Numero de Seguro Social",
											'Causa' => "No son iguales",
											'Datos' => array('Nomina' => $prenom->NSSNOM,
															 'SAO' => $prenom->NSSSAO
															)
										  );
										  
			// Si no tiene clave de proyecto
			if( $prenom->TieneClaveProyecto == 0 )
				$inconsistencias[] = array( 'Tipo' => "Clave de Proyecto",
											'Causa' => "No tiene clave de proyecto asignado en NOMINA.");
			
			// Si se encontraro mas de 1 trabajador en sao por uno de nominas
			if( $prenom->EstaDuplicado == 1 )
				$inconsistencias[] = array( 'Tipo' => "Esta duplicado",
											'Causa' => "El empleado se encontro mas de una ves con el mismo NSS en SAO.",
											'Datos' => array('Nomina' => $prenom->NombreNOM,
															 'SAO' => $prenom->NombreSAO
															)
										  );
			
			// Si la categoria entre el sao y nominas no es igual
			if( $prenom->IgualdadCategoria  < 4 )
				$inconsistencias[] = array( 'Tipo' => "Categoria",
											'Causa' => "No son iguales",
											'Datos' => array('Nomina' => $prenom->CategoriaNOM,
															 'SAO' => $prenom->CategoriaSAO
															)
										  );
										  
			// Si el valor jornal de las categorias es diferente
			if( $prenom->IgualdadValorJornal  == 0 ) {
				$inconsistencias[] = array( 'Tipo' => "Valor de Jornal",
											'Causa' => "La categoria no tiene un valor de jornal en SAO"
										  );
			} else {
				// Si el valor jornal es parecido
				if( $prenom->IgualdadValorJornal  < 4 )
					$inconsistencias[] = array( 'Tipo' => "Valor de Jornal",
												'Causa' => "No son iguales",
												'Datos' => array('Nomina' => $prenom->ValorJornalNOM,
																 'SAO' => $prenom->ValorJornalSAO
																)
											  );
			}
		}

		if( count($inconsistencias) > 0 )
			$data['Empleados'][$counter]['Inconsistencias'] = $inconsistencias;
		
		++$counter;
	}
	
	$data['TotalFormat'] = number_format($data['Total'], 2, '.', ',');
	$data['TotalPorDistribuirFormat'] = number_format($data['TotalPorDistribuir'], 2, '.', ',');
	
	sqlsrv_free_stmt($stmt);
	sqlsrv_close($conn);
	
	echo json_encode($data);
}
?>