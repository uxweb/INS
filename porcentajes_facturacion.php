<?php
require_once("inc/ValidaSesion.php");
?>
<!DOCTYPE html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE-Edge">

  <title>Interfaz Nominas - SAO</title>
  <link rel="stylesheet" href="css/normalize.css" />
  <link rel="stylesheet" href="css/general.css" />
  <!--[if lt IE 9]><script src="js/html5shiv.js"></script><![endif]-->
  <link rel="stylesheet" href="js/jquery-ui/css/south-street/jquery-ui-1.8.10.custom.css" />
  <script src="js/jquery-1.6.4.min.js"></script>
  <script src="js/jquery-ui/development-bundle/ui/jquery-ui-1.8.10.custom.js"></script>
  <script src="js/jquery-ui/development-bundle/ui/minified/jquery.ui.core.min.js"></script>
  <script src="js/jquery-ui/development-bundle/ui/minified/jquery.ui.datepicker.min.js"></script>
  <script src="js/jquery-ui/development-bundle/ui/i18n/jquery.ui.datepicker-es.js"></script>
  <script src="js/general.js"></script>
  <script src="js/porcentajesFacturacion.js"></script>
</head>

<body>
  <div id="site-wrapper">
    <?php require_once 'inc/app_header.php'; ?>
    <?php require_once 'inc/app_nav.php'; ?>
    
    <div id="main">
      <div id="content">
	    <div id="module">
          <!-- <div id="module-title">-> Porcentajes de Facturación de la Nómina.</div> -->
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