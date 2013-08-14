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

$tsql = "SELECT
		   [idTipoCosto]
		 , [TipoCosto]
		 FROM [InterfazNominasSao].[TiposCosto]";

$stmt = sqlsrv_query($conn, $tsql);

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

while($tiposcosto = sqlsrv_fetch_object($stmt))
{
	$data['TiposCosto'][] = array( 'idTipoCosto' => $tiposcosto->idTipoCosto,
								   'TipoCosto' => $tiposcosto->TipoCosto
								 );
}

sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);

echo json_encode($data);
?>