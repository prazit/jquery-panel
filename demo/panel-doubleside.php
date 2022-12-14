<?php /* this file extension must be 'php' to force browser always load without caching */ ?>
<!DOCTYPE html>
<html>
	<head>
		<title>DEMO&nbsp;-&nbsp;Double&nbsp;Panel&nbsp;|&nbsp;jQuery&nbsp;Panel</title>
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
				Right panel, please see source code for detail.
			</div>
			<div id="footer" class="margin--x6 padding--x6 center-text">
				<span class="symbol sym-play">
				Contents are managed by Live drilldown, please see source code for detail.
				</span>
			</div>
		</div>
	</div>
	
	<!-- LEFT PANEL -->
	<div id="left-panel" class="hidden background--c5 draw-outside border--c3" style="z-index:78889;">
		<div class="on-top-right margin--right--x-3 background--c3" style="height:100%;width:8px;"></div>
		
		<div class="hidden close button shadow right-margin--x-30 circle--x50 border--x4 on-right padding--x5 draw-outside center-text background--c1 border--c3">
		<span class="on-center">
			<span class="rotate--x180  symbol--x2 sym-lock no-text symbol--c3"></span>
		</span>
		</div>
		
		<span class="on-top-left vertical-text ellipsis">
			<h1 class="text--x4 text--c4">LEFT PANEL</h1>
			<h6 class="text--c4">with animation and transition</h6>
		</span>
	</div>
	
	<!-- JS -->
	<script type="text/javascript" src="http://localhost/jquery/1.11/jquery.js"></script>
	<script type="text/javascript" src="../dist/jquery.panel.suite.min.js"></script>
	
	<script>
	$(document).ready(function(){
		
		/* drilldown options is required */
		drilldownoptions = {
			//debug: true,
		},
		
		/* panel options is required */
		paneloptions = {
			// position: 'right',	// default is 'right' already
			duration: 1,
			width: '50%',
			pull: false,			// hard or soft or false
			glasses: false,
			trigger: {
				show: {selector: '.panel-open'},
				hide: {selector: '.panel-close'}
			}
		},
		
		/* header and footer are required */
		header = $('#header').html(),
		footer = $('#footer').html();
		
		//-- load content and panel
		$('#container').load('live/content-n-panel.php',function(){
			
			$('#header').html(header);
			$('#footer').html(footer);
			
			// create left after right
			paneloptions.position='left';
			$('#left-panel').panel(paneloptions).removeClass('hidden');
			
			// more animation show when click on panel-open
			$('.panel-open').each(function(){
				$(this).sweep({
					sweep:[{
						//-- show lock button when click on panel-open button						
						selector: '#left-panel .close',
						play: 'ani-bounceIn',
						duration: .9,
						sweep:[{
							selector: '#left-panel .sym-lock',
							csstrans:true,
							remove: 'rotate--x180'
						}]
					}]
				});
			});
			
			// more animation hide
			//-- hide lock button when click on panel-close button
			$('.panel-close').sweep({
				selector: '.panel-close',
				on: 'click touchstart',
				sweep:[
					{
						selector: '#left-panel .close',
						add:'hidden'
					},
					{
						selector: '#left-panel .sym-lock',
						add: 'rotate--x180'
					},
					//-- hide lock button and panels when click on lock button					
					{
						selector: '#left-panel .close',
						on: 'click touchstart',
						run: function(e){
							$('.drilldown').drilldown('home');
						},
						sweep:[
						    {
							    selector: '#left-panel .close',
							    csstrans: true,
							    css: {zoom:1.2},
							    duration: 0.2,
							    sweep:[{							    
								    csstrans: true,
								    css: {zoom:1},
								    duration: 0.2
								}]
							},
							{
								selector: '#left-panel .sym-lock',
								csstrans:true,
								add: 'rotate--x180',
								duration: 0.4,
								sweep:[
									{
										selector: '#left-panel .close',
										play: 'ani-bounceOut',
										duration: 0.4,
										sweep:[{add:'hidden'}],
										run: function(){
											$('.panel').panel('hide');
											$('#left-panel').panel('hide');
										}
									}
								]
							}
						]
					}
				]
			});
				
		});
		
	});
	</script>
		
	</body>
</html>