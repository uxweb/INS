<?php require_once("inc/ValidaSesion.php"); ?>
<!DOCTYPE html>
<head>
  <meta charset="utf-8">

  <title>Interfaz Nominas - SAO</title>
  <link rel="stylesheet" href="css/normalize.css" />
  <link rel="stylesheet" href="css/general.css" />
  <!--[if lt IE 9]><script src="js/html5shiv.js"></script><![endif]-->
  <script src="js/jquery-1.6.4.min.js"></script>
  <script src="js/general.js"></script>
  <script src="js/opciones_seleccion.js"></script>
  <script src="js/listaAsistencia.js"></script>
</head>

<body>
  <div id="site-wrapper">
    <?php require_once 'inc/app_header.php'; ?>
    <?php require_once 'inc/app_nav.php'; ?>

    <div id="main">
      <div id="content">
	    <div id="module">
          <!-- <div id="module-title">-> Lanzamiento.</div> -->
          <div id="module-content">
          	<div id="seleccion-prenomina" class="options-block">
          		<div id="proyectos" class="selector-block">
          			<h3 class="selector-title">Proyecto</h3>
          			<div class="selector-content">
          				
          			</div>
          		</div>
          		<div id="prenominas" class="selector-block">
          			<h3 class="selector-title">Prenóminas</h3>
          			<div class="selector-content">
      					<div class="overlay"></div>
          			</div>
          		</div>
          		<div id="opciones" class="selector-block">
          			<h3 class="selector-title">Opciones</h3>
          			<div class="selector-content">
          				<form id="form-opciones">
          					<div>
          						<label for="recalcula">Recalcular</label>
          						<input type="checkbox" id="recalcula" disabled="disabled" value="1" />
          					</div>
          					<div class="form-buttons">
          						<input type="button" id="borra-listas" class="button borrar disabled" disabled="disabled" value="Borrar" />
          						<input type="button" id="genera-listas" class="button aceptar disabled" disabled="disabled" value="Generar L.A." />
          						<input type="button" id="consulta-listas" class="button consultar disabled" disabled="disabled" value="Consultar" />
          						<input type="button" id="envia-listas" class="button enviar disabled" disabled="disabled" value="Enviar a SAO" />
          					</div>
          				</form>
          			</div>
          		</div>
          	</div>

          	<div id="lista_asistencia"></div>
          </div>
          <div style="clear: both;">
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