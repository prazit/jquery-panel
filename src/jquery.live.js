/*!
 * Load live content
 * 
 * Attributes that required on live content:
 * - src = URL of content to load
 * 
 * Take effect to the First element of selector.
 * 
 * @name live
 * @version 1.0.7
 * @requires jQuery v1.11+
 * 				jQuery ToTag
 * 				jQuery Sweep
 * @author Prazit Jitmanozot
 * 
 * Copyright (c) 2016 Prazit (R) Jitmanozot (http://Appanel.com)
 */
/**
 * Example: 
 * $('#livepanel').live();
 * $('#livepanel').live({options});
 */
(function($){
	
	// variables must be declare by var before use, for development only
	'use strict';

	$.fn.live = function(opt) {
		if(this.length==0) return this;
		
		if(opt===undefined) {
			opt = {};
		}
		
		var	options = $.extend({
				
				// selector of live contents, live contents will load when scroll near content div
				content: 'div.live',
				
				// selector of live iframes, live iframes will load when scroll near iframe div
				iframe: 'div.iframe',
				
				// selector of live images, live images will load when scroll near image div
				image: 'div.image',
				
				// margin scroll in pixels, use for content
				margin: 0,
				
				// trigger after live content is loaded, one call is per one content.
				// iframe and image does not have trigger, but the iframe can use onload attribute instead
				trigger: 'live:content',
				
				// jQuery object of parent scroller of the element
				scroller: false
				
			},opt);
		
		/**
		 * Handle scroll nearby to load.
		 */
		function handle($panel,$scroller,selector,loader,liveOptions) {
			$panel.find(selector).each(function(i,e){
				var $e = $(e);
				
				// there are have scroller then use jQuery InOut to load content only when it's scroll into screen.
				if($scroller!==false) {
				
					// handle scroll
					$e.one('inout:bottomin',function(){
						
						// remove element from scroller
						$scroller.inout('remove',$e);
						
						// load now
						if(liveOptions==undefined) {
							loader.call($e.get(0));
						}else{
							loader.call($e.get(0),liveOptions);
						}
						
					});
					
					// register element to scroller
					$scroller.inout($e,options.margin);
					
					// Appanel.th('log','live:handle: add element(' + $e + ') to inout with margin(' + options.margin + ')');
					
				}else{
					// load now
					if(liveOptions==undefined) {
						loader.call($e.get(0));
					}else{
						loader.call($e.get(0),liveOptions);
					}
				}
				
			});
		}
		
		/**
		 * Event: after load live content
		 * 
		 * Handle to load live child content.
		 * 
		 * this = panel element
		 */
		function live() {
			
			//-- required: Appanel Core CSS .scrollable 
			var $this = $(this),
				liveOptions = this.liveOptions,
				$scroller;
			
			if(liveOptions!==undefined) {
				//*-- debug --*/ console.log('load live contents : for '+liveOptions.content);
				$scroller = liveOptions.scroller;
				
				// handle other live content depending on options
				handle($this,$scroller,liveOptions.content,content,liveOptions);
				handle($this,$scroller,liveOptions.iframe,iframe);
				handle($this,$scroller,liveOptions.image,image);
			}
			
		}
		
		/**
		 * Immediate load live content.
		 * 
		 * this = panel element
		 */
		function content(liveOptions){
			var $e = $(this),
				src = $e.attr('src');
			if(typeof(src)==='string' && this.isLiveContent===undefined) {
				
				//*-- debug --*/ console.log('load live content : '+src);
				
				// it's live content
				this.isLiveContent = true;
				
				// show loading
				$e.addClass('hidden').after(Appanel.html.get("loading",{text:Appanel.language.loading}));
				
				// load now
				$e.load(src,function(ev){
					
					// Event: 'live:content' need bubble, you can access live-panel by event.target
					// Appanel.th('log','live:content:loaded: start bubble "'+liveOptions.trigger+'" from element('+$e+')');
					$e.trigger(liveOptions.trigger)

					// show me
					.fadeIn()
					.removeClass('hidden')
					
					// remove loading
					.next()
					.remove();
					
					// continue to load live child
					live.call(this);
					
				});
				
			}else{
				live.call(this);
			}
		}
		
		/**
		 * Immediate load live iframe.
		 * 
		 * this = panel element
		 */
		function iframe() {
			var $e = $(this),
				src = $e.attr('src');
			if(typeof(src)==='string' && this.isLiveIframe===undefined) {
				
				//*-- debug --*/ console.log('load live iframe : '+src);
				
				// it's live iframe
				this.isLiveIframe = true;
				
				// prepare and show loading
				var load = 'onload',
					onload = $e.attr(load);
				$e.attr(load, "$(this).removeAttr('" + load + "').fadeIn().prev().remove();" + (onload ? onload : "")).addClass('hidden').before(Appanel.html.get("loading",{text:Appanel.language.loading}));
				
				// load now by convert to iframe tag
				$e.toTag('iframe');
				
			}else{
				//*-- debug --*/ console.log('skip live iframe : '+src);
			}
		}
		
		/**
		 * Immediate load live image.
		 * 
		 * this = panel element
		 */
		function image() {
			var $e = $(this),
				src = $e.attr('src');
			if(typeof(src)==='string' && this.isLiveIframe===undefined) {
				
				//*-- debug --*/ console.log('load live image : '+src);
				
				// it's live iframe
				this.isLiveIframe = true;
				
				// load now by convert to img tag
				$e.toTag('img');
				
			}else{
				//*-- debug --*/ console.log('skip live image : '+src);
			}
		}
		
		// jQuery Style
	    return this.each(function(i,e){
	    	
	    	// keep options in DOM element
	    	e.liveOptions = options;
	    	
	    	// load now
	    	content.call(e,options);
	    	
	    });
	    
	};
	
})(jQuery);