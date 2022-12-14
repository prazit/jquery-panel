<?php /* this file extension must be 'php' to force browser always load without caching */ ?>
<!DOCTYPE html>
<html>

	<head>
		<title>DEMO&nbsp;-&nbsp;All|&nbsp;jQuery&nbsp;InOut</title>
		<meta charset="UTF-8">
		<link rel="stylesheet" type="text/css" href="http://localhost/scbs/css/core.css.php?colors=000000,999999,eeeeee,ffffff,green,lightgreen" media="all"/>
		<link rel="stylesheet" type="text/css" href="http://localhost/scbs/css/sym-fa.css" media="all"/>
		<link rel="stylesheet" type="text/css" href="http://localhost/scbs/css/ani-anicss.css" />
	</head>
	
	<body class="background--c2 fit-width fit-height scrollable">
	
	<!-- container is needed by jQuery Glasses -->
	<div id="container" class="top-padding--x5 columns">
		<div class="column">
			<div id="header" class="margin--x6 padding--x6 center-text">
				<span class="symbol--x2 no-text sym-play-circle-o symbol--c3 ani ani-spin ani-infinite"></span>
				InOut Plugin for jQuery, scroll to see what's happend and open source code for detail.
			</div>
			<div id="footer" class="margin--x6 padding--x6 center-text">
				<span class="symbol sym-play">
				Right panel with more options, please see source code for detail.
				</span>
			</div>
		</div>
	</div>
	
	<!-- more content to test scroll in/out -->
	<div id="morecontent" class="column">
		<div id="showNhide" class="padding--x10">
		<div class="height--x200 rounded--x10 background--c3 shadow right-corner--x50 corner--c4">
			<h1 class="upper on-center text--x6 text--c4">Hide</h1>
		</div>
		</div>
		<div class="padding--x10"><div class="height--x200 rounded--x10 background--c3 shadow"></div></div>
		<div class="padding--x10"><div class="height--x200 rounded--x10 background--c3 shadow"></div></div>
		<div class="padding--x10"><div class="height--x200 rounded--x10 background--c3 shadow"></div></div>
	</div>
	
	
	<!-- inout test box -->
	<div id="inout" class="margin--x10 rounded background--c3">
		<div style="height:100px;" class="live-image border--x2 border--c4" src="http://localhost/innovate/img/common/computerhover.jpg">This is Live Image 1</div>
		<div style="height:100px;" class="live-image border--x2 border--c4" src="http://localhost/innovate/img/common/computer.jpg">This is Live Image 1</div>
		<div style="height:100px;" class="live-image border--x2 border--c4" src="http://localhost/innovate/img/common/abouthover.jpg">This is Live Image 2</div>
		<div style="height:100px;" class="live-image border--x2 border--c4" src="http://localhost/innovate/img/common/about.jpg">This is Live Image 2</div>
	</div>
	
	
	<!-- scroll to top button -->
	<div id="totop" class="hidden fixed button on-bottom-left margin--x30  sym-arrow-circle-up symbol--x4 smaller">0</div>
	
	<!-- top bar -->
	<div id="topbar" class="hidden fixed on-top-left center-text width--x200 height--x50 no-scroll" style="z-index:38888;">
		<div class="columns shadow rounded--x30 height--x30 border margin--x10 smaller background--c3 border--c2">
			<a class="column-1-4 fit-height button" href="index.html"><span class="on-center  symbol--x2 sym-home no-text symbol--c5">&nbsp;</span></a>
			<a class="column-1-4 fit-height button" href="inout.php"><div class="border-left fit-height"></div><span class="on-center  symbol--x2 sym-refresh no-text symbol--c5">&nbsp;</span></a>
			<a class="column-1-4 fit-height button" href="inout.php"><div class="border-left fit-height"></div><span class="on-center  symbol--x2 sym-arrow-left no-text symbol--c5">&nbsp;</span></a>
			<a class="column-1-4 fit-height button" href="inout.php"><div class="border-left fit-height"></div><span class="on-center  symbol--x2 sym-arrow-right no-text symbol--c5">&nbsp;</span></a>
		</div>
	</div>
	
	<!-- JS -->
	<script type="text/javascript" src="http://localhost/jquery/1.11/jquery.min.js"></script>
	<script type="text/javascript" src="../dist/jquery.panel.suite.min.js"></script>
	
	<script>
	$(document).ready(function(){

		/* drilldown options is required */
		drilldownoptions = {
			//debug: true
		};
		
		/* panel options is required */
		paneloptions = {
			position: 'right',
			width: 320,
			pull: 'hard',
			pullthis: '#container',
			//container: 'body',
			
			glasses: {
				color: 'lightblue',
				opacity: 0.6,
				onclick: function(){$('.panel').panel('hide');}
			},
			
			trigger: {
				show: {selector: '.panel-open'},
				hide: {selector: '.panel-close'}
			}
		};
		
		/* header and footer are required */
		header = $('#header').html(),
		footer = $('#footer').html();
		
		//-- load content and panel
		$('#container').load('live/content-n-panel.php',function(){
			
			$('#header').html(header);
			$('#footer').html(footer);
			$(this).append($('#morecontent'));

			//-- use body as scroller
			var $body = $('body');
			
			// show and hide content of showNhide (PLAY and PAUSE)
			$body.inout($('#showNhide').sweep({
				on: 'inout:topin inout:bottomin',

				//-- defaults for transition
				duration: 1,
				timing: 'ease-out',
				
				sweep:[
				    {
					    selector: '#showNhide h1',
					    css: {color: 'white'},
						run: function(e) {
							$(e).html('PLAY');
						},
						sweep:[{
						    csstrans: true,
						    css: {color: 'green'}
						},
						{
							selector: '#showNhide>div',
							add: 'right-corner--x50',
						}]
					},
					{
						on: 'inout:topout inout:bottomout',
						sweep:[{
						    selector: '#showNhide h1',
						    css: {color: 'white'},
							run: function(e) {
								$(e).html('PAUSE');
							},
							sweep:[{
							    csstrans: true,
							    css: {color: 'silver'}
							},
							{
								selector: '#showNhide>div',
								remove: 'right-corner--x50'
							}]
						}]
					}
				]
			}),-150);

			//-- show menu button after last become hidden
			var $lastbutton = $('.panel-open').last();
			$body.inout(function(){
				// use top of parent
				return this.target.parent().offset().top;
			},$lastbutton.sweep({
				//-- show as fixed button when topout
				on: 'inout:topout',
			    add: 'hidden fixed on-top-right margin--x10',
			    css: {zIndex:38889},
				sweep:[
					//-- animation show
				    {play: 'ani-fadeInRight'},
					
					//-- show as normal
					{
						on: 'inout:topin',
						//-- animation hide
						play: 'ani-fadeOutRight',
						sweep:[{
							add: 'hidden',
							css: {zIndex:'auto'},
							sweep: [{remove:'hidden fixed on-top-right margin--x10'}]
						}]
					}
				]
			}));

			/**
			 * totop button using sweep(listener) and inout(trigger)
			 *
			 * Remember: listener first trigger last.  
			 */
			$body.inout(50,$('#totop').on('click touchstart',function(){
				$(window).scrollTop(0);
			}).sweep({
				//-- show on #totop.inout:nextout
				on: 'inout:topout',
				sweep:[
					//-- animation show
				    {
					    play: 'ani-rotateInUpLeft',
					    run: function(e){
					    	$(e).html($(e).html()*1+1);
					 	}
				 	},
					
					//-- hide on #totop.inout:backin
					{
						on: 'inout:topin',
						//-- animation hide
						sweep:[{
							play: 'ani-rotateOutDownLeft',
							sweep:[{add: 'hidden'}]
						}]
					}
				]
			}));

			$body.inout(50,$('#topbar').sweep({
				//-- show on #topbar.inout:nextout
				on: 'inout:topout',
				sweep:[
					//-- animation show
				    {play: 'ani-fadeInDown'},
					
					//-- hide on #tobar.inout:backin
					{
						on: 'inout:topin',
						//-- animation hide
						sweep:[{
							play: 'ani-fadeOutUp',
							sweep:[{add: 'hidden'}]
						}]
					}
				]
			}));

			// inout test box
			$('#inout').live({
				content: '.live-content',
				iframe: '.live-iframe',
				image: '.live-image',
				scroller: $body
			}).triggerHandler('message:tip','scroll to see what\'s happen');
			
		});
		
	});
	</script>

	
	</body>
</html>
