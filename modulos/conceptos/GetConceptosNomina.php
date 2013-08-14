<?php
require_once("../../inc/DBConn.php");

	$data['success'] = 0;
	$data['errorMessage'] = null;
	
	$conn = modulosSAO();
	
	if(!$conn) {
		$data['success'] = 0;
		$data['errorMessage'] = 'No se pudo establecer una conexion con el servidor de Base de Datos';
		
		echo json_encode($data);
		return;
	}
	
	$tsql = "{call [InterfazNominasSao].[uspListaConceptosNomina](?, ?, ?, ?, ?)}";
	
	$params = array($_POST['p'], 1, 1, 1, 1);
	
	$stmt = sqlsrv_query($conn, $tsql, $params);
	
	if(!$stmt) {
		$data['success'] = 0;
		$data['errorMessage'] = getErrorMessage();

		echo json_encode($data);
		return;
	}
	else
	{
		$data['success'] = 1;
	}
	
	$UltimoTipo = null;
	$counter = 0;
	while($conceptos = sqlsrv_fetch_object($stmt))
	{
		if($UltimoTipo !== $conceptos->TipoConcepto)
		{
			$UltimoTipo = $conceptos->TipoConcepto;

			$data['Conceptos'][] = array('TipoConcepto' => $conceptos->TipoConcepto,
										 'Conceptos' => array()
										);
			
			if(count($data['Conceptos']) > 1)
				$counter++;
		}
		
		$data['Conceptos'][$counter]['Conceptos'][] = array('idConcepto' => $conceptos->idConcepto,
															 'Concepto' => $conceptos->Concepto,
														   );
	}
	
	sqlsrv_free_stmt($stmt);
	sqlsrv_close($conn);
	
	echo json_encode($data);
?>