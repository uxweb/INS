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

$tsql = "{call [InterfazNominasSao].[uspDiasNomina](?)}";

$params = array($_POST['in']);

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

$diasPeriodo = array();

$counter = 0;
while($dia = sqlsrv_fetch_object($stmt))
{
	$diasPeriodo[] = array('Dia' => $dia->Dia, 'Fecha' => $dia->Fecha);
	
	++$counter;
}

$data['DiasPeriodo']['Cantidad'] = $counter;
$data['DiasPeriodo']['Dias'] = $diasPeriodo;


$tsql = "{call [InterfazNominasSao].[uspAsistenciaEmpelados](?)}";
$params = array($_POST['in']);
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

$data['Empleados'] = array();
$ultimoEmpleado = null;
$counter = 0;

while($asistencia = sqlsrv_fetch_object($stmt))
{
	if($ultimoEmpleado !== $asistencia->idEmpleadoNOM)
	{
		++$counter;
		$ultimoEmpleado = $asistencia->idEmpleadoNOM;
		$data['Empleados'][] = array( 'idEmpleadoNom' => $asistencia->idEmpleadoNOM
									, 'CodigoEmpleado' => $asistencia->CodigoEmpleado
									, 'Nombre' => $asistencia->NombreNOM
									, 'AlmacenDestino' => $asistencia->AlmacenDestino
									, 'Asistencia' => array()
									);
	}
	
	$data['Empleados'][$counter-1]['Asistencia'][] = array( 'Dia' => $asistencia->Fecha
														  , 'Asistio' => $asistencia->Asistencia
														  , 'Cantidad' => $asistencia->Cantidad
														  );
}

sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);

echo json_encode($data);
?>