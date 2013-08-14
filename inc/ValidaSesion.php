<?php
session_start();

if(!isset($_SESSION['usr']))
{
	header('Location:login.html');
}
?>