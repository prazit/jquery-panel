/*!
 * Folder is jQuery plugin, it's a part of Appanel Styler Suite.
 * Turn any content into the animated inline panel that can show more or less.
 * 
 * @name folder
 * @version 1.1.0
 * @author Prazit Jitmanozot
 * @requires	jQuery for Appanel
 * 				jQuery ToTag
 * 				jQuery Sweep
 * 
 * Copyright (c) 2016 Prazit (R) Jitmanozot (http://Appanel.com)
 */
/* Example: the foldable element must always be hidden at first. 
 *	$('.folder').folder({ options });
 *	$('.folder').folder(command);		// commands: open, close
 *
 * If you want to do something when a folder is open please do it onclick of the open-button in a folder, you can do the same for close.
 */
(function($){
	
	// variables must be declare by var before use, for development only
	'use strict';
	
	//-- auto increment ID for folders, debug only.
	// $.folderID = 0;
	
	//-- jQuery Plugin
	$.fn.folder = function(opt){
		
		// command type
		var	type = false,
			jQontext = !type,
		
		// constants
		folderOpen = 'folder:open',
		folderClose = 'folder:close',
		click = 'click touchstart';
		
		// init type and jQontext
		if( typeof opt === 'string' ) {
			type = opt;
		}else{
			if(opt === undefined) {
				opt = {};
			}else if(opt.context instanceof jQuery) {
				jQontext = opt.context;
				var i,
					length = jQontext.length,
					thisLength = this.length;
				for(i=0; i<thisLength; i++) {
					jQontext[i+length] = this[i];
				}
				jQontext.length += thisLength;
			}
		}
		if(jQontext === true) {
			jQontext = this;
		}
		
		/**
		 * Prevent default action of event
		 */
		function prevent(event) {
			if(event===undefined) {
				return;
			}
			if(typeof(event.preventDefault)=='function') {
				event.preventDefault();
			}
			if(typeof(event.stopPropagation)=='function') {
				event.stopPropagation();
			}			
		}
		
		/**
		 * play sweep of close.
		 */
		function close(ev) {
			
			prevent(ev);
			
			var folderOptions = this.folderOptions,
				onClose = folderOptions.sweep.onClose,
				sweep;
			
			// don't close again
			if(!folderOptions.isOpen) {
				return;
			}
			
			// handle first
			if(onClose.handled==undefined) {
				onClose.handled=true;
				onClose.foldable.on = folderClose;
				
				sweep = [];
				if(folderOptions.open.length>0) {
					onClose.open.selector = folderOptions.open;
					if(onClose.open.duration==undefined) {
						onClose.open.duration = folderOptions.duration;
					}
					sweep.push(onClose.open);
				}
				if(folderOptions.close.length>0) {
					onClose.close.selector = folderOptions.close;
					if(onClose.close.duration==undefined) {
						onClose.close.duration = folderOptions.duration;
					}
					sweep.push(onClose.close);
				}
				if(sweep.length>0) {
					onClose.foldable.sweep = sweep;
				}
				
				//*--debug--*/ var index = folderOptions.id; folderOptions.foldable.on(folderClose,function(){console.log(folderClose+' '+index);});
				
				folderOptions.foldable.sweep(onClose.foldable);
			}
			
			// must know this folder is closed
			folderOptions.isOpen = false;
			
			// play close
			folderOptions.foldable.triggerHandler(folderClose);
			
		}
		
		/**
		 * play sweep of open.
		 * 
		 * this = element of trigger that contain folderOptions
		 */
		function open(ev) {
			
			prevent(ev);
			
			var folderOptions = this.folderOptions,
				onOpen = folderOptions.sweep.onOpen,
				sweep;
			
			// don't open again
			if(folderOptions.isOpen) {
				return;
			}
			
			// handle first
			if(onOpen.handled==undefined) {
				onOpen.handled=true;
				onOpen.foldable.on = folderOpen;
				
				sweep = [];
				if(folderOptions.open.length>0) {
					onOpen.open.selector = folderOptions.open;
					if(onOpen.open.duration==undefined) {
						onOpen.open.duration = folderOptions.duration;
					}
					sweep.push(onOpen.open);
				}
				if(folderOptions.close.length>0) {
					onOpen.close.selector = folderOptions.close;
					if(onOpen.close.duration==undefined) {
						onOpen.close.duration = folderOptions.duration;
					}
					sweep.push(onOpen.close);
				}
				if(sweep.length>0) {
					onOpen.foldable.sweep = sweep;
				}

				
				//*--debug--*/ var index = folderOptions.id; folderOptions.foldable.on(folderOpen,function(){console.log(folderOpen+' '+index);});
				
				folderOptions.foldable.sweep(onOpen.foldable);
				
				// load live foldable
				setTimeout(function() {
					folderOptions.foldable.live(folderOptions.live);
				},onOpen.foldable.duration);
			}
			
			// play close on opening folders
			if(folderOptions.single) {
				// close all
				folderOptions.context.each(function(i,e){
					if(e.folderOptions.isOpen) {
						close.call(e);
					}
				});
			}
			
			// must know this folder is open
			folderOptions.isOpen = true;
			
			// play open
			folderOptions.foldable.triggerHandler(folderOpen);
			
		}
		
		/**
		 * Play toggle transition on opacity of element.
		 * 
		 * called from sweepPlayer
		 */
		function toggleOpacity(e) {
			$(e).animate({opacity:'toggle'}, Appanel.milli(e.folderOptions.duration));
		}
		
		/**
		 * Play toggle transition on height of element.
		 * 
		 * called from sweepPlayer
		 */
		function toggleHeight(e) {
			$(e).animate({height:'toggle'}, Appanel.milli(e.folderOptions.duration));
		}
		
		/**
		 * Handle new folder
		 */
		function handle(element) {
			
			// mark to skip this handle next time
			element.isFolder = true;
			
			// handle open button and close button
			// extend options to new object, 1 folderOptions is for 1 folder.
			var $e = $(element),
				sweeper = {
					foldable: {
						run: toggleHeight
					},
					open: {
						run: toggleOpacity
					},
					close: {
						run: toggleOpacity
					}
				},
				folderOptions = $.extend(
					{ /* defaults */
						
						// true = open one folder at a time, false = multiple open
						single: false,
						
						// selectors are relative to active folder element
						sub: '.folder',				// create live folder after live content is loaded called sub folder
						foldable: '.foldable',		// foldable element that can expand(open) and collapse(close)
						open: '.open',				// open button
						close: '.close',			// close button
						
						//-- live content, this is liveOptions, see jQuery Live for detail
						live: {
							trigger: 'folder:live'
						},
						
						// duration is needed by sweep
						duration: 0.4,
						
					},
					opt,
					{
						
						/*------ reserved (no replaced) - using by folder system ------*/
						
						// jQuery Context use to group folders
						context: jQontext,
						
						// state
						isOpen: false
						
						// ID
						// id: ++$.folderID
						
					}
				);
			
			//-- sweeper need extend to protect original
			folderOptions.sweep = opt.sweep===undefined ? {
				
				// play this sweep when click on open-button
				onOpen: $.extend({},sweeper),
				
				// play this sweep when click on close-button
				onClose: sweeper
					
			} : {
				
				// play this sweep when click on open-button
				onOpen: opt.sweep.onOpen === undefined ? $.extend({},sweeper) : $.extend({},sweeper,opt.sweep.onOpen),
				
				// play this sweep when click on close-button
				onClose: opt.sweep.onClose === undefined ? sweeper : $.extend(sweeper,opt.sweep.onClose)
				
			};
			
			//-- trigger is internal and usertrigger is external, both are required
			folderOptions.live.utrigger = folderOptions.live.trigger;
			folderOptions.live.trigger += 'd';
			
			// first item in context must handle subfolder on 'live' of container
			if($e.is(jQontext.first())) {
				$e.parent().on(folderOptions.live.trigger,{options:folderOptions},function(ev){
					
					//*-- debug --*/ console.log('folder receive "'+ev.type+'"');
					
					// create live/sub folder
					var folderOptions = ev.data.options,
						subOptions = $.extend({},opt),
						$e = $(ev.target),
						$sub = $e.find(folderOptions.sub);
					subOptions.context = undefined;
					$sub.folder(subOptions);
					//*-- debug --*/ console.log('create sub folder by $("'+subOptions.sub+'") length='+$sub.length);
					
					// event: 'folder:live'
					//*-- debug --*/ console.log('folder call event "'+folderOptions.live.utrigger+'"');
					$e.trigger(folderOptions.live.utrigger);
					
					// stop now
					ev.stopPropagation();
					
				});
			}
			
			// keep element in options called folder element
			folderOptions.element = element;
			
			// mark ignored sub-components before find main-components
			var marker = 'ignored',
				$marker = '.' + marker,
				$ignored = $e.find(folderOptions.sub + ' ' + folderOptions.foldable + ',' + 
							folderOptions.sub + ' ' + folderOptions.open + ',' + 
							folderOptions.sub + ' ' + folderOptions.close);
			$ignored.addClass(marker);
			
			// replace all selectors by jQuery object
			folderOptions.foldable = $e.is(folderOptions.foldable)?$e:$e.find(folderOptions.foldable).not($marker);
			folderOptions.open = $e.find(folderOptions.open).not($marker);
			folderOptions.close = $e.find(folderOptions.close).not($marker);
			
			// unmark ignored sub-components
			$ignored.removeClass(marker);
			
			// keep options in elements
			element.folderOptions = folderOptions;
			folderOptions.foldable.each(function(i,e){
				e.folderOptions = folderOptions;
			});
			folderOptions.open.each(function(i,e){
				e.folderOptions = folderOptions;
				$(e).on(click,open);
			});
			folderOptions.close.each(function(i,e){
				e.folderOptions = folderOptions;
				$(e).on(click,close);
			});
			
		}
		
		// return jQuery style
		return this.each(function(i,e){
			if(e.isFolder === undefined) {
				handle(e);
			}
			if(type) {
				if(type==='open') {
					open.call(e);
				}else if(type==='close') {
					close.call(e);
				}
			}
		});
		
	};
	
})(jQuery);