/*!
 * Glass is jQuery plugin, it's a part of Appanel Styler Suite.
 * This will show glass that cover full page and bring an element up on the glass.
 * 
 * Take effect to the First element of selector.
 * 
 * Remember: glass always in layer-5, layer-6 is recommended for any thing above glass. 
 * 
 * @name glass
 * @version 1.2.7
 * @requires	jQuery for Appanel
 * 				jQuery Sweep
 * @author Prazit Jitmanozot
 * 
 * Copyright (c) 2016 Prazit (R) Jitmanozot (http://Appanel.com)
 */
/**
 * Uses: data-glass = glass-ID or index of virtual cascading glass
 * Syntax: $(selector).glass({options}|command)
 * Commands: remove, refresh, removeall
 */
(function($){
	
	// variables must be declare by var before use, for development only
	'use strict';

	$.fn.glass = function(cmd) {
		
		var defaults = {
				elementLayer: false,		// layer of an element, default is no change, recommended is layer-7.
				
				container: Appanel.router,	// selector or element of container of a glass when show.
				layer: 5,					// layer of a glass, default is layer-5. 
				
				color: 'black',				// default glass color is black
				opacity: 0.6,				// opacity requires more than zero
				duration: Appanel.duration.animate,	// duration of animation show/hide 
				
				scrollLock: true,			// remember scroll position and restore every time scroll. 
				
				//-- when touch a glass
				onclick: function(){
					$.glass.scroll();
				}
			},
		
		//-- constants
		onShow = 'glass:show',
		onHide = 'glass:hide';
		
		// ignore when have no element
		if(this.length==0) return this;
		
		// create glass manager first.
		if($.glass==undefined) {
			
			/**
			 * Glass Manager object stand within jQuery object.
			 */ 
			$.glass = {
					
					// glass: undefined,
					
					/**
					 * Hole Stack is store the hole elements for casecade hole. 
					 */
					stack: [],
					
					/**
					 * Environment of active hole.
					 */
					scrollTop: 0,
					//scrollElement: undefined,
					
					/**
					 * Scroll Lock variables
					 */
					scrollX: 0,
					scrollY: 0,
					//scrollLock: undefined,			// function that use to bind/unbind the scroll event of window
					
					lockScroll: function(){
						// remember current scroll position
						this.scrollX = window.scrollX;
						this.scrollY = window.scrollY;
						if(this.scrollLock==undefined) {
						
							// when scroll position is changed then scroll back
							this.scrollLock = function(ev) {
								var $this = $.glass;
								if(ev.type!='scroll') {
									// remember current scroll position again when resize
									$this.scrollX = window.scrollX;
									$this.scrollY = window.scrollY;
								} else {
									// restore scroll position
									if($this.scrollX != window.scrollX || $this.scrollY != window.scrollY) {
										window.scrollTo($this.scrollX,$this.scrollY);
									}
								}
							};
							
							// enable scrollLock
							$(window).bind('scroll',this.scrollLock);
							
						}
					},
					
					unlockScroll: function(){
						if(this.scrollLock!=undefined) {
							// disable scrollLock
							$(window).unbind('scroll',this.scrollLock);
							this.scrollLock = undefined;
						}
					},
					
					// scroll to top of active hole
					scroll:function(e) {
						var $this = $.glass;
						
						if($this.scrollTop != 0 && $this.scrollElement != undefined) 
							$this.scrollElement.animate({scrollTop: $this.scrollTop}, Appanel.milli("animate"));
						
						if(e!=undefined) 
							e.stopPropagation();
					},
					
					clicking: false,
					
					/**
					 * Show glass
					 * 
					 * @param context is glassOptions
					 */
					show: function(context) {
						
						var cssHide = {
								opacity: 0,
								backgroundColor: 'transparent'
							},
							glass = this.glass === undefined ? this.glass = Appanel.router.append('<div id="glass" class="hidden on-top-left fit-width fit-height">&nbsp;</div>').find('div#glass').sweep({
								on: onShow,
								sweep: [{
									// before show
									remove: 'hidden',
									css: $.extend({},cssHide),
									duration: 0.01,
									// show
									sweep:[{
										csstrans: true,
										css: $.extend({},cssHide),
										duration: 1,
										run: function() {
											var options = $.glass.context;
											this.css.backgroundColor = options.color;
											this.css.opacity = options.opacity;
											this.duration = options.duration;
										}
									}]
								},
								
								{
									on: onHide,
									sweep: [{
										// before hide
										css: {opacity: context.opacity},
										duration: 0.01,
										run: function(){
											this.css.opacity = $.glass.context.opacity;
										},
										// hide
										sweep:[{
											csstrans: true,
											css: cssHide,
											duration: 1,
											run: function(){
												this.duration = $.glass.context.duration;
											},
											// after hide
											sweep:[{
												add:'hidden',
												duration: 0.01,
												run: function(){
													$.glass.hidden();
												}
											}]
										}]
									}]
								}
								]
							}) : this.glass,
							$target = $(context.hole);
						
						// set active context
						if(this.context!==undefined && context.hole.glassID !== this.context.hole.glassID) {
							this.deglass(this.context,false);
							context.alreadyShow = true;
						}else{
							context.alreadyShow = false;
						}
						this.context = context;
						
						// send glass to container
						if(typeof context.container === 'string') {
							context.container = $(context.container);
						}
						context.container.append(glass);
						
						// when click on a glass
						if(typeof(context.onclick) === 'function') {
							// always forward click to specified function
							glass.on(Appanel.type.click, function(){
								context.onclick.call(context);
							});
						}
						
						// mark to know showing
						this.showing = true;
						
						// scroll lock at first
						if(context.scrollLock) {
							this.lockScroll();
						}else{
							this.unlockScroll();
						}
						
						// show before animation of hide is ended then immediate end.
						if(this.bindedOn) {
							//this.top.unbind(this.bindedOn,this.bindedFn);
							this.bindedOn = false;
							this.bindedFn();
						}
						
						// register parent for active hole
						this.scrollElement = context.container;
						
						// send glass and hole to specified layer
						glass.addClass('layer-' + context.layer);
						if(context.elementLayer !== false) {
							$target.addClass('layer-' + context.elementLayer);
						}
						
						// demark the in progress after animation is end
						var $this = this;
						setTimeout(function(){
							$this.showing = false;
						}, Appanel.milli(context.duration));
						
						// play trasition
						glass.triggerHandler(onShow);
						
					},
					
					/**
					 * add context to stack and then show the glass
					 *  
					 * @param context is glassOptions
					 */
					englass:function(context) {
						
						var
							hole = context.hole,
							hindex = hole.glassID;
						
						// hole already in stack then remove unused item
						if(hindex !== undefined) {
							//if(hindex != this.stack.length -1) {
								// remove unused hole
								// this.unused(hindex);
								this.deglass(context,false);
							//}
							// hole that's already on top of stack means to resize only, nothing to do here
						} 
						
						// new hole then mark it
						// it's new hole then keep it on top of stack
						hole.glassID = this.stack.length;
						this.stack.push(hole);
						
						// show glass depending on context
						this.show(context);
						
					},	// end of englass function
					
					/**
					 * Remove passed hole and stack that casecading to passed hole 
					 * 
					 * @param element hole this element will remove from hole stack and may be englass again for last remainning hole, this will ignored when hole is't in stack stack.
					 */
					deglass:function(context,hide) {
						
						// find hole in stack
						var
							hole = context.hole,
							hindex = hole.glassID;
							
						// ignore unknow hole
						if(hindex == undefined) {
							return;
						}
						
						// mark to know this is new hole
						hole.glassID = undefined;
						
						// send glass and hole to layer before change
						this.glass.removeClass('layer-'+context.layer);
						if(context.elementLayer !== false) {
							$(hole).removeClass('layer-'+context.elementLayer);
						}
						
						// switch off the click
						this.glass.off(Appanel.type.click);
						
						// remove unused hole
						this.unused(hindex);
						
						// englass last remainning
						if(this.stack.length>0) {
							var last = this.stack.pop();
							last.glassID = undefined;
							this.englass(last.glassOptions);
						}
						
						// no remainning will hide
						else if(hide !== false) {
							this.hide(context);
						}
						
					},	// end of deglass function 
					
					/**
					 * Remove unused hole.
					 */
					unused:function(hindex) {
						var remove = this.stack.length - hindex;
						while(remove-->0) this.stack.pop();
					},
					
					/**
					 * Binding event animationEnd after hide
					 */
					hidden: function(){
						
						// run once
						this.hiding = false;
						
						// move from parent to body
						if(!this.glass.parent().is(Appanel.router)) {
							Appanel.router.append(this.glass);
						}
						
						// unlock scroll
						$this.unlockScroll();
						
					},
					
					hiding: false,
					
					/**
					 * Direct command to force hide all glass and remove remainning stack.
					 */
					hide: function(context) {
						
						// avoid error that occur when call hide before show.
						if(this.glass == undefined || this.hiding) return;
						
						// mark to know hiding
						this.hiding = true;
						
						// reset environtment of active hole
						this.scrollTop = 0;
						this.scrollElement = undefined;
						
						// after glass became hidden, use run function in sweep object instead line below
						// setTimeout(this.hidden, Appanel.milli(context.duration));
						
						// play trasition
						this.glass.triggerHandler(onHide);
						
						// remove remainning stack
						for(var i in this.stack) {
							this.stack[i].glassID = undefined;
						}
						this.stack = [];
						
					}, // end of hide function
					
					showing: false

			};
			
		}
		
		// start of $(select).glass(cmd)
		var context,
			hole = this.first().get(0);
		
		// command
		if(typeof(cmd)=='string') { 
			
			//-- options is already in hole
			context = hole.glassOptions;
			if(context==undefined) {
				context = $.extend({},defaults);
				context.hole = hole;
				hole.glassOptions = context;
			}
			
			// reglass
			if(cmd=='refresh') {
				$.glass.englass(context);
			}
			
			// deglass
			else if(cmd=='remove') {
				$.glass.deglass(context);
				//-- after hide glass then release focus to a page
				Appanel.window.focus();
			}
			
			// hide
			else if(cmd=='removeall') {
				$.glass.hide();
				$.glass.unused(0);
				//-- after hide glass then release focus to a page
				Appanel.window.focus();
			}
			
		}else{
			
			// without options
			if(cmd==undefined) {
				context = hole.glassOptions;
				if(context==undefined) {
					context = $.extend({},defaults);
				}
			} else {
				context = $.extend({},defaults,cmd);
			}
			
			// ISSUE: transparent element in IE might be hidden instead, avoid using opacity(0) and transparent color
			if(context.opacity < 0.05 || context.color === "transparent") {
				context.color = "red";
				context.opacity = 0.05;
			}
			
			// keep options in hole
			context.hole = hole;
			hole.glassOptions = context;
			
			// if(context.debug!=undefined) $.glass.enableDebug();
			// if($.glass.debug) $.glass.toSource(context);
			
			// create and show glass
			$.glass.englass(context);
			
		}
		
		// jQuery style.
		return this;
		
	};
	
})(jQuery);