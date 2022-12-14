<?php /* this file extension must be 'php' to force browser always load without caching */ ?>
<!DOCTYPE html>
<html>
	<head>
		<title>CHAINS DEMO&nbsp;|&nbsp;jQuery&nbsp;Sweep</title>
		<link rel="stylesheet" type="text/css" href="http://localhost/pure/build/combo.css" media="all"/><link rel="stylesheet" type="text/css" href="http://localhost/scbs/css/core.css" media="all"/>
		<link rel="stylesheet" type="text/css" href="http://localhost/scbs/css/sym-fa.css" media="all"/>
		<link rel="stylesheet" type="text/css" href="http://localhost/animate.css/animate.css" />
		<style>
		body,
		.header,
		.back,
		.home {
			background-color:#eee;
		}
		.content,
		.drilldown
		.panel-close {
			background-color: white;
		}
		</style>
	</head>
	<body>

	<!-- container is needed by jQuery Glasses -->
	<div class="container padding--x5 columns">
		
		<!-- page content -->
		<div class="column pure-u-md-1-2 pure-u-lg-1-3 pure-u-xl-1-4" style="position:relative;">
		<div class="content margin--x10 padding--x10 shadow rounded">
			<div class="on-top-right">
				<div style="background-color:lightgreen;color:white;" class="button circle--x12 border panel-open text margin--x10 top-padding--x10 top-symbol sym-th">
					<span>MENU</span>
				</div>
			</div>
			<h1 class="right-symbol sym-angle-right">CONTENT</h1>
			<p>This is content area for anything you want.</p>
			<span>This is content area for anything you want.</span>
			<br><br>
			<strong>This is content area for anything you want.</strong>
		</div>
		</div>
		
		<div class="column pure-u-sm-1-2 pure-u-lg-1-3 pure-u-xl-1-4" style="position:relative;">
		<div class="content margin--x10 padding--x10 shadow rounded">
			<div class="on-top-right">
				<div class="button border panel-open reset-em margin--x10 padding--x10 left-symbol sym-align-justify">
					<span>MENU</span>
				</div>
			</div>
			<h1 class="right-symbol sym-angle-right">CONTENT</h1>
			<p>This is content area for anything you want.</p>
			<span>This is content area for anything you want.</span>
			<br><br>
			<strong>This is content area for anything you want.</strong>
		</div>
		</div>
		
		<div class="column pure-u-sm-1-2 pure-u-md-1 pure-u-lg-1-3 pure-u-xl-1-4" style="position:relative;">
		<div class="content margin--x10 padding--x10 shadow rounded">
			<div class="on-top-right">
				<div style="background-color:black;color:white;" class="button rounded panel-open reset-em rounded margin--x10 padding--x10 left-symbol sym-power-off"><span>MENU</span></div>
			</div>
			<h1 class="right-symbol sym-angle-right">CONTENT</h1>
			<p>This is content area for anything you want.</p>
			<span>This is content area for anything you want.</span>
			<br><br>
			<strong>This is content area for anything you want.</strong>
		</div>
		</div>
		
		<div class="column pure-u-xl-1-4" style="position:relative;">
		<div class="content margin--x10 padding--x10 shadow rounded">
			<div class="on-top-right">
				<div class="button panel-open reset-em padding--x10 left-symbol sym-bars"><span>MENU</span></div>
			</div>
			<h1 class="right-symbol sym-angle-right">CONTENT</h1>
			<p>This is content area for anything you want.</p>
			<span>This is content area for anything you want.</span>
			<br><br>
			<strong>This is content area for anything you want.</strong>
		</div>
		</div>
		
		
		
		<!-- panel and content - the panel is needed but the inner is up to you -->
		<div class="panel column" style="height:0px;overflow:hidden;">
			<div class="inner rounded box-shadow bg-white hidden">
				<div class="top-child x10" style="position:relative;">
					<strong class="on-top-right button rounded panel-close reset-em rounded margin--x10 padding--x5 x10 x10 hidden"><strong class="right-symbol sym-tasks-slash">CLOSE</strong></strong>
					<h3 class="left-symbol sym-caret-right">HEADING</h3>
				</div>
				<div class="rounded padding">
					<a class="top-child button right-symbol sym-chevron-right" href="panel-leftside.php"><strong><b>Left</b> Panel</strong></a>
					<a class="child button right-symbol sym-chevron-right" href="panel-rightside.php"><strong><b>Right</b> Panel</strong></a>
					<a class="child button right-symbol sym-chevron-right" href="panel-doubleside.php"><strong><b>Double</b> Panel</strong></a>
					<a class="child button right-symbol sym-chevron-right" href="panel-topside.php"><strong><b>Top</b> Panel</strong></a>
					<a class="bottom-child button right-symbol sym-chevron-right" href="panel-bottomside.php"><strong><b>Bottom</b> Panel</strong></a>
				</div>
				<div class="rounded padding">
					<a class="top-child button right-symbol sym-chevron-right" href="panel-sweep-leftside.php"><strong><b>Left</b> Panel with Sweep</strong></a>
					<a class="child button right-symbol sym-chevron-right" href="panel-sweep-rightside.php"><strong><b>Right</b> Panel with Sweep</strong></a>
					<a class="child button right-symbol sym-chevron-right" href="panel-sweep-topside.php"><strong><b>Top</b> Panel with Sweep</strong></a>
					<a class="child button right-symbol sym-chevron-right" href="panel-sweep-bottomside.php"><strong><b>Bottom</b> Panel with Sweep</strong></a>
					<a class="bottom-child button right-symbol sym-chevron-right" href="panel-sweep-center.php"><strong><b>Center</b> Panel with Sweep</strong></a>
				</div>
				<div class="rounded padding">
					<a class="top-child button right-symbol sym-chevron-right" href="sweep-chains.php"><strong><b>Inline</b> Panel using Pure Sweep</strong></a>
					<a class="bottom-child button right-symbol sym-chevron-right" href="sweep.php"><strong><b>Right</b> Panel using Pure Sweep</strong></a>
				</div>
			</div>
		</div>
		
		
		
		<!-- page content -->
		<div class="column pure-u-md-1-2 pure-u-lg-1-3 pure-u-xl-1-4" style="position:relative;">
		<div class="content margin--x10 padding--x10 shadow rounded">
			<div class="on-top-right">
				<div style="background-color:lightgreen;color:white;" class="button circle--x12 border panel-open text margin--x10 top-padding--x10 top-symbol sym-th">
					<span>MENU</span>
				</div>
			</div>
			<h1 class="right-symbol sym-angle-right">CONTENT</h1>
			<p>This is content area for anything you want.</p>
			<span>This is content area for anything you want.</span>
			<br><br>
			<strong>This is content area for anything you want.</strong>
		</div>
		</div>
		
		<div class="column pure-u-sm-1-2 pure-u-lg-1-3 pure-u-xl-1-4" style="position:relative;">
		<div class="content margin--x10 padding--x10 shadow rounded">
			<div class="on-top-right">
				<div class="button border panel-open reset-em margin--x10 padding--x10 left-symbol sym-align-justify">
					<span>MENU</span>
				</div>
			</div>
			<h1 class="right-symbol sym-angle-right">CONTENT</h1>
			<p>This is content area for anything you want.</p>
			<span>This is content area for anything you want.</span>
			<br><br>
			<strong>This is content area for anything you want.</strong>
		</div>
		</div>
		
		<div class="column pure-u-sm-1-2 pure-u-md-1 pure-u-lg-1-3 pure-u-xl-1-4" style="position:relative;">
		<div class="content margin--x10 padding--x10 shadow rounded">
			<div class="on-top-right">
				<div style="background-color:black;color:white;" class="button rounded panel-open reset-em rounded margin--x10 padding--x10 left-symbol sym-power-off"><span>MENU</span></div>
			</div>
			<h1 class="right-symbol sym-angle-right">CONTENT</h1>
			<p>This is content area for anything you want.</p>
			<span>This is content area for anything you want.</span>
			<br><br>
			<strong>This is content area for anything you want.</strong>
		</div>
		</div>
		
		<div class="column pure-u-xl-1-4" style="position:relative;">
		<div class="content margin--x10 padding--x10 shadow rounded">
			<div class="on-top-right">
				<div class="button panel-open reset-em padding--x10 left-symbol sym-bars"><span>MENU</span></div>
			</div>
			<h1 class="right-symbol sym-angle-right">CONTENT</h1>
			<p>This is content area for anything you want.</p>
			<span>This is content area for anything you want.</span>
			<br><br>
			<strong>This is content area for anything you want.</strong>
		</div>
		</div>
		
		
		<!-- JS -->
		<script type="text/javascript" src="http://localhost/jquery/1.11/jquery.js"></script>
		<script type="text/javascript" src="../src/jquery.sweep.js"></script>
		<script>
			
			//-- play sweep when click on MENU button
			$('.panel-open').sweep({
				//debug: true,	// show JSON of handled sweep on firefox console
				
				duration:1,		// default duration for child
				sweep: [
					
					//-- hide this MENU button by bounceOut
				    {
					    play:'ani-bounceOut',
					    sweep:[
							{add:'hidden'}
						]
					},
					//-- show PANEL 2 step by xpanInX and flipInX
					{
						selector:'.panel',
						duration:0.4,
						csstrans:true,
						css:{height:'530px'},
						defer:[{
							duration: -0.2,
							sweep:[
								{selector:'.panel>.inner',play:'ani-flipInX',sweep:[
									//-- show CLOSE button
									{selector:'.panel-close',play:'ani-bounceIn',css:{zIndex:1001},sweep:[{play:'ani-tada'}]}
								]}
							]
						}]
					},
					
					//-- NEW ACTION: play sweep when click on CLOSE button
					{
						selector: '.panel-close',
						on: 'click touchstart',
						
						sweep: [
							
							//-- hide CLOSE button using animated css
						    {
							    play:'ani-flipOutX',
							    css:{zIndex:1},
							    sweep:[{add:'hidden'}],
								//-- during hide CLOSE button then show MENU button
							    defer:[{
									duration:-0.5,
									sweep:[{selector:'.panel-open',play:'ani-flipInX',css:{zIndex:1001}}]
								}]
							},
							
							//-- hide PANEL 2 step by xpanOutX and flipOutX
							{
								selector:'.panel>.inner',
								play:'ani-flipOutX',
								sweep:[{add:'hidden'}],
								
								//-- sweeping is delayed sweep
								defer:[{
									duration: -0.5,	// This duration is seconds to wait before play sub sweep after sweeper duration is end, negative number means to play sub sweep before sweeper duration is end. 
									sweep:[{
										selector:'.panel',
										duration:.4,
										csstrans:true,
										css:{height:'0px'}
									}]
								}]
							}
							
						]
					}
				]

			});
			
		</script>
		
	</div>
	</body>
</html>
