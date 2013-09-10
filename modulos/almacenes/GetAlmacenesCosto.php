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

$tsql = "{call [InterfazNominas].[uspAlmacenesCosto]( ? )}";

$params = array( array($_SESSION['usr'], SQLSRV_PARAM_IN, null, SQLSRV_SQLTYPE_VARCHAR(50)) );

$stmt = sqlsrv_query($conn, $tsql, $params);

if(!$stmt) {
	$data['success'] = 0;
	$data['errorMessage'] = getErrorMessage();

	echo json_encode($data);
	return;
}
else
	$data['success'] = 1;

$UltimoProyecto = null;
$counter = 0;

while( $almacenes = sqlsrv_fetch_object($stmt) ) {
	
	if( $UltimoProyecto !== $almacenes->IDProyecto ) {
		
		$UltimoProyecto = $almacenes->IDProyecto;

		$data['Proyectos'][] =
			array(
				'IDProyecto' => $almacenes->IDProyecto,
				'Proyecto'   => $almacenes->Proyecto,
				'Almacenes'  => array()
			);
		
		//if( count($data['Proyectos']) > 1 )
		$counter++;
	}
	
	if( $almacenes->IDAlmacen !== null ) {
		
		$data['Proyectos'][$counter - 1]['Almacenes'][] =
			array(
				'IDAlmacen' 	   => $almacenes->IDAlmacen,
				'Nombre' 		   => $almacenes->Nombre,
				'TipoCosto' 	   => $almacenes->TipoCosto,
				'NombreAlmacenSAO' => $almacenes->NombreAlmacenSAO,
				'CuentaContable'   => $almacenes->CuentaContable,
				'EstaActivo' 	   => $almacenes->EstaActivo
			);
	}
}

if( $counter === 0 ) {
	$data['noRows'] = 1;
	$data['noRowsMessage'] = 'No se encontraron datos.';
}
sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);

echo json_encode($data);
?>