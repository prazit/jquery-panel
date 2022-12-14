/*!
 * Panel is jQuery plugin, it's a part of Appanel Styler Suite.
 * Turn any element to animated panel.
 * 
 * Take effect to the First element of selector.
 * 
 * @name panel
 * @version 1.2.4
 * @author Prazit Jitmanozot
 * @requires	jQuery for Appanel
 * 				jQuery Live
 * 				jQuery Sweep
 * 				jQuery Glass
 * 
 * Copyright (c) 2015 Prazit (R) Jitmanozot (http://Appanel.com)
 */
/* Example:
 *	Left Panel>		$('.target').panel({ position:'left', duration:2 });
 *	Right Panel>	$('.target').panel({ position:'right', duration:2 });
 *	Center Panel>	$('.target').panel({ position:'top', duration:2 });
 *	Show Panel>		$('.target').panel('show');
 *	Hide Panel>		$('.target').panel('hide');
 */
(function($){
	
	// variables must be declare by var before use, for development only
	'use strict';
	
	$.fn['panel'] = function(cmd){
		
		//-- defaults
		var dfGlass = { // default is transparent glass that can close panel when click outside panel, see jQuery Glasses for detail
				color: 'transparent'
			},
			defaults = {
				
				//-- panel appearance
				position: 'right',	// left, right or top, bottom
				fixed: false,
				// left: 0,			// left in pixels is used when position is top or bottom, leave it's undefined to use default center. 
				width: false,		// width in pixels, false = width:100%
				height: false,		// height in pixels, false = height:100%
				
				//-- speed of animation show/hide
				duration: .4,		// seconds
				
				//-- pull document from left or right depending on position left or right, other position are ignored
				pull: false,		// hard or soft, true=hard, false=disabled
				pullthis: 'body',
				container: 'body',
				
				//-- show glass under panel this is jQuery Glasses Options, see jQuery Glasses for detailed
				glass: dfGlass,
				
				//-- use animation class instead of transition auto
				sweep: false, 			// false to use default animation, when sweep is defined the css hidden class is required.
				/*{ 
					onShow: {sweep:[]},	// this is jQuery Sweep Options on show event of panel, see jQuery Sweep for detailed
					onHide: {sweep:[]}	// this is jQuery Sweep Options on hide event of panel, see jQuery Sweep for detailed
				},*/
				
				//-- load live content after show at the first time
				live: false,		// this is jQuery Live Options, see jQuery Live for detailed
				
				//-- init all entries
				entry: false,		// this is jQuery Entry Options, see jQuery Entry for detailed
				
				//-- triggers for show and hide
				trigger: false,
				/*{
					show: {
						selector: '.panel-open',	// select is required
						on: 'click touchstart'		// on is optional types, default = 'click touchstart'
					},
					hide: {
						selector: '.panel-close',	// select is required
						on: 'click touchstart'		// on is optional types, default = 'click touchstart'
					}
				}*/
				
				//-- do command after create panel
				command: ''			// true will show and false will hide using transition duration
				
			},
			options = defaults,
			command,
			
		// constants
		preShow = 'panel:preshow',
		preHide = 'panel:prehide';
		
		//-- command or options
		if(typeof(cmd)=='string') {
			command = cmd;
		}else{
			options = $.extend({},defaults,cmd);
			command = options.command;
		}
		
		//-- width and height
		function positive(width) {
			return width?(typeof(width)=='string'&&width.search('[autoempxvwt%]')>=0?width:width+'px'):'100%';
		}
		function negative(width) {
			var d = width.search('[0-9]');
			return d>=0?width.substring(0,d)+'-'+width.substring(d):width;
		}
		options.width = positive(options.width);
		options.height = positive(options.height);
		
		//-- return jQuery Style
		return this.first().each(function(i,e){
			
			var $e = $(e);
			
			//-- create panel if it's necessary
			if(e.isPanel==undefined) {
				
				//-- mark to skip this init on the next time
				e.isPanel = true;
				
				var css = {
						position:options.container=='body'?'fixed':'absolute',
						width: options.width,
						height: options.height
					},
					onShow = 'panel:show',
					onHide = 'panel:hide',
					onSweepHide = 'sweep:hide',	// remove glass
					zIndex = $e.css('z-index'),
					$container = $(options.container),
					panelShow, panelHide, show, hide;
				
				//-- z-index is needed
				if(zIndex==undefined||zIndex=='auto'||zIndex==0) {
					css.zIndex = 78888;
				}
				
				//-- sweep for show and hide
				if(options.sweep) {
					
					// hidden first by class
					$e.addClass('hidden');
					
					// use specified sweep
					show = $.extend({},options.sweep.onShow);
					hide = $.extend({},options.sweep.onHide);
					
					// always appear in screen
					css.maxWidth = '100%';
					css.maxHeight = '100%';
					
					//-- panel position is fixed
					if(options.position=='left') {
						css.left = 0;
						css.top = 0;
					}else if(options.position=='right') {
						css.right = 0;
						css.top = 0;
					}else if(options.position=='top') {
						if(options.left==undefined) {
							css.left = '50%';
							css.marginLeft = 'calc( -1 * ('+ options.width +' / 2) )';
						}else{
							css.left = options.left+'px';
						}
						css.top = 0;
					}else if(options.position=='bottom') {
						if(options.left==undefined) {
							css.left = '50%';
							css.marginLeft = 'calc( -1 * ('+ options.width +' / 2) )';
						}else{
							css.left = options.left+'px';
						}
						css.bottom = 0;
					}else{ // otherwise are 'center' (dialogue)
						css.top = '50%';
						css.left = '50%';
						if(options.width === '100%') {
							css.width = 'auto';
						}
						if(options.height === '100%') {
							css.height = 'auto';
						}
						css.transform = 'translate(-50%,-50%)';
					}
					
				}else{
					
					var	negativeWidth = negative(options.width),
						negativeHeight = negative(options.height),
						fixed = -50;
					
					if(options.position=='left') {
						panelHide = {left: options.fixed ? fixed : negativeWidth};
						panelShow = {left: 0};
						css.maxWidth = '100%';						
						css.left = panelHide.left;
						css.top = 0;
					}else if(options.position=='right') {
						panelHide = {right: options.fixed ? fixed : negativeWidth};
						panelShow = {right: 0};
						css.maxWidth = '100%';
						css.right = panelHide.right;
						css.top = 0;
					}else if(options.position=='top') {
						panelHide = {top: options.fixed ? fixed : negativeHeight};
						panelShow = {top: '0'};
						if(options.left==undefined) {
							css.left = '50%';
							css.marginLeft = 'calc( -1 * ('+ options.width +' / 2) )';
						}else{
							css.left = options.left+'px';
						}
						css.top = panelHide.top;
					}else if(options.position=='bottom') {
						panelHide = {bottom: options.fixed ? fixed : negativeHeight};
						panelShow = {bottom: '0'};
						if(options.left==undefined) {
							css.left = '50%';
							css.marginLeft = 'calc( -1 * ('+ options.width +' / 2) )';
						}else{
							css.left = options.left+'px';
						}
						css.bottom = panelHide.bottom;
					}else{ // otherwise is center dialogue
						panelHide = {top: '150%',opacity: 0};
						panelShow = {top: '50%',opacity: 1};
						css.left = '50%';
						if(options.width === '100%') {
							css.width = 'auto';
						}
						if(options.height === '100%') {
							css.height = 'auto';
						}
						css.top = '150%';
						css.opacity = 0;
						css.transform = 'translate(-50%,-50%)';
					}
					
					// use basic sweep 
					show = {
						sweep:[{
							csstrans: true,
							css: panelShow
						}]
					};
					hide = {
						sweep:[{
							csstrans: true,
							css: panelHide
						}]
					};
					
				}
				
				//-- move to container and apply the initialized styles
				if(!$container.is($e.parent())) $container.append($e);
				$e.css(css);
				
				//-- pull the body, add into show and hide
				if(options.pull && options.position.search("left|right")==0) {
					
					var	pullShow,pullHide,toShow,toHide,
						width = options.width,
						hard = options.pull!='soft';
					
					if(hard) {
						// hard pull
						if(options.position=='left') {
							pullShow = {marginLeft: width,marginRight:'-'+width};
							pullHide = {marginLeft: 0,marginRight: 0};
						}else{ //if(options.position=='right') {
							pullShow = {marginRight: width,marginLeft:'-'+width};
							pullHide = {marginRight: 0,marginLeft: 0};
						}
					}else{
						// soft pull
						if(options.position=='left') {
							pullShow = {marginLeft: width};
							pullHide = {marginLeft: 0};
						}else{ //if(options.position=='right') {
							pullShow = {marginRight: width};
							pullHide = {marginRight: 0};
						}
					}
					
					// add to sweep of show and hide
					toShow = {
						selector: options.pullthis,
						duration: options.duration,
						csstrans: true,
						css: pullShow
					};
					toHide = $.extend({},toShow);
					toHide.css = pullHide;
					if(show.sweep==undefined) {
						show.sweep = [toShow];
					}else{
						show.sweep.unshift(toShow);
					}
					if(hide.sweep==undefined) {
						hide.sweep = [toHide];
					}else{
						hide.sweep.unshift(toHide);
					}
					
				}				
				
				//-- start the use of sweep, jQuery Sweep is required
				
				// sweep on show and hide
				show.on = onShow;
				hide.on = onHide;
				
				// sweep need duration
				if(show.duration==undefined) show.duration = options.duration;
				if(hide.duration==undefined) hide.duration = options.duration;
				
				// panel state (show or hide)
				show.run = function() {
					this.$[0].panelState = "show";
				};
				hide.run = function() {
					this.$[0].panelState = "hide";
				};
				
				// lets sweep work for show and hide
				$e.sweep(show).sweep(hide);
				
				//-- end of sweep
				
				//-- entry fields, jQuery Entry is required
				if(options.entry) {
					$e.entry(options.entry);
				}
				
				//-- live content, jQuery Live is required
				if(options.live) {
					$e.one(onShow,function(){
						$e.live(options.live);
					});
				}
				
				//-- triggers
				if(options.trigger!=undefined) {
					if(options.trigger.show!=undefined) {
						var	show = options.trigger.show;
						$(show.selector).on(show.on==undefined?Appanel.type.click:show.on,function(){
							$e.triggerHandler(preShow);
							$e.triggerHandler(onShow);
						});
					}
					if(options.trigger.hide!=undefined) {
						var	hide = options.trigger.hide;
						$(hide.selector).on(hide.on==undefined?Appanel.type.click:hide.on,function(){
							$e.triggerHandler(preHide);
							$e.triggerHandler(onHide);
						});
					}
				}
				
				//-- handlers to manage glass, jQuery Glasses is required
				if(options.glass) {
					var
						glass = typeof(options.glass) == 'object' ? $.extend({},dfGlass,options.glass) : $.extend({},dfGlass);
					
					// duration is inherited
					if(glass.duration==undefined) {
						glass.duration = options.duration;
					}
					
					// container of glass
					if(glass.container==undefined) {
						if(options.pullthis==undefined) {
							glass.container = options.container;
						}else{
							glass.container = options.pullthis;
						}
					}
					
					$e.on(onShow,function(){
						$e.glass(glass);
					});
					
					$e.on(onHide+' '+onSweepHide,function(){
						$e.glass('remove');
					});
				}
				
				//-- do show command
				if(command=='show') {
					$e.triggerHandler(preShow);
					$e.triggerHandler(onShow);
				}
				
				//-- first time only
				return;
				
			}
			
			//-- do command
			if(command!='') {
				$e.triggerHandler('panel:pre'+command);
				$e.triggerHandler('panel:'+command);
			}
			
		});
	};
	
})(jQuery);