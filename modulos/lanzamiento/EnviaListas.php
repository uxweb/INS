<?php
require_once("../../inc/DBConn.php");

if($_POST) {
	
	$data['success'] = 0;
	$data['errorMessage'] = null;
	
	$conn = modulosSAO();
	
	if(!$conn) {
		$data['success'] = 0;
		$data['errorMessage'] = 'No se pudo establecer una conexion con el servidor de Base de Datos';
		
		echo json_encode($data);
		return;
	}
	
	$tsql = "{call [InterfazNominas].[uspEnviaListasAsistenciaSAO](?, ?)}";
	
	$params = array(  array(null, SQLSRV_PARAM_IN),
					  array($_POST['idNom'], SQLSRV_PARAM_IN)
				   );
	
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
	
	sqlsrv_close($conn);
	echo json_encode($data);
}
?>