<?php
session_start();

require_once("DBConn.php");

if($_POST)
{
	$data['success'] = 0;
	$data['errorMessage'] = null;
	
	$conn = modulosSAO();
	
	if(!$conn) {
		$data['success'] = 0;
		$data['errorMessage'] = 'No se pudo establecer una conexion con el servidor de Base de Datos';
		
		echo json_encode($data);
		return;
	}
	
	$tsql = "{call [Seguridad].[uspValidausuario](?, ?, ?)}";
	
	$params = array($_POST['usr'], $_POST['pwd'], 2);
	
	$stmt = sqlsrv_query($conn, $tsql, $params);
	
	if(!$stmt) {
		$data['success'] = 0;
		$data['errorMessage'] = getErrorMessage();
		
		session_destroy();
		echo json_encode($data);
		return;
	}
	else
	{
		$data['success'] = 1;
		$_SESSION['usr'] = $_POST['usr'];
		//$_SESSION['nombre'] = 'Uziel Bueno';
		
		$data['sess'] = array( 'usr' => $_SESSION['usr']
							 , 'nombre' => $_SESSION['nombre']
							 );
	}
	
	sqlsrv_close($conn);
	
	echo json_encode($data);
}
?>