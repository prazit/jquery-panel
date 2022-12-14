/*!
 * Drilldown is jQuery plugin, it's a part of Appanel Styler Suite.
 * Turn any listview/menu to animated drilldown listview.
 * 
 * First element only.
 * 
 * @name drilldown
 * @version 1.1.7
 * @author Prazit Jitmanozot
 * @requires	jQuery for Appanel
 * 				jQuery ToTag
 * 				jQuery Sweep
 * 				element: container of drilldown know as scroll pane.
 * 
 * Copyright (c) 2015 Prazit (R) Jitmanozot (http://Appanel.com)
 */
/* Example:
 *	$('.drilldown-container').drilldown({ options });
 *	$('.drilldown-container').drilldown(command);		// commands: home, next, back
 */
(function($){
	
	// variables must be declare by var before use, for development only
	'use strict';
	
	//-- jQuery Plugin
	$.fn.drilldown = function(opt){
		
		//-- constants
		var	nexthide	= 'drilldown:nexthide',		// target is the panel to hide
			nextshow	= 'drilldown:nextshow',		// target is the panel to show
			backhide	= 'drilldown:backhide',		// target is the panel to hide
			backshow	= 'drilldown:backshow',		// target is the panel to show
			prehide		= 'drilldown:prehide',		// target is the panel to hide, before nexthide and backhide
			preshow		= 'drilldown:preshow',		// target is the panel to show, before nextshow and backshow
			click		= 'click touchstart',
		
		//-- default options
		defaults = {
			
			//-- hidden class use to hide sub and also use in sweep
			hidden: 'hidden',
			
			//-- sub is selector of container of sub menu that use to check for sub menu avialable and use as sweep panel.
			// If src attribute is defined it's can automatic load Json-Items from server and create items using the item prototype option below.
			sub: '.sub',
			
			//-- buttons
			next: '.next',				// next is selector of next button, click on $(next) will go next (drilldown) 
			back: '.back',				// back is selector of back button, click on $(back) will go back (drillup)
			home: '.home',				// home is selector of home button, click on $(home) will go back to root (drilldown)
			
			//-- live content, this is liveOptions, see jQuery Live for detail
			live: {
				trigger: 'drilldown:live'
			},
			
			//-- use animation class for show and hide panels
			sweep: {
				
				//-- default duration for all sweep
				duration: 0.4,		// seconds
				
				//-- onNextIn,onNextOut,onBackIn and onBackOut are options of jQuery Sweep, see jQuery Sweep for detail
				
				// play on next, drilldown:nextshow for show and drilldown:nexthide for hide.
				onNextIn: {sweep:[{duration:0.02,css:{marginLeft:'100%'},remove:'hidden',sweep:[{duration:0.4,csstrans:true,css:{marginLeft:'0%'}}]}]},
				onNextOut: {sweep:[{duration:0.02,sweep:[{csstrans:true,css:{marginLeft:'-100%'},sweep:[{add:'hidden'}]}]}]},
				
				// play on back, drilldown:backshow for show and drilldown:backhide for hide.
				onBackIn: {sweep:[{duration:0.02,css:{marginLeft:'-100%'},remove:'hidden',sweep:[{duration:0.4,csstrans:true,css:{marginLeft:'0%'}}]}]},
				onBackOut: {sweep:[{duration:0.02,sweep:[{csstrans:true,css:{marginLeft:'100%'},sweep:[{add:'hidden'}]}]}]}
				
			}
			
		},		
		
		//-- main vars
		$panel = this.first(),
		options,root,container,
		history;				// history stack is stack of the sub include active sub at last position.
		
		//-- no element to do
		if($panel.length==0) {
			return this;
		}
		
		//-- run commands
		if(typeof(opt)=='string') {
			// now support command 'back' and 'home'
			$panel.triggerHandler('drilldown:'+opt);
			return this;
		}
		
		//-- or create drilldown
		options = $.extend({},defaults,opt);
		history = [];
		
		if(options.sweep===false) {
			// sweep is required
			options.sweep = defaults.sweep;
		}else{
			// protect original opt
			options.live = $.extend({},defaults.live,options.live);
			options.sweep = $.extend({},options.sweep);
			options.sweep.onNextIn = $.extend({},options.sweep.onNextIn);
			options.sweep.onNextOut = $.extend({},options.sweep.onNextOut);
			options.sweep.onBackIn = $.extend({},options.sweep.onBackIn);
			options.sweep.onBackOut = $.extend({},options.sweep.onBackOut);
		}
		
		/**
		 * Initial sweep option
		 */
		function init(sweeper,type) {
			// duration
			if(sweeper.duration==undefined) 
				sweeper.duration= options.sweep.duration!=undefined?options.sweep.duration:.358;
			// on
			sweeper.on = type;
			// hidden class is needed
			sweeper.hidden = options.hidden;
			// debug
			if(options.debug!=undefined)
				sweeper.debug = true;
		}
		
		//-- sweep option is shared between sub.
		init(options.sweep.onBackOut,backhide);
		init(options.sweep.onBackIn,backshow);
		init(options.sweep.onNextOut,nexthide);
		init(options.sweep.onNextIn,nextshow);
		var sweepOpt = $.extend({},options.sweep.onBackOut);
		if(sweepOpt.sweep==undefined) sweepOpt.sweep = [];
		sweepOpt.sweep.push(options.sweep.onBackIn);
		sweepOpt.sweep.push(options.sweep.onNextOut);
		sweepOpt.sweep.push(options.sweep.onNextIn);
		
		//-- stack need root
		if(history.length==0) {
			root = $panel;			// root is first element on selector
			history.push(root);
			
			//-- container is parent of root, it must be relative position to support sub panel with absolute position
			container = root.parent();
			container.css({
				position: 'relative',
				overflow: 'hidden',
				/*width: '100%',
				height: '100%',*/
				padding: 0,
				margin: 0
			});
		}else{
			root = history[0];				// root is first element in history
			
			//-- container is needed
			container = root.parent();		// container is parent of root
		}
		
		/**
		 * Prevent default action of event
		 */
		function prevent(event) {
			if(typeof(event.preventDefault)=='function')
				event.preventDefault();
		}
		
		/**
		 * Command: home
		 */
		function goHome() {
			if(history.length>1) {
				
				var	last = history.pop(),
					active = root;			// move root to active
				
				// reset history
				history = [];
				history.push(active);
				
				// play sweep
				if(last!=active) {
					
					// hide before backhide
					last.triggerHandler(prehide);
					
					// show before backshow
					active.triggerHandler(preshow);
					
					// play sweep
					last.triggerHandler(backhide);
					active.triggerHandler(backshow);
					
				}
				
			}
		}
		
		/**
		 * Command: back
		 */
		function goBack() {
			if(history.length>1) {
				
				var	last = history.pop(),
					active = history.pop();
				
				if(active!=undefined) {
					
					// add to history stack
					history.push(active);
					
					// hide before backhide
					last.triggerHandler(prehide);
					
					// show before backshow
					active.triggerHandler(preshow);
					
					// play sweep
					last.triggerHandler(backhide);
					active.triggerHandler(backshow);
					
				}else{
					// no active no movement, add it back to history stack
					history.push(last);
				}
				
			}
		}
		
		/**
		 * Event: After Live content is loaded, then continue to handle drilldown actions.
		 * 
		 * this = DOM element of live panel
		 */
		function live() {
			
			//*-- debug --*/ console.log('drilldown.live has called');
			
			//-- hide sub panels then handle action buttons
			var panel = $(this);
			panel.find(options.sub).addClass(options.hidden);
			handleActions(panel);
			
			// event: live content is loaded
			// Appanel.th('log','call "'+options.live.utrigger+'" on drilldown-panel('+panel+')');
			panel.trigger(options.live.utrigger);
			
		}
		
		/**
		 * Request iframe to load
		 * 
		 * this = the jQuery Object of iframe
		 */
		function iframe() {
			var iframe = this;
			
			// delay load iframe
			setTimeout(function(){
				
				// iframe class is no need now
				iframe.removeClass(options.iframe);
				
				// need src to load iframe
				if(iframe.attr('src')!=undefined) {
					
					// change tag to iframe
					iframe.toTag('iframe').css({
						padding:0,
						border:0,
						/*
						margin:0,
						height:'100%',
						width:'100%'
						*/
					});
					
				}
				
			}, Appanel.milli(options.sweep.onNextIn.duration));
			
		}
		
		function handleActions($e) {
			
			//-- handle next buttons
			$e.find(options.next).each(function(i,next){
				if(next.isDrilldownNext==undefined) {
					next.isDrilldownNext = true;
					$(next).on(click,function(ev){
						
						// prevent default event
						prevent(ev);
						
						var	last = history.pop(),
							active = false;
						
						// register at first activate
						if(this.drilldownSub==undefined) {
							
							// need sub
							var subs = $(this).siblings(options.sub); 
							if(subs.length==0) return;
							
							// first element only
							active = subs.first();
							
							// handle
							handle(active);
							
							// link to sub
							this.drilldownSub = active;
							
							// load live content
							/*{ //-- debug
								var liveoptions = '';
								$.each(options.live,function(n,v){
									liveoptions += ', '+n+':'+v;
								});
								Appanel.th('log','drilldown:handleActions:next: start live content on active('+active+') with live-options('+liveoptions.substring(1)+')');
							}*/
							options.live.scroller = active;
							active.live(options.live);
							
						}else{
							active = this.drilldownSub;
						}
						
						// skip same action that occur when user double click on next button in Firefox and IE (chrome is not).
						if(last.is(active)) {
							history.push(last);
							//*-- debug --*/ console.log('skip '+ev.target);
							return;
						}
						
						// add to history stack
						history.push(last);
						history.push(active);
						
						// before nexthide and nextshow
						last.triggerHandler(prehide);
						active.triggerHandler(preshow);
						
						// play sweep for nexthide and nextshow
						last.triggerHandler(nexthide);
						active.triggerHandler(nextshow);
						
					});
				}
			});
				
			//-- handle home buttons
			$e.find(options.home).each(function(i,home){
				if(home.isDrilldownBack==undefined) {
					home.isDrilldownBack = true;
					$(home).on(click,function(ev){
						
						// prevent default event
						prevent(ev);
						
						// go home
						goHome();
						
					});
				}
			});
			
			//-- handle back buttons
			$e.find(options.back).each(function(i,back){
				if(back.isDrilldownBack==undefined) {
					back.isDrilldownBack = true;
					$(back).on(click,function(ev){
						
						// prevent default event
						prevent(ev);
						
						// go back
						goBack();

					});
				}
			});
			
			//-- handle triggers
			$e.on('drilldown:home',goHome).on('drilldown:back',goBack);
			
		}
		
		/**
		 * Register element to drilldown
		 */
		function handle($e) {
			
			var e = $e.get(0);
			
			//-- create drilldown if it's necessary
			if(e.isDrilldown==undefined) {
				
				//-- mark to skip this creation at next time
				e.isDrilldown = true;
				e.drilldownOptions = options;
				e.drilldownHistory = history;
				
				//-- hide sub panels for root
				if(e.isDrilldownRoot = $e.is(root)) {
					
					// hide sub panels
					$e.find(options.sub).addClass(options.hidden);
					
					//-- trigger is internal and usertrigger is external, both are required
					options.live.utrigger = options.live.trigger;
					options.live.trigger += 'd';
					
					// listen: 'live:content' on container
					// Appanel.th('log','drilldown:handle: listen "'+options.live.trigger+'" on drilldown-container('+container+')');
					container.on(options.live.trigger,function(ev){
						// Appanel.th('log','drilldown:handle: "'+ev.type+'" is received');
						live.call(ev.target);
						ev.stopPropagation();
					});
					
				}
				
				//-- move sub panel to container 
				else { 
					container.append($e);
				}
				
				//-- drilldown panel become absolute position to fit container
				//-- register sweep before handle actions
				handleActions($e.css({
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					padding: 0,
					margin: 0
				}).sweep(sweepOpt));
				
			}// end of handled
			
		}// end of handle function
		
		//-- handle panel
		handle($panel);
		
		//-- return jQuery Style
		return this;
	};
	
})(jQuery);