<?php /* this file extension must be 'php' to force browser always load without caching */ ?>
<!DOCTYPE html>
<html>
	<head>
		<title>DEMO&nbsp;-Bottom&nbsp;Panel&nbsp;|&nbsp;jQuery&nbsp;Panel</title>
		<meta charset="UTF-8">
				<link rel="stylesheet" type="text/css" href="http://localhost/scbs/css/core.css.php?colors=000000,999999,eeeeee,ffffff,green,lightgreen" media="all"/>
		<link rel="stylesheet" type="text/css" href="http://localhost/scbs/css/sym-fa.css" media="all"/>
		<link rel="stylesheet" type="text/css" href="http://localhost/scbs/css/ani-anicss.css" />
	</head>
	<body class="background--c2">
	
	<!-- container is needed by jQuery Glasses -->
	<div id="container" class="top-padding--x5 columns draw-outside">
		<div class="column">
			<div id="header" class="margin--x6 padding--x6 center-text">
				<span class="symbol--x2 no-text sym-play-circle-o symbol--c3 ani--x2 ani-spin ani-infinite"></span>
				Bottom panel, please see source code for detail.
			</div>
			<div id="footer" class="margin--x6 padding--x6 center-text">
				<span class="symbol sym-play">
				Contents are managed by Live drilldown, please see source code for detail.
				</span>
			</div>
		</div>
	</div>
	
	<!-- JS -->
	<script type="text/javascript" src="http://localhost/jquery/1.11/jquery.js"></script>
	<script type="text/javascript" src="../dist/jquery.panel.suite.min.js"></script>
	
	<script>
	$(document).ready(function(){
		
		/* drilldown options is required */
		drilldownoptions = {
			//debug: true,
			live: '.live',
			iframe: '.iframe'
		},
		
		/* panel options is required */
		paneloptions = {
			position: 'bottom',
			width: 380,
			duration: .4,
			
			glasses: {
				color: 'black',
				opacity: .6,
				onclick: function(){
					$('.panel').panel('hide');
				}
			},
			
			trigger: {
				show: {selector: '.panel-open'},
				hide: {selector: '.panel-close'}
			}
		},
		
		/* header and footer are required */
		header = $('#header').html(),
		footer = $('#footer').html();
		
		//-- load content and panel
		setTimeout(function(){
			$('#container').load('live/content-n-panel.php',function(){
				$('#header').html(header);
				$('#footer').html(footer);
			});
		},777);

	});
	</script>
		
	</body>
</html>