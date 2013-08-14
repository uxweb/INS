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

$tsql = "{call [InterfazNominasSao].[uspListaAlmacenesSAO](?)}";

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

while($almacenes = sqlsrv_fetch_object($stmt))
{
	$data['AlmacenesSAO'][] = array( 'idAlmacen' => $almacenes->idAlmacen,
								     'Almacen' => $almacenes->Almacen
								   );
}

sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);

echo json_encode($data);
?>