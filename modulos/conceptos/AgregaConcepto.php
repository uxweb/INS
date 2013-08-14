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
	
	$tsql = "{call [InterfazNominasSao].[uspAgregaConceptoCalculo](?, ?, ?, ?, ?, ?, ?, ?)}";
	
	$params = array($_POST['p'], $_POST['c'], $_POST['nt'], $_POST['n'], $_POST['ai'], $_POST['af'], $_POST['am'], $_POST['ae']);
	
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