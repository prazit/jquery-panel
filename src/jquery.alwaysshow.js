/*!
 * Always Show is jQuery Plugin, it's part of Appanel Styler Suite.
 * This will always show the content when scroll page off them.
 * 
 * @name alwaysShow
 * @version 1.0.1
 * @requires jQuery v1+
 * @author Prazit Jitmanozot
 * 
 * Copyright (c) 2015 Prazit (R) Jitmanozot (http://Appanel.com)
 */
/* 
 * Syntax: $(selector).alwaysShow({options})
 */
(function($){
	
	// variables must be declare by var before use, for development only
	'use strict';

	$.fn.alwaysShow = function(cmd) {
		
		//-- default options
		var defaults = {
			backgroundColor: 'white'			// default background-color is 'white'
		};
		
		// ignore when has no element
		if(this.length==0) return this;
		
		// create alwaysshow object first.
		if(typeof($.alwaysshow)=='undefined')
			/**
			 * Always Show object stand within jQuery object.
			 */ 
			$.alwaysshow = {
				
				/**
				 * add item to this array will affect when switch is ON.
				 *  
				 * item[] = {
				 * 		element: {Element},
				 * 		position: 'position',
				 * 		top: 'top',
				 * 		width: 'width',
				 * 		background-color: 'color'
				 * }
				 */
				item: [],
				
				/**
				 * enabled = true means switch is ON, otherwise means switch is OFF. 
				 */
				enabled: false,
				
				/**
				 * index of active item
				 */
				active: -1,
				
				/**
				 * Add element item
				 * 
				 * @param {Element} e
				 */
				add: function(e) {
					
					// add item
					this.item.push(e);
					
					// make sure switch is ON.
					this.on();
					
					// try to show new item
					this.scroll();
					
				},
				
				/**
				 * Remove element item
				 * 
				 * @param {Element} e
				 */
				remove: function(e) {
					var
						index = $(e).data("alwaysshow");
					
					// ignore unknow element
					if(typeof(index) == undefined) return;
					
					// mark for know as new
					else $(e).removeData("alwaysshow");
					
					// remove unused item
					var remove = this.item.length - index;
					while(remove-->0) this.item.pop();
					
					// switch off when no remaining item
					if(this.item.length==0) this.off();
				},
				
				/**
				 * Switch ON
				 */
				on: function() {
					if(!this.enabled) {
						this.enabled = true;
						$(window).bind('scroll resize', this.scroll);
					}
				},
				
				/**
				 * Switch OFF
				 */
				off: function() {
					if(this.enabled) {
						this.enabled = false;
						$(window).unbind('scroll resize', this.scroll);
					}
				},
				
				/**
				 * Event: when window scroll or resize
				 * 
				 * @param {Element} e
				 */
				scroll: function(e) {
					var
						top = $(window).scrollTop();
					
					
				},
				
				/**
				 * Set active item by index of item, this function will set related css only (not add item).
				 * 
				 * @param int index the index of item that want state become active.  
				 */
				show: function(index) {
					
					// hide active item
					this.hide();
					
					// save related css that use to restore later
					
					
					// set related css
					
					
				},
				
				/**
				 * Hide active item, this function will restore related css only (not remove item)
				 */
				hide: function() {
					if(active >= 0) {
						
						// active item
						var
							item = this.item[this.active];
						
						// restore css
						item.element.css({
							position: item.position,
							top: item.top,
							width: item.width,
							backgroundColor: item.backgroundColor
						});
						
						// reset active
						this.active = -1;
						
					}
				}
				
			};
		
		//-- start of $(select).alwaysshow(cmd)
		return this.each(function(i,e){
			
			var
				options;
			
			// without options
			if(cmd==undefined) {
				options = e.alwaysshowopts;
				if(options==undefined) {
					options = defaults;
					e.alwaysshowopts = options;
				}else{
					options = $.extend({},defaults,options);
				}
				$.alwaysshow.add(e);
			}
			
			// with options
			else if(typeof(cmd)=='object') {
				options = $.extend({},defaults,cmd);
				e.alwaysshowopts = options;
				$.alwaysshow.add(e);
			}
			
		});

	};
	
})(jQuery);