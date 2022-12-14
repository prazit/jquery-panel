<?php header("access-control-allow-origin: *");?>
<!DOCTYPE html>
<html>

	<head>
		<title>Focus On Number</title>
		<meta charset="UTF-8">
		<link rel="stylesheet" type="text/css" href="http://localhost/scbs/css/core.css.php?colors=000000,999999,eeeeee,ffffff,green,lightgreen" media="all"/>
		<link rel="stylesheet" type="text/css" href="http://localhost/scbs/css/sym-fa.css" media="all"/>
		<link rel="stylesheet" type="text/css" href="http://localhost/scbs/css/ani-anicss.css" />
		<style>
		@keyframes ani-zoomOutIn {
		  0% {
			opacity: 0;
			-webkit-transform: scale3d(100, 100, 100);
			-ms-transform: scale3d(100, 100, 100);
			transform: scale3d(100, 100, 100);
		  }
		  45% {
			opacity: 1;
			-webkit-transform: scale3d(2.5, 2.5, 2.5);
			-ms-transform: scale3d(2.5, 2.5, 2.5);
			transform: scale3d(2.5, 2.5, 2.5);
		  }
		  100% {
			opacity: 1;
		  }
		}

		.ani-zoomOutIn {
		  -webkit-animation-name: ani-zoomOutIn;
		  animation-name: ani-zoomOutIn;
		}
		
		@keyframes ani-flipX {
		  0% {
			-webkit-transform: perspective(1000px) translate(-50%,-50%);
			-ms-transform: perspective(1000px) translate(-50%,-50%);
			transform: perspective(1000px) translate(-50%,-50%);
		  }

		  100% {
			-webkit-transform: perspective(1000px) rotate3d(1, 0, 0, 180deg) translate(-50%,50%);
			-ms-transform: perspective(1000px) rotate3d(1, 0, 0, 180deg) translate(-50%,50%);
			transform: perspective(1000px) rotate3d(1, 0, 0, 180deg) translate(-50%,50%);
		  }
		}

		.ani-flipX {
		  -webkit-backface-visibility: visible;
		  -ms-backface-visibility: visible;
		  backface-visibility: visible;
		  -webkit-animation-name: ani-flipX;
		  animation-name: ani-flipX;
		}
		
		</style>
	</head>
	
	<body class="fixed background--c1 fit-width fit-height" style="font-family: Arial,sans-serif;">
	
		<div class="on-center text--x4 center-text top-padding--x20">
		
			<h1 class="number display-1 middle text--x6 text--c3">
				0
			</h1>
			
		</div>
		
		<div class="frame on-center border--x50 border--c2 height--x350"></div>
		
		<div class="on-center text--x4 center-text top-padding--x20">
		
			<h1 class="number display-2 hidden middle text--x6 text--c3">
				0
			</h1>
			
		</div>
		
		<div class="on-center text--x2 center-text top-padding--x20">
		
			<h1 class="speed number hidden middle text--x6 text--c3 text-shadow--x5">
				1
			</h1>
			
		</div>

		<!-- player control -->
		<div class="circle--x50 on-bottom-right margin--x20 background--c1 opacity--x0 opacity--x100--at border--x4 border--c3">
			<span class="play button on-center left-padding--x5 symbol--x2 sym-play symbol--c0 symbol--c3--at"></span>
			<span class="hidden resume button on-center left-padding--x5 symbol--x2 sym-play symbol--c0 symbol--c3--at"></span>
			<span class="hidden pause button on-center symbol--x2 sym-pause symbol--c0 symbol--c3--at"></span>
		</div>
		
		<!-- speed control -->
		<div class="on-right rounded--x50 opacity--x0 opacity--x100--at margin--x20 border--x4 border--c3">
			<span class="big-speed-up button top-child background--c1 background--c0--at padding--x10 symbol sym-angle-double-up symbol--c3"></span>
			<span class="speed-up button child background--c1 background--c0--at padding--x10 symbol sym-angle-up symbol--c3"></span>
			<span class="speed-reset button child background--c1 background--c0--at padding--x10 text--c3">1x</span>
			<span class="speed-down button child background--c1 background--c0--at padding--x10 symbol sym-angle-down symbol--c3"></span>
			<span class="big-speed-down button bottom-child background--c1 background--c0--at padding--x10 symbol sym-angle-double-down symbol--c3"></span>
		</div>
		
		<!-- number control -->
		<div class="on-left rounded--x50 opacity--x0 opacity--x100--at margin--x20 border--x4 border--c3">
			<span class="plus button top-child background--c1 background--c0--at padding--x10 symbol sym-caret-up symbol--c3"></span>
			<span class="zero button child background--c1 background--c0--at padding--x10 symbol sym-circle-o symbol--c3"></span>
			<span class="minus button bottom-child background--c1 background--c0--at padding--x10 symbol sym-caret-down symbol--c3"></span>
		</div>
		
		<!-- colors -->
		<div class="on-bottom-left rounded--x5 margin--x10 padding--x5 background--c1 opacity--x0 opacity--x100--at columns height--x120 width--x150 border--x4 border--c3">
			<div class="row-1-3 column">
			<div class="columns margin--x5">
				<span class="column-1-4"><span class="black-back button square--x30 border background--c0"></span></span>
				<span class="column-1-4"><span class="gray-back button square--x30 border background--c1"></span></span>
				<span class="column-1-4"><span class="silver-back button square--x30 border background--c2"></span></span>
				<span class="column-1-4"><span class="white-back button square--x30 border background--c3"></span></span>
			</div>
			</div>
			<div class="row-1-3 column">
			<div class="columns margin--x5">
				<span class="column-1-4"><span class="black-frame button square--x30 border background--c0"></span></span>
				<span class="column-1-4"><span class="gray-frame button square--x30 border background--c1"></span></span>
				<span class="column-1-4"><span class="silver-frame button square--x30 border background--c2"></span></span>
				<span class="column-1-4"><span class="white-frame button square--x30 border background--c3"></span></span>
			</div>
			</div>
			<div class="row-1-3 column">
			<div class="columns margin--x5">
				<span class="column-1-4"><span class="black-number button square--x30 border background--c0"></span></span>
				<span class="column-1-4"><span class="gray-number button square--x30 border background--c1"></span></span>
				<span class="column-1-4"><span class="silver-number button square--x30 border background--c2"></span></span>
				<span class="column-1-4"><span class="white-number button square--x30 border background--c3"></span></span>
			</div>
			</div>
		</div>
		
		<!-- JS -->
		<script type="text/javascript" src="http://localhost/jquery/1.11/jquery.min.js"></script>
		<script type="text/javascript" src="../dist/jquery.panel.suite.min.js"></script>
		
		<script>
		Appanel({
			focus: {
				
				//-- focus constants
				out: 13,	// duration for animation of number go out
				defer: 0.5,	// duration before start of animation of number come in
				in: 12,		// duration for animation of number come in
				flash: 4,	// duration for animation of frame shutter
				speed: 1,	// last speedX from config
				
				//-- focus system
				startNumber: 0,
				number: 0,
				mon1: $(".display-1"),
				mon2: $(".display-2"),
				controller: $(".play.button"),
				frame: $(".frame"),
				width: function(){
					return this.mon2.width() + 40;
				},
				set: function(number) {
					this.number = number;
					this.mon1.html(number);
					this.mon2.html(number);
				},
				init: function() {

					// restore durations
					var config = Appanel.get("focus");
					if(config) {
						$.extend(this,config);
					}
					
					/**
					 * save config
					 * usage: config.call(Appanel.focus);
					 * this = Appanel.focus
					 */
					config = function() {
						Appanel.set("focus",{
							speed:this.controller.sweep("speedx"),
							startNumber:this.number
						});
					};

					// start number
					this.set(this.startNumber);

					// frame width
					this.frame.width(this.width());

					// animation when speed is changed
					var speed = {
							on: "click",
							sweep:[{
								selector: ".speed",
								remove: "ani-bounceOut",
								add: "hidden",
								sweep:[{
									run: function() {
										var x = Appanel.focus.controller.sweep("speedx");
										this.$.html(x.toPrecision(x>1?2:1) + "x");
									},
									duration: 1,
									play: "ani-bounceOut",
									sweep:[{add: "hidden"}]
								}]
							}]
						};

					// listener mapper
					Appanel.map([
						[$(".speed-reset").sweep(speed),"click",function() {
							Appanel.focus.controller.sweep("speedx",1);
							// update config
							config.call(Appanel.focus);
						}],
						[$(".speed-down").sweep(speed),"click",function() {
							var x = Appanel.focus.controller.sweep("speedx");
							if(x >= 0.2) {
								x -= 0.1;
							}
							Appanel.focus.controller.sweep("speedx",x);
							// update config
							config.call(Appanel.focus);
						}],
						[$(".speed-up").sweep(speed),"click",function() {
							var x = Appanel.focus.controller.sweep("speedx") + 0.1;
							Appanel.focus.controller.sweep("speedx",x);
							// update config
							config.call(Appanel.focus);
						}],
						[$(".big-speed-down").sweep(speed),"click",function() {
							var x = Appanel.focus.controller.sweep("speedx");
							if(x >= 2.0) {
								x -= 1.0;
							}
							Appanel.focus.controller.sweep("speedx",x);
							// update config
							config.call(Appanel.focus);
						}],
						[$(".big-speed-up").sweep(speed),"click",function() {
							var x = Appanel.focus.controller.sweep("speedx") + 1.0;
							Appanel.focus.controller.sweep("speedx",x);
							// update config
							config.call(Appanel.focus);
						}],
						[".plus","click",function() {
							Appanel.focus.set(Appanel.focus.number + 1);
							// update config
							config.call(Appanel.focus);
						}],
						[".zero","click",function() {
							Appanel.focus.set(0);
							// update config
							config.call(Appanel.focus);
						}],
						[".minus","click",function() {
							if(Appanel.focus.number>0) {
								Appanel.focus.set(Appanel.focus.number - 1);
								// update config
								config.call(Appanel.focus);
							}						
						}],
						[".pause","click",function(){
							$(this).addClass("hidden");
							Appanel.focus.controller.sweep("pause");
							Appanel.focus.frame.width(Appanel.focus.width()).height("");
							$(".resume.button").removeClass("hidden");
							// update config
							config.call(Appanel.focus);
						}],
						[".resume","click",function(){
							Appanel.focus.controller.sweep("resume");
							$(this).addClass("hidden");
							$(".pause.button").removeClass("hidden");
							// update config
							config.call(Appanel.focus);
						}]
					]);

					// animation for counter
					this.controller.sweep({
						speed: 1 / this.speed, // speed = 1 / x
						on:"click",
						add: "hidden",
						runonce: function(){
							$(".pause.button").removeClass("hidden");
						},
						sweep:[
							{
								label: "loop",
								selector: this.mon1,
								duration: this.out,
								play: "ani-zoomOut",
								sweep: [{add:"hidden"}],
								defer: [{
									duration: this.defer,
									sweep: [
									{
										// label: "come-on",
										selector: this.mon2,
										duration: this.in,
										run: function() {
											this.$.html(++Appanel.focus.number);
											// update config
											config.call(Appanel.focus);
										},
										play: "ani-zoomOutIn",
										sweep: [
											{
												// label: "swap",
												selector: this.mon1,
												run: function() {
													this.$.html(Appanel.focus.number);
												},
												remove: "hidden",
												sweep: ["loop"]
											},
											{add: "hidden"}
										]
									},
									{
										//label: "reframe",
										selector: this.frame,
										duration: this.flash,
										play: "ani-flipX",
										sweep: [{
											duration: this.flash,
											run: function() {
												this.css.width = Appanel.focus.width();
											},
											csstrans: true,
											css: {}
										}]
									}
									]
								}]
							}
						]
					});
					
				} // end of init
			},
			color: {
				set: function(color) {
					if(color) {
						Appanel.set("focus:"+this.name,color);
						this.element.css(this.prop,color);
					}
				},
				handle: function() {
					var i,color, 
						colors = ["black","gray","silver","white"];
					for(var i in colors) {
						color = colors[i];
						$("."+color+"-"+this.name).on("click",{control:this,color:color},function(ev){
							ev.data.control.set(ev.data.color);
						});
					}
				},
				stamp: function(name,prop,target) {
					Appanel[name] = $.extend({},this,{
						name: name,
						prop: prop,
						element: target
					});
					Appanel[name].handle();
					Appanel[name].set(Appanel.get("focus:"+name));	// restore color
				}
			},
			ready: function(){
				this.focus.init();
				this.color.stamp("back","background-color",$("body"));
				this.color.stamp("frame","border-color",$(".frame"));
				this.color.stamp("number","color",$(".number"));
			}
		});
		</script>
	
	</body>
</html>
