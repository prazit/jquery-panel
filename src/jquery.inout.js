/*!
 * InOut is jQuery plugin, it's a part of Appanel Styler Suite.
 * 
 * Take effect to all element of selector.
 * 
 * @name inout
 * @version 1.1.2
 * @author Prazit Jitmanozot
 * @requires	jQuery v1+
 * 
 * Copyright (c) 2016 Prazit (R) Jitmanozot (http://Appanel.com)
 */
/**
 * usage:
 * 	$(scrollableContainer).inout( $targetElement, margin );					// add 2 points from top and bottom of targetElement - margin
 * 	$(scrollableContainer).inout( levelNumber|function, $targetElement );	// add point from specified levelNumber(relative to scrollableContainer) or returned value of function
 * 	$(scrollableContainer).inout( 'remove', $targetRemove );				// remove all points that contain $targetRemove
 * 	$(scrollableContainer).inout( 'update' );								// immediate scroll trigger
 */
/**
 * Level/Point Conception: 15/2/2016 9:00
 * 
 * over
 * ---- top line >= inside ----
 * inside
 * ---- bottom ine >= under ----
 * under
 */
(function($){
	
	// variables must be declare by var before use, for development only
	'use strict';
	
	/**
	 * jQuery Plugin Here.
	 */
	$.fn.inout = function(arg1,arg2) {
		
		if(this.length==0) {
			return this;
		}
		
		/* constants */
		var	fx = 'function',
			topin = 'inout:topin',			// come in from top of screen
			topout = 'inout:topout',		// come out from top of screen (startin)
			bottomin = 'inout:bottomin',	// come in from bottom of screen
			bottomout = 'inout:bottomout',	// come out from bottom of screen
		
		//-- scrollable container
		$container = this.first(),
		container = $container.get(0),
		$scroller = $container.is('body')?$(window):$container,
		remove = false,
		addElement = arg1 instanceof jQuery,
		level = 0,
		margin = 0,
		$target;
		
		//-- arg1 has 3 cases, one is jQuery and second is level and third is command
		//-- arg2 has 2 cases, one is margin and another one is jQuery
		if(addElement) {
			$target = arg1;
			if(arg2!=undefined) margin = arg2;
		}else if(typeof arg1 === 'string'){
			if(arg1==='remove') {
				remove = true;
			}else if(arg1==='update') {
				update();
				return;
			}
			$target = arg2;
		}else{
			level = arg1;
			$target = arg2;
		}
		
		//-- inout controller is needed
		if(container.inout==undefined) {
			container.inout = {
				
				/**
				 * inside and outside are array of point object, see point function for detail about structure of point object.
				 */
				over: [],		// over current screen (top of screen)
				inside: [],		// inside current screen
				under: [],		// under current screen (bottom of screen)
				dynamic: [],	// dynamic levels
				
				/**
				 * Last detected scroll, top and bottom of screen
				 */
				container: $container,
				scroller: $scroller,
				top: $scroller.scrollTop(),
				bottom: $scroller.scrollTop() + $scroller.innerHeight(),
				
				/**
				 * Unique ID for any point.
				 */
				id: 0,
				target: [],
				
				/**
				 * addElement:
				 * 
				 * Add points by Element, two points will be created using top and bottom of element.
				 * 
				 * @param $element $(element) will receive events below.
				 * @param margin pixels between element-edge and created point, positive is outside element negative is inside element.
				 */
				element: function($element,margin) {
					
					var	$scroller = this.container,
						topFx = typeof(margin)==fx
							?function(){
								return $element.offset().top - margin.call(this) - $scroller.offset().top;
							}
							:function() {
								return $element.offset().top - margin - $scroller.offset().top;
							},
						bottomFx = typeof(margin)==fx
							?function(){
								return $element.offset().top + $element.height() + margin.call(this) - $scroller.offset().top;
							}
							:function(){
								return $element.offset().top + $element.height() + margin - $scroller.offset().top;
							},
						id = this.reg($element);	// register target element
					
					//-- create points by top of element
					this.point(id,bottomFx,$element,topin,topout,undefined,undefined);
					
					//-- create points by bottom of element
					this.point(id,topFx,$element,undefined,undefined,bottomin,bottomout);
					
				},
				
				/**
				 * Register target element for inoutID
				 * 
				 * @param $target jQuery object
				 * 
				 * @returns inout ID
				 */
				reg: function($target){
					var element = $target.get(0);
					if(element.inoutID===undefined) {
						element.inoutID = this.id;
						this.target[this.id] = $target;
						this.id++;
					}
					return element.inoutID;
				},
				
				/**
				 * addPoint:
				 * 
				 * Add point to Points array.
				 * 
				 * @param ID result from reg function
				 * @param level number
				 * @param $target element to receive events
				 * @param topin call this trigger when point is go inside screen from top side
				 * @param topout call this trigger when point is go outside screen from top side
				 * @param bottomin call this trigger when point is go inside screen from bottom side
				 * @param bottomout call this trigger when point is go outside screen from bottom side
				 */
				point: function(ID,level,$target,topin,topout,bottomin,bottomout) {
					
					var point = {
							id: ID,
							target: $target,
							topin: topin,
							topout: topout,
							bottomin: bottomin,
							bottomout: bottomout,
							toString: this.string
						},
						isDynamic = typeof(level)===fx,
						pos,event;
					
					//-- calculate dynamic level
					if(isDynamic) {
						this.dynamic.push(point);
						point.getLevel = level;
						level = level.call(point);
					}
					if(level<0) {
						level = 0;
					}
					
					//-- add to array of point by position
					pos = this.pos(level);
					point.level = level;
					point.pos = pos;
					if(pos===0) {
						this.over.push(point);
					}else if(pos===1) {
						this.inside.push(point);
					}else{
						this.under.push(point);
					}
					
					//-- use trigger now, assume before start is at under position (2)
					event = this.event(20 + pos,point);
					if(event!==undefined) {
						this.trigger(event);
					}
					
					//-- debug message
					// Appanel.th('log','inout:point(top:'+this.top+',bottom:'+this.bottom+',pos:'+point.pos+',level:'+level+',id:'+point.id+',target:'+point.target+')');
					
				},
				
				/**
				 * Update point position
				 * 
				 * Event: on scroll, on resize, on update (content is updated)
				 */
				update: function() {
					
					//-- current screen
					var	inout = container.inout,	// must use 'container.inout' instead of 'this' because this is event listener function the 'this' is an target element.
						trigger = [],
						top = inout.top,
						bottom = inout.bottom,
						i,point,length,level,last,event;
					
					//-- update screen position
					inout.top = $scroller.scrollTop();
					inout.bottom = inout.top + $scroller.innerHeight();
					
					//-- debug message
					// Appanel.th('status','inout:update(top:'+inout.top+',bottom:'+inout.bottom+')');
					
					//-- top is move up
					if(inout.top < top){
						// over -> inside	(01)
						inout.pair(trigger,0,inout.over,1,inout.inside);
						// Appanel.th('log','inout:update-over-inside(trigger:'+trigger+')');
					}
					
					//-- top is move down
					else { // top >= inout.top
						// inside -> over	(10)
						inout.pair(trigger,1,inout.inside,0,inout.over);
						// Appanel.th('log','inout:update-inside-over(trigger:'+trigger+')');
					}
					
					//-- bottom is move up
					if(inout.bottom < bottom){
						// inside -> under	(12)
						inout.pair(trigger,1,inout.inside,2,inout.under);
						// Appanel.th('log','inout:update-inside-under(trigger:'+trigger+')');
					}
					
					//-- bottom is move down
					else { // bottom >= inout.bottom
						// under -> inside	(21)
						inout.pair(trigger,2,inout.under,1,inout.inside);
						// Appanel.th('log','inout:update-under-inside(trigger:'+trigger+')');
					}
					
					//-- update all dynamic point
					length = inout.dynamic.length;
					for(i=0; i<length; i++) {
						point = inout.dynamic[i];
						last = point.pos * 10;
						level = point.getLevel.call(point);
						if(level<0) {
							level = 0;
						}
						point.pos = inout.pos(level);
						event = inout.event(last + point.pos,point);
						if(event!==undefined) {
							//-- add to trigger
							while(event.length>0) {
								trigger.push(event.shift());
							}
						}
					}
					
					//-- use trigger now
					inout.trigger(trigger);
					
				},
				
				/**
				 * getPosition of level
				 * 
				 * 0=over
				 * 1=inside
				 * 2=under
				 * 
				 * @param level the level number of point
				 */
				pos: function(level){
					if(level < this.top) {
						return 0; // over
					}else if(level < this.bottom ) {
						return 1;	// inside
					}else {
						return 2;	// under
					}
				},
				
				/**
				 * getTriggers
				 * 
				 * @param cases the number of (oldPos * 10 + newPos)
				 * @param point the point object
				 */
				event: function(cases,point){
					switch(cases) {
						case 1:return [[point,point.topin]];							// over -> inside
						case 2:return [[point,point.topin],[point,point.bottomout]];	// over -> under
						case 10:return [[point,point.topout]];							// inside -> over
						case 12:return [[point,point.bottomout]];						// inside -> under
						case 20:return [[point,point.bottomin],[point,point.topout]];	// under -> over
						case 21:return [[point,point.bottomin]];						// under -> inside
						default:return undefined;										//case 0: case 11: case 22: no changes
					}
				},
				
				/**
				 * Detect points whose are already out from 'from' and move to 'to' only for 'posTo'.
				 * 
				 * @param trigger result of pair will add to this trigger
				 * @param posFrom	position that will remove from
				 * @param from	array of point
				 * @param posTo	position that will send to
				 * @param to	array of point
				 */
				pair: function(trigger,posFrom,from,posTo,to) {
					var i, pos, point, event,
						length = from.length;
					posFrom *= 10;
					for(i=0; i<length; i++) {
						point = from[i];
						pos = this.pos(point.level);
						if(pos===posTo) {
							event = this.event(posFrom + pos,point);
							if(event!==undefined) {
								//-- move point
								length--;
								from.splice(i--,1);
								to.push(point);
								//-- add to trigger
								while(event.length>0) {
									trigger.push(event.shift());
								}
							}
							point.pos = pos;
						}
					}
				},
				
				/**
				 * call trigger pair
				 * 
				 * @param trigger array of pair of point and trigger.
				 */
				trigger: function(trigger){
					
					var event,log = '';
					for(var i in trigger) {
						event = trigger[i];
						if(event[1]!==undefined) {
							//-- send message
							event[0].target.triggerHandler(event[1]);
							//-- debug
							// log += ', ['+event[0]+', '+event[1]+']';
						}
					}
					
					//-- debug message
					/*if(log!=='') {
						Appanel.th('log','inout:trigger('+log.substring(1)+')');
					}*/
					
				},
				
				/**
				 * toString of point
				 * 
				 * @returns {String}
				 */
				string: function(){
					return '{id:' + this.id + ',pos:' + this.pos + ', target:' + this.target + '}';
				},
				
				/**
				 * Remove all points that contain $target.
				 *  
				 * @param jQuery $target the target to remove
				 */
				clear: function($target){
					var	all = [this.over,this.inside,this.under,this.dynamic],
						id = this.reg($target),
						active,i;
					for(var a in all) {
						active = all[a];
						for(i=0; i<active.length; i++) {
							if(active[i].id===id) {
								//-- debug message
								// Appanel.th('log','inout:clear('+active[i]+')');
								// remove
								active.splice(i,1);
								i--;
							}
						}
					}
				}
				
			};
			
			//-- debug message
			// Appanel.th('status','inout:scroll(top:'+container.inout.top+',bottom:'+container.inout.bottom+',innerHeight:'+$scroller.innerHeight()+')');
			
			//-- listen scroll on $scroller
			$scroller.on('scroll',update);
			
			//-- listen updated on $scroller
			$scroller.on('content:updated',update);
			
			//-- listen resize on window
			Appanel.router.on('resize',update);
			
		};// end of parent.inout listener
		
		/**
		 * Event/Command update, this function is delayed update to reduce amount of impact (increase scroll performance)
		 */
		function update(){
			clearTimeout(container.inout.updateID);
			container.inout.updateID = setTimeout(container.inout.update, Appanel.milli("scroll"));
		}
		
		//-- add all elements
		$target.each(function(i,e){
			var $e = $(e);
			if(addElement) {
				container.inout.element($e,margin);
			}else if(remove){
				container.inout.clear($e);
			}else{
				container.inout.point(container.inout.reg($e),level,$e,topin,topout,bottomin,bottomout);
			}
		});
		
		//-- jQuery Style
		return this;
	};
	
})(jQuery);