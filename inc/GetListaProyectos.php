<?php
session_start();

require_once("../inc/DBConn.php");
	
$data['success'] = 0;
$data['errorMessage'] = null;

$conn = modulosSAO();

if(!$conn) {
	$data['success'] = 0;
	$data['errorMessage'] = 'No se pudo establecer una conexion con el servidor de Base de Datos';
	
	echo json_encode($data);
	return;
}

$tsql = "{call [Seguridad].[uspProyectosUsuario](?, ?)}";

$params = array($_SESSION['usr'], 2);

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

while($proyecto = sqlsrv_fetch_object($stmt))
{
	$data['Proyectos'][] = array('idProyecto'=>$proyecto->idProyecto, 'Nombre'=>$proyecto->NombreProyecto);
}


sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);

echo json_encode($data);
?>