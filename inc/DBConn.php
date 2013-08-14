<?php
function modulosSAO()
{
	$Server = "192.168.103.8";
	
	sqlsrv_configure("WarningsReturnAsErrors", 0);
	
	$ConnectionInfo = array( "UID" => "App_InterfazNominas",
							 "PWD" => "@insApp85%",
							 "Database" => "ModulosSao",
							 "APP" => "InterfazNominas",
							 "ReturnDatesAsStrings" => "1",
							 "CharacterSet" => "UTF-8"
	);
	
	$conn = sqlsrv_connect($Server, $ConnectionInfo);
	
	if($conn === false)
		return false;
	else
		return $conn;
}

function getErrorMessage()
{
	$errors = sqlsrv_errors(SQLSRV_ERR_ERRORS);
	
	return $errMessage = ($errors[0]['code'] < 50000 ? $errors[0]['code'].' - ' : '').htmlentities(substr($errors[0]['message'], 54, -1));
}
?>