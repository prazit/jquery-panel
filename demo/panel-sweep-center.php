<?php /* this file extension must be 'php' to force browser always load without caching */ ?>
<!DOCTYPE html>
<html>
	<head>
		<title>DEMO&nbsp;-&nbsp;Center&nbsp;Panel&nbsp;Sweep&nbsp;|&nbsp;jQuery&nbsp;Panel</title>
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
				Top panel and bottom panel can use as Center panel with custom sweep, please see source code for detail.
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
				//debug: true,
				
				position: 'center',
				duration: 0.9,
				width: 360,
				height: 420,
				
				glasses:{
					color: 'pink',
					opacity: 0.6,
					onclick: function(){
						$('.panel').panel('hide');
					}
				},
				
				/*sweep: {
					onShow: {sweep:[	// sweep on show event of panel, see jQuery Sweep options for detail
						{
							play:'ani-lightSpeedIn',
							sweep:[{remove:'flipInY'}]
						}
					]},
					onHide: {sweep:[	// sweep on hide event of panel, see jQuery Sweep options for detail
						{
							play:'ani-lightSpeedOut',
							sweep:[{remove:'flipOutY',add:'hidden',run:function(e){e.scrollTop = 0;}}]
						}
					]},
				},*/
				
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
				// $('.panel').addClass('hidden')
				$('.panel').on('panel:show',function(){
					$(this).addClass('shadow--x6');
				})
				.on('panel:hide',function(){
					$(this).removeClass('shadow--x6');
				});
				$('#header').html(header);
				$('#footer').html(footer);
			});
		},777);

	});
	</script>
		
	</body>
</html>