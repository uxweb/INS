<?php
session_start();

require_once("../../inc/DBConn.php");

$data['success'] = 0;
$data['errorMessage'] = null;
$data['noRows'] = 0;
$data['noRowsMessage'] = null;

$conn = modulosSAO();

if(!$conn) {
	$data['success'] = 0;
	$data['errorMessage'] = 'No se pudo establecer una conexion con el servidor de Base de Datos';
	
	echo json_encode($data);
	return;
}

$tsql = "{call [InterfazNominas].[uspClavesTrabajadoresProyecto]( ? )}";

$params = array( array($_SESSION['usr'], SQLSRV_PARAM_IN, null, SQLSRV_SQLTYPE_VARCHAR(50)) );

$stmt = sqlsrv_query($conn, $tsql, $params);

if( ! $stmt) {
	$data['success'] = 0;
	$data['errorMessage'] = getErrorMessage();

	echo json_encode($data);
	return;
}
else
	$data['success'] = 1;

$counter = 0;

while($claves = sqlsrv_fetch_object($stmt)) {
	
	$data['Claves'][] =
		array(
			'IDProyecto' => $claves->IDProyecto,
			'Proyecto' => $claves->Proyecto,
			'Clave' => $claves->Clave
		);

	++$counter;
}

if( $counter === 0 ) {
	$data['noRows'] = 1;
	$data['noRowsMessage'] = 'No se encontraron datos.';
}

sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);

echo json_encode($data);
?>