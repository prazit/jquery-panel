<?php /* this file extension must be 'php' to force browser always load without caching */ ?>
<!DOCTYPE html>
<html>
	<head>
		<title>DEMO&nbsp;-&nbsp;Sweep|&nbsp;jQuery&nbsp;Drilldown</title>
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
				<span class=" no-text sym-play-circle-o symbol--x2 symbol--c3 ani--x2 ani-bounce ani-infinite"></span>
				Drilldown with custom sweep options, please see source code for detail.
			</div>
			<div id="footer" class="margin--x6 padding--x6 center-text">
				<span class="symbol sym-play">
				Right panel with more options, please see source code for detail.
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
		drilldownoptions = {				// create drilldown
			//debug: true,
			live: '.live',
			iframe: '.iframe',
			
			//-- use animation class for show and hide panels
			<?php $sweep = isset($_GET['sweep'])?$_GET['sweep']:1; ?>
			<?php if($sweep==1) { ?>
			sweep: {
				
				//-- default duration for all sweep
				duration: 0.4,		// seconds
				
				//-- onNextIn,onNextOut,onBackIn and onBackOut are options of jQuery Sweep, see jQuery Sweep for detail
				
				// play on next, drilldown:nextin for show and drilldown:nextout for hide.
				onNextIn: {sweep:[{play:'ani-zoomInRight'}]},
				onNextOut: {sweep:[{play:'ani-zoomOutLeft',sweep:[{add:'hidden'}]}]},
				
				// play on back, drilldown:backin for show and drilldown:backout for hide.
				onBackIn: {sweep:[{play:'ani-zoomInLeft'}]},
				onBackOut: {sweep:[{play:'ani-zoomOutRight',sweep:[{add:'hidden'}]}]}
				
			}
			<?php } elseif($sweep==2) { ?>
			sweep: {
				
				//-- default duration for all sweep
				duration: 0.4,		// seconds
				
				//-- onNextIn,onNextOut,onBackIn and onBackOut are options of jQuery Sweep, see jQuery Sweep for detail
				
				// play on next, drilldown:nextin for show and drilldown:nextout for hide.
				onNextOut: {defer:[{duration:0.1,sweep:[{play:'ani-fadeOut',sweep:[{add:'hidden'}]}]}]},
				onNextIn: {defer:[{duration:0.01,sweep:[{play:'ani-rotateInDownRight'}]}]},
				
				// play on back, drilldown:backin for show and drilldown:backout for hide.
				onBackOut: {defer:[{duration:0.1,sweep:[{play:'ani-rotateOutUpRight',sweep:[{add:'hidden'}]}]}]},
				onBackIn: {defer:[{duration:0.01,sweep:[{play:'ani-fadeIn'}]}]}
				
				
			}
			<?php } elseif($sweep==3) { ?>
			sweep: {
				
				//-- default duration for all sweep
				duration: 0.8,		// seconds
				
				//-- onNextIn,onNextOut,onBackIn and onBackOut are options of jQuery Sweep, see jQuery Sweep for detail
				
				// play on next, drilldown:nextin for show and drilldown:nextout for hide.
				onNextOut: {defer:[{duration:0.1,sweep:[{play:'ani-zoomOutLeft',css:{zIndex:1001},sweep:[{add:'hidden'}]}]}]},
				onNextIn: {defer:[{duration:0.01,sweep:[{play:'ani-zoomInRight',css:{zIndex:1}}]}]},
				
				// play on back, drilldown:backin for show and drilldown:backout for hide.
				onBackOut: {defer:[{duration:0.1,sweep:[{play:'ani-zoomOutRight',css:{zIndex:1001},sweep:[{add:'hidden'}]}]}]},
				onBackIn: {defer:[{duration:0.01,sweep:[{play:'ani-zoomInLeft',css:{zIndex:1}}]}]}
				
			}
			<?php } ?>
			
		},
		
		/* panel options is required */
		paneloptions = {
			// position: 'right',	// default is 'right' already
			width: 300,
			pull: 'hard',			// hard or soft or false
			glasses: {
				onclick: function() {
					$(this).panel('hide');
				}
			},
			trigger: {
				show: {
					selector: '.panel-open',
					on: 'click touchstart'
				},
				hide: {
					selector: '.panel-close',
					on: 'click touchstart'
				}
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