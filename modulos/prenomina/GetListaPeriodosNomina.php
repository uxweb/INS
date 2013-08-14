<?php
if($_POST)
{
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

	$tsql = "{call [InterfazNominasSao].[uspListaPeriodosNomina](?)}";
	
	$params = array($_POST['p']);
	
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
	
	$UltimoAnio = null;
	$UltimoMes = null;
	$counterAnio = 0;
	$counterMes = 0;
	
	while($periodos = sqlsrv_fetch_object($stmt))
	{
		if($UltimoAnio !== $periodos->Anio)
		{
			$UltimoAnio = $periodos->Anio;
	
			$data['PerNomina'][] = array('Anio' => $periodos->Anio,
										 'Meses' => array(),
										);
			
			++$counterAnio;
			$counterMes = 0;
			$UltimoMes = 0;
		}
		
		if($UltimoMes !== $periodos->Mes)
		{
			$UltimoMes = $periodos->Mes;
	
			$data['PerNomina'][$counterAnio-1]['Meses'][] = array('Mes' => $periodos->Mes, 'Periodos' => array());
			
			++$counterMes;
		}
	
		$data['PerNomina'][$counterAnio-1]['Meses'][$counterMes-1]['Periodos'][] = array('idPeriodo' => $periodos->idPeriodo
																					   , 'Periodo' => $periodos->Periodo
																					   , 'idEstatus' => $periodos->idEstatus
																					   , 'Estatus' => $periodos->Estatus
																					   , 'idNomina' => $periodos->idNomina);
	}
	
	sqlsrv_free_stmt($stmt);
	sqlsrv_close($conn);
	
	echo json_encode($data);
}
?>