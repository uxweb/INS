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

$tsql = "{call [InterfazNominas].[uspManejaClaveTrabajadores](?, ?)}";

$params = array($_POST['p'], $_POST['c']);

$stmt = sqlsrv_query($conn, $tsql, $params);

if(!$stmt)
{
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
?>