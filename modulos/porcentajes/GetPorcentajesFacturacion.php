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

$tsql = "{call [InterfazNominas].[uspPorcentajesFacturacion]( ? )}";

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

while( $conceptos = sqlsrv_fetch_object($stmt) ) {
	
	if( $UltimoProyecto !== $conceptos->IDProyecto ) {
		$UltimoProyecto = $conceptos->IDProyecto;

		$data['Proyectos'][] =
			array(
				'IDProyecto'  => $conceptos->IDProyecto,
				'Proyecto'    => $conceptos->Proyecto,
				'Porcentajes' => array()
			);
		
		//if( count($data['Proyectos']) > 1 )
		$counter++;
	}
	if( $conceptos->Vigencia !== null ) {
		
		$data['Proyectos'][$counter - 1]['Porcentajes'][] =
			array(
				'IDPorcentaje'    => $conceptos->IDPorcentaje,
				'Vigencia' 	      => $conceptos->Vigencia,
				'IMSS' 		   	  => $conceptos->IMSS,
				'ImpuestoEstatal' => $conceptos->ImpuestoEstatal,
				'Administracion'  => $conceptos->Administracion,
				'IVA' 			  => $conceptos->IVA
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