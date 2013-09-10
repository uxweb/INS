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
	
	$tsql = "{call [InterfazNominas].[uspRegistraAlmacen](?, ?, ?, ?, ?)}";
	
	$params = array($_POST['p'], $_POST['n'], $_POST['tc'], $_POST['as'], $_POST['cc']);
	
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
	
	if( sqlsrv_fetch($stmt) === false)
	{
	    $data['success'] = false;
	    $data['errorMessage'] = getErrorMessage();
	    echo json_encode($data);
		return;
	}
	
	$data['idAlmacen'] = sqlsrv_get_field($stmt, 0);
	
	sqlsrv_free_stmt($stmt);
	sqlsrv_close($conn);
	
	echo json_encode($data);
}
?>