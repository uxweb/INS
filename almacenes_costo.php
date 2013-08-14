<?php require_once("inc/ValidaSesion.php"); ?>
<!DOCTYPE html>
<html lang="es-mx">
<head>
  <meta charset="utf-8" />

  <title>Interfaz Nominas - SAO</title>
  <link rel="stylesheet" href="css/normalize.css" />
  <link rel="stylesheet" href="css/general.css" />
  <!--[if lt IE 9]><script src="js/html5shiv.js"></script><![endif]-->
  <script src="js/jquery-1.6.4.min.js"></script>
  <script src="js/general.js"></script>
  <script src="js/almacenesCosto.js"></script>
</head>

<body>
  <div id="site-wrapper">
    <?php require_once 'inc/app_header.php'; ?>
    <?php require_once 'inc/app_nav.php'; ?>
    
    <div id="main">
      <div id="content">
	    <div id="module">
          <!-- <div id="module-title">-> Almacenes de costo para trabajadores.</div> -->
          <div id="module-content"></div>
        </div>
        <!-- module -->
      </div>
      <!-- content -->
    </div>
    <!-- main -->
  </div>
  <!-- site-wrapper -->
  <div id="message-console"><span id="console-message"></span><span id="console-toggler" class="open"></span></div>
</body>
</html>