<?php
require_once("inc/ValidaSesion.php");
?>
<!DOCTYPE html>
<head>
  <meta charset="utf-8">

  <title>Interfaz Nominas - SAO</title>
  <link rel="stylesheet" href="css/normalize.css" />
  <link rel="stylesheet" href="css/general.css" />
  <!--[if lt IE 9]><script src="js/html5shiv.js"></script><![endif]-->
  <script src="js/jquery-1.6.4.min.js"></script>
  <script src="js/general.js"></script>
  <script src="js/clavesTrabajadores.js"></script>
</head>

<body>
  <div id="site-wrapper">
    <?php require_once 'inc/app_header.php'; ?>
    <?php require_once 'inc/app_nav.php'; ?>

    <div id="main">
      <div id="content">
	    <div id="module">
          <!-- <div id="module-title">-> Clave de Proyecto para registro automatico de trabajadores</div> -->
          <div id="module-content">
            <table id="claves">
            	<thead>
            		<tr>
            			<th>Proyecto</th>
            			<th>Clave</th>
            			<th>&nbsp;</th>
            		</tr>
            	</thead>
            	<tbody>
            	</tbody>
            </table>
          </div>
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