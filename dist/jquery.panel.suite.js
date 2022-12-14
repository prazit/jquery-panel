
Appanel.version += " JPS Development";


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
/**
 * Example: $('form').entry(options|command);
 * options please see defaults in source code
 * commands are in this listed 
 * 	'object' to collect data and return as an object
 *  'json' to collect data and return as JSON encoded string
 *  'post' to collect data and return as GET/POST query string
 */
(function(Appanel,$,undefined){
	
	// variables must be declare by var before use, for development only
	'use strict';
	
	$.fn['entry'] = function(options) {
		
		// start of commands
		if(typeof(options) === "string") {
			
			var object = 'object',
				collection = {};
			
			// object command and post command will collect data from entry fields
			if(options === object || options === "post" || options === "json") {
				
				// collect data from entry fields
				this.each(function(){
					
					// entryContext is required
					var	context = this.entryContext,
						collect = function(i,e) {
							
							// variable name from ID attribute
							var $e = $(e),
								name = $e.prop('name'),
								indexed = false;
							
							// entry name
							if(name==="") {
								name = "unnamed";
							}else{
								
								// variable is an array with indexed
								var	open = name.search(/\[/),
									close;
								if(open >= 0) {
									close = name.search(/\]/);
									indexed = name.substring(open + 1,close);
									name = name.substring(0,open);
								}
								
							}
							
							// radio button is group of fields but has only one value (important: radio is not array)
							if($e.is("[type=radio]")) {
								if($e.prop('checked')) {
									collection[name] = e.acceptedValue;
								}else{
									if(collection[name] === undefined) {
										collection[name] = "";
									}
								}
							}
							
							// array variable
							else if(collection[name] !== undefined || indexed !== false) {
								
								if(collection[name] === undefined) {
									// create new array
									collection[name] = [];
								}else if(typeof(collection[name]) !== object) {
									// convert variable to array
									collection[name] = [collection[name]];	// keep value in an array
								}
								
								if(indexed === false) {
									// no index
									collection[name].push(e.acceptedValue);
								}else{
									// has indexed
									collection[name][indexed] = e.acceptedValue;
								}
								
							}
							
							// normal variable
							else{
								collection[name] = e.acceptedValue;
							}
							
						};
					
					if(context===undefined) {
						Appanel.th(Appanel.dev.log,"Please create entry panel before use command '"+ options +"' on "+$(this));
						return collection;
					}
					
					// collect all inputs
					context.inputs.each(collect);
					
				});
				
				// return query string for post
				if(options === "post") {
					
					// convert to query
					var query = "",
						i,j;
					for(i in collection) {
						if(typeof(collection[i]) === object) {
							
							// this is array of value
							for(j in collection[i]) {
								query += "&" + i + "["+ j +"]=" + collection[i][j];
							}
							
						}else{
							query += "&" + i + "=" + collection[i];
						}
					}
					
					return query.substring(1);
					
				}
				
				// return json string for json
				else if(options === "json") {
					return JSON.stringify(collection);
				}
				
			}
			
			// object command or invalid command will return collection object
			return collection;
			
		} // end of commands
		
		// constants
		var cfalse = false,
			//ctrue = true,
			cblur = "blur",
			cinput = "input",
			
		// ID based chains string for loading option
		chainsString = "-symbol--c5,symbol--c4:0.01#processing|-text--c5,text--c4:0.01#text",
		
		// RegEx pattern constants
		pnumber = "\x30-\x39",
		pcapital = "\x41-\x5A",
		pletter = "\x61-\x7A",
		punicode = "\u0E01-\u0E2E\u0E2F-\u0E3A\u0E40-\u0E4F\u0E50-\u0E59",
		pany = "\x30-\x39\x41-\x5A\x61-\x7A\u0E01-\u0E2E\u0E2F-\u0E3A\u0E40-\u0E4F\u0E50-\u0E59",
		
		// merge constants
		mdate = "\x34\x31/\x31\x32/\x36\x39\x36\x39",
		mtime = "\x31\x32:\x30\x30",
		mdatetime = mdate +" "+ mtime,
		
		// filter constants
		femail = "-#Aa@_.",
		fnumber = "-#",
		fsearch  ="-#Aau._+:/%@",
		fdate = "/#",
		ftime = ":#",
		fdatetime = "/#: ",
		
		// mask constants
		ktel = "##-####-####-@",
		kdate = "dd/mm/yyyy",
		ktime = "hh:nn",
		kdatetime = kdate +" "+ ktime,
		knumber = "#,###,###,###<",
		
		// string constant
		cloading = "loading",
		cloadingattr = "[" + cloading + "]",
		csubmit = "submit",
		csubmitattr = "["+ csubmit +"]",
		cform = "form";
		
		// defaults for option
		options = $.extend({
			
			/* all css classes are used to reduce size of HTML, it's added to related input-box */
			
			focus: cfalse,		// first focus, name attribute of an entry field that want the focus when container got the focus.
			
			filters: cfalse,	// array of pairs of filter and mask indexed by number started at 0, filter attribute of a text box is index in this array.
								// see "appanel text format.txt" for detailed about filter and mask
			
			//-- for text box, email box, telephone number box
			// has filters, has css
			// no presenter
			
			textbox: cfalse,		// css classes for all text box (text,email,tel,search,password,date,time,datetime,number,multiline)
			
			//-- for radio button, check box, color box, range box, file upload box, image selection box 
			// has css, has presenter
			// no filters
			
			radio: cfalse,		// object of {on:"classes",off:"classes"}
			checkbox: cfalse,	// object of {on:"classes",off:"classes"}
			range: cfalse,		// object of {box:"classes",button:"classes"}
			file: cfalse,		// object of {box:"classes",button:"classes"}
			image: cfalse,		// object of {box:"classes",button:"classes"}
			
			//-- for date and datetime
			
			year: 543,				// add to current year, 0 will be use original year.
			
			//-- for <button> and <a> with attribute loading="text", the loading element with "text" and transparent glass will show on top of screen after click on <button> or <a>
			// see Appanel.html.loading for loading element ID
			// see jQuery.glass for glass element ID
			
			loading: chainsString
				
			//-- MustKnow: submit button is a <button> or <a> with attribute submit="id-of-form", when submit button get clicked, some hidden fields will be added for all entry fields before send submit signal to the specified form.   
			
		},options === undefined ? {} : options);
		
		// capture enter then move focus to next input
		function enter(inputs,button,mapper) {
			var	length = inputs.length,
				ckeydown = "keydown",
				ctextarea = "textarea",
				notText = "[type=radio],[type=checkbox]",
				newline = "\n",
				i,e,
				keyfilter = function(ev) {
					
					// ignore function keys (F1 - F12)
					if(ev.keyCode >= 112 && ev.keyCode <= 123) {
						// Appanel.th(Appanel.dev.debug,"jQuery Entry: enter: keydown: keyCode("+ev.keyCode+") then ignored");
						return;
					}
					
					var	target = ev.target,
						$target = $(target),
						key = ev.keyCode,
						value = $target.val(),
						isTextArea = $target.is(ctextarea),
						last;
					
					// enter, down arrow, right arrow
					if( ( key == 9 || key == 13 || key == 40 || key == 39 ) && this.nextInput !== undefined ) {
						last = value.length;
						if( ( isTextArea && ( ( key == 40 && value.substring(target.selectionStart).indexOf(newline) < 0 ) || ( key == 39 && target.selectionStart == last && target.selectionEnd == last ) ) ) ||
							( !isTextArea && ( key !== 39 || $target.is(notText) || ( target.selectionStart == last && target.selectionEnd == last ) ) ) ) {
							// next focus
							ev.preventDefault();
							$(this.nextInput).focus();
							if( !$(this.nextInput).is(notText) ) {
								last = key == 40 && !$target.is(notText) ? ( isTextArea ? target.selectionStart - value.lastIndexOf(newline) - 1 : target.selectionStart ) : 0;
								this.nextInput.setSelectionRange(last,last);
							}
						}
						// important: prevent default action (enter) on dialog panel
						ev.stopPropagation();
					}
					
					// backspace, up arrow, left arrow
					else if( ( key == 8 || (key == 9 && ev.shiftKey) || key == 38 || key == 37 ) && this.previousInput !== undefined ) {
						if( ( isTextArea && ( ( key == 38 && value.substring(0,target.selectionStart).indexOf(newline) < 0 ) || ( key != 38 && target.selectionStart == 0 && target.selectionEnd == 0 ) ) ) ||
							( !isTextArea && ( key == 38 || $target.is(notText) || ( target.selectionStart == 0 && target.selectionEnd == 0 ) ) ) ) {
							// previous focus
							ev.stopPropagation();
							ev.preventDefault();
							$(this.previousInput).focus();
							if( !$(this.previousInput).is(notText) ) {
								last = key == 38 && !$target.is(notText) ? ( $(this.previousInput).is(ctextarea) ? $(this.previousInput).val().lastIndexOf(newline) + target.selectionStart + 1 : target.selectionStart ) : $(this.previousInput).val().length;
								this.previousInput.setSelectionRange(last,last);
							}
						}
					}
					
					else if( key !== 13 && key !== 27) {
						ev.stopPropagation();
					}
					
				};
			
			// move focus to next input when the enter is pressed
			// except last input
			for(i=0; i<length; i++) {
				e = inputs.get(i);
				e.previousInput = i == 0 ? undefined : inputs.get(i - 1);
				e.nextInput = i == length - 1 ? button : inputs.get(i + 1);
				mapper.push([$(e),ckeydown,keyfilter]);
			}
			
			// last text area only
			e = inputs.last();
			if(e.is(ctextarea)) {
				mapper.push([e,ckeydown, function(ev) {
					if( key === 13 ) {
						ev.stopPropagation();
					}
				}]);
			}
			
			// map all handlers
			Appanel.map(mapper);
			
		}
		
		/**
		 * Get filterred value (copied from "prazit/textmask" project) 
		 *
		 * @param value input string that want to apply filter
		 * @param filter see "appanel text format.txt" for detailed
		 */
		function filterred(value,filter) {

			if(filter === cfalse || filter === "") {
				return value;
			}
			
			var	search = "[^"+ filter +"]",
				split = value.search(search),
				filterred = "";
			
			// remove unwanted characters
			while(split >= 0) {
				// left side of split point
				if(split > 0) {
					filterred += value.substring(0,split);
				}  
				// right side of split point
				value = value.substring(split + 1);
				// find next split
				split = value.search(search);
			}
			
			return filterred + value;
			
		}
		
		/**
		 * Get masked value (copied from "prazit/textmask" project)
		 *
		 * @param value input string that want to apply mask, this value need the filterred value.
		 * @param mask see "appanel text format.txt" for detailed
		 * @param options is optional, it's used by year validator
		 */
		function masked(value, mask, options) {
			
			if(mask === cfalse || mask === "") {
				return value;
			}

			// for number and decimal
			var more = "",
				masked = "",
				reverse = mask.indexOf("<");
			if(reverse > 0) {

				// fixed bug: "0-" is "-0"
				if(value === "0-") {
					return "-0";
				}

				// find decimal point symbol
				var em = "",
					points = mask.match("<\.*>"),
					point = points === null ? em : points[0].substring(1,points[0].length-1),
					vpoint = point === em ? 0 : value.lastIndexOf(point),
					hasPoint = vpoint > 0,
					vmore, negative, mmore, count;
				
				// have decimal point or not
				if(hasPoint) {

					var mpoint = mask.indexOf(points[0]);
					
					// left part is for reverse operation
					vmore = value.substring(0, vpoint);
					mmore = mask.substring(0, mpoint);

					// right part is for this function operation
					value = value.substring(vpoint + 1);
					mask = mask.substring(mpoint + 3);
					
				}else{
					
					// for reverse operation
					vmore = value;
					mmore = mask.substring(0, reverse);
					
				}

				// negative number
				negative = vmore.substring(0,1) === "-";
				if(negative) {
					vmore = vmore.substring(1);
				}

				// value length must less than lenght of number in mask
				count = mmore.length - mmore.replaceAll("#","").length;
				if(vmore.length > count) {
					vmore = vmore.substring(0,count);
				}

				// number validation
				vmore = Math.round(vmore) + ".";	// convert Number object to String object by ".", the "." will be removed by .substring(1) below

				// reverse operation
				more = this.masked(vmore.split(em).reverse().join(em).substring(1), mmore.split(em).reverse().join(em)).split(em).reverse().join(em);

				// don't forget negative sign
				if(negative) {
					more = "-" + more;
				}

				// don't forget decimal point
				if(hasPoint) {
					more += point;
					// and then continue to create masked of right part
				}else{
					// no right part then return
					return more;
				}

			}

			// value is needed
			if(value.length > 0){
				
				var	pattern, limit, search,
					i,ch,		// index of mask
					v = 0, n,	// index of value
					length = mask.length,
					day = cfalse,
					month = cfalse,
					year = cfalse,
					hour = cfalse,
					minute = cfalse,
					dateValue, dateInfo,
					dateLength;

				// each character in mask
				for(i=0; i<length; i++) {
					ch = mask[i];
					limit = 1;

					// pattern to find next character of display value
					if( ch === "#" ) {
						pattern = pnumber;
						
					}else if( ch === "A" ) {
						pattern = pcapital;
						
					}else if( ch === "a" ) {
						pattern = pletter;
						
					}else if( ch === "u" ) {
						pattern = punicode;
						
					}else if( ch === "@" ) {
						pattern = pany;
						
					}else if( ch === mask[i + 1] ) { // this condition must test after the tests of all "#Aau@"
						pattern = pnumber;
						if( ch === "y" && ch === mask[i + 2] && ch === mask[i + 3]) {
							// this is 'yyyy'
							i += 3;
							search = ["yyyy"];
							dateLength = 4;
						}else{
							// this is 'dd' or 'mm' or 'yy' or 'hh' or 'nn'
							i++;
							search = (ch + ch).match("dd|mm|yy|hh|nn");
							dateLength = 2;
						}
						if( search !== null ) {
							limit = search[0].length;
						}
						
					}else{
						
						// escape character is "~", symbol appear after this character
						if( ch === "~" ) {
							ch = mask[++i];
						}
						
						// already have this symbol then remove it
						if(value.substring(0,1) === ch) {
							value = value.substring(1);
						}

						// add symbol
						masked += ch;
						
						// stop at last character of value
						if(value.length === 0){
							break;
						}
						
						// next character of mask
						continue;
					}
					
					// find first character of value that match the pattern
					search = "["+ pattern +"]{"+limit+"}";
					v = value.search(search);
					if(v < 0 && limit > 1) {
						// try again for date component
						search = "["+ pattern +"]{1,"+limit+"}";
						v = value.search(search);
					} 
					if(v >= 0) {
						
						if( limit === 1 ) {
							n = v + 1;
							masked += value.substring(v,n);
						}else{
							// this is date component then keep info for date validation
							n = v + value.match(search)[0].length;
							dateValue = value.substring(v,n);
							dateInfo = {
								value: dateValue,
								start: masked.length,
								end: masked.length + dateValue.length 
							};
							if( ch === "d" ) {
								day = dateInfo;
							}else if( ch === "m" ) {
								month = dateInfo;
							}else if( ch === "y" ) {
								year = dateInfo;
								year.length = dateLength;
							}else if( ch === "h" ) {
								hour = dateInfo;
							}else{ // if( ch === "n" )
								minute = dateInfo;
							}
							masked += dateValue;
						}
						value = value.substring(n);
						
						// stop at last character of value
						if(value.length===0){
							
							// have symbol at next and the next is end of mask then show it
							if(i < length && mask[i+1] === "~") {
								masked += mask[i+2];
							}
							
							// stop
							break;
						}
					}else{
						// invalid character then stop and wait for valid
						break;
					}
					
				}// end for

				// date validation : month (completed component only)
				if( month !== false && month.value.length == 2 ) {
					value = Math.round(month.value);
					if( value < 1 ) {
						// replace month by 01
						month.value = "01";
						
					}else if( value > 12 ) {
						// replace month by 12
						month.value = "12";
					}
					// replace value
					masked = masked.substring(0,month.start) + month.value + masked.substring(month.end);
				}

				// date validation : day (completed component only, require month)
				if( day !== false && day.value.length == 2 ) {
					month = month === false ? 1 : Math.round(month.value);
					value = Math.round(day.value);
					if( value < 1 ) {
						// replace month by 01 
						day.value = "01";
					}else{
						dateValue = [31,29,31,30,31,30,31,31,30,31,30,31];
						limit = dateValue[month - 1];
						if( value > Math.round(limit) ) {
							// replace month by Days
							day.value = limit;
						}
					}
					// replace value
					masked = masked.substring(0,day.start) + day.value + masked.substring(day.end);
				}
				
				// date validation : day (completed component only, require month)
				if( year !== false && year.value.length == 4 ) {
					limit = (new Date()).getFullYear() + options.year;
					value = Math.round(year.value);
					if( value > limit + 100 || value < limit - 100 ) {
						// replace month by limit 
						year.value = limit;
					} 
					// replace value
					masked = masked.substring(0,year.start) + year.value + masked.substring(year.end);
				}
				
				// date validation : hour (completed component only)
				if( hour !== false && hour.value.length == 2 ) {
					if(Math.round(hour.value) >= 24) {
						// replace hour by 23 oclock
						hour.value = "23";
					}
					// replace value
					masked = masked.substring(0,hour.start) + hour.value + masked.substring(hour.end);
				}

				// date validation : minute (completed component only)
				if( minute !== false && minute.value.length == 2 ) {
					if(Math.round(minute.value) >= 60) {
						// replace hour by 00 miniute
						minute.value = "59";
					}
					// replace value
					masked = masked.substring(0,minute.start) + minute.value + masked.substring(minute.end);
				}
				
			}// end if

			// return value
			return more + masked;
		}		
		
		/**
		 * Change input type to text and keep old type in attribute named otype
		 */
		function toText(input) {
			var	$e = $(input),
				type = $e.prop("type");
			
			$e.attr("otype",type).prop("type","text");
			
			return input;
		}
		
		/**
		 * Compile filter to RegEx Character Set before send it to filterred function
		 */
		function compile(filter) {

			var	i,ch,
				compiled = "",
				arr = filter.split(""),
				length = arr.length;
			 
			for(i=0; i<length; i++) {
				ch = arr[i];
				if( ch === "~" ) {
					compiled += ch[++i];
					
				}else if( ch === "#" ) {
					compiled += pnumber;
					
				}else if( ch === "A" ) {
					compiled += pcapital;
					
				}else if( ch === "a" ) {
					compiled += pletter;
					
				}else if( ch === "u" ) {
					compiled += punicode;
					
				}else{
					compiled += ch;
				}
			}

			return compiled;
			
		}
		
		/**
		 * init input (each)
		 * 
		 * @param filter see filter in "appanel text format.txt" for detailed
		 * @param merge string to merge into value to make sure the value always is valid
		 * @param mask see mask in "appanel text format.txt" for detailed
		 * @param css string contains css classes for element
		 * @param presenter is callback function to call at the end
		 * @param options full options of the entryContext 
		 */
		function input(filter,merge,mask,css,presenter,options) {
			
			var element = this,
				$e = $(element),
				data = {
					cc:compile,
					f:filter,
					ff:filterred,
					m:mask,
					mm:masked
				};
			
			//Appanel.th(Appanel.dev.log,"init input "+$e);
			
			// css classes
			if(typeof(css)==="string") {
				$e.addClass(css);
			}
			
			// check box has no filter
			if($e.is("[type=checkbox]")) {
				Appanel.map([[$e,Appanel.type.click+" "+cblur,function() {
					this.acceptedValue = $(this).prop("checked") ? 1 : 0;
				}]]);
				$e.triggerHandler($.Event(cblur));
			}
			
			// text box always need filter
			else {
				Appanel.map([[$e,cinput+" "+cblur,function(ev) {
					/* referenced: appanel text format.txt */
					
					// Appanel.th(Appanel.dev.debug, "pressed: "+ ev.keyCode);
					
					var element = this,
						$e = $(element),
						data = ev.data,
						display = $e.val(),
						filter = data.f === cfalse ? cfalse : data.cc(data.f), // filter need compiled before use
						value = data.ff(display,filter),
						masked = data.mm(ev.type === cblur && value.length > 0 ? (value.length >= merge.length ? value : value + merge.substring(value.length)) : value, data.m, options);
					
					// accept value
					if(masked !== display) {
						
						// display value
						$e.val(masked);
						
						// accept from display
						element.acceptedValue = data.ff(masked,filter);
						
					}else{
						element.acceptedValue = value;
					}
					
					//Appanel.th(Appanel.dev.debug, "accepted: '"+ element.acceptedValue +"' (value:'"+ value +"', filter:'"+ data.f +"', mask:'"+ data.m +"')");
					
					ev.preventDefault();
					ev.stopPropagation();
				},data]]);
				$e.triggerHandler($.Event(cinput,{data:data}));
			}
			
			// presenter
			if(presenter !== cfalse) {
				presenter.call(element);
			}
			
		}
		
		/**
		 * Before submit must be create hidden fields to contain the accepted value instead of masked value.
		 * 
		 * @param context = entryContext
		 * @param form is jQuery object of a form to submit
		 */
		function submit(context,form) {
			if(form instanceof jQuery && form.length > 0) {
				
				var	name = "name",
					append = "";
				
				// create hidden fields for textboxes
				context.inputs.each(function(i,e){

					var $e = $(e),
						variable = $e.prop(name);
					
					// textboxes only
					if(!$e.is("[type=radio]")) {
						
						// remove name from entry field to ignore masked value when submit
						$e.removeAttr(name);
						
						// add hidden field with entry field name to include accepted value when submit
						append += '<input type="hidden" name="' + variable + '" value="' + e.acceptedValue + '"/>';
						
					}
					
				});
				
				// then call submit
				form.append(append).submit();
				
			}
		}
		
		// take effect to all elements as containers
		return this.each(function(i,e) {
			
			// already init kick out
			if(e.entryContext !== undefined) {
				return;
			}
			
			var $e = $(e),
				inputs = $e.find('input,select,textarea').not('[type=hidden]'),	// natural order of inputs
				textcss = options.textbox,
				mapper = [],
				empty = "",
				button = undefined; // default button to get focus after last input field
			
			// container of Entry fields
			$e.attr("container","entry");
			
			// new context for each container
			e.entryContext = {
					
				/* input elements orderred by tab-index */
				inputs: inputs,
				
				/* main options */
				options: options,
				
				/* has filters, has css (IMPORTANT: The [type=text] must run at first because of all textbox will be converted to [type=text]) */
				texts: inputs.filter('[type=text]').each(function(i,e){
					var filters = options.filters[$(e).attr("filter")];
					if(filters === undefined) {
						input.call(e,cfalse,empty,cfalse,textcss,cfalse,options);
					}else{
						filters = filters.split("--");
						input.call(e,filters[0],empty,filters[1],textcss,cfalse,options);
					}
				}),
				emails: inputs.filter('[type=email]').each(function(){
					input.call(toText(this),femail,empty,cfalse,textcss,cfalse,options);
				}),
				tels: inputs.filter('[type=tel]').each(function(){
					input.call(toText(this),fnumber,empty,ktel,textcss,cfalse,options);
				}),
				
				/* no filters, no css, no presenter */
				hiddens: $e.find('[type=hidden]').each(function(){
					input.call(this,cfalse,empty,cfalse,cfalse,cfalse,options);
				}),
				
				/* no filters, has css, no presenter */
				multilines: inputs.filter('textarea').each(function(){
					input.call(this,cfalse,empty,cfalse,textcss,cfalse,options);
				}),
				searches: inputs.filter('[type=search]').each(function(){
					input.call(toText(this),fsearch,empty,cfalse,textcss,cfalse,options);
				}),
				passwords: inputs.filter('[type=password]').each(function(){
					input.call(this,cfalse,empty,cfalse,textcss,cfalse,options);
				}),
				
				/* has filters, has css, has presenter */
				dates: inputs.filter('[type=date]').each(function(){
					input.call(toText(this),fdate,mdate,kdate,textcss,cfalse,options);
				}),
				times: inputs.filter('[type=time]').each(function(){
					input.call(toText(this),ftime,mtime,ktime,textcss,cfalse,options);
				}),
				datetimes: inputs.filter('[type=datetime]').each(function(){
					input.call(toText(this),fdatetime,mdatetime,kdatetime,textcss,cfalse,options);
				}),
				numbers: inputs.filter('[type=number]').each(function(){
					input.call(toText(this),fnumber,empty,knumber,textcss,cfalse,options);
				}),
				
				/* no filters, has css, has presenter */
				checkboxes: inputs.filter('[type=checkbox]').each(function(){
					input.call(this,cfalse,empty,cfalse,options.checkbox,cfalse,options);
				}), 
				radios: inputs.filter('[type=radio]').each(function(){
					input.call(this,cfalse,empty,cfalse,options.radio,cfalse,options);
				}) 
				
			};
			
			// got focus on pad then forward to entry field
			if(options.focus) {
				var target = options.focus instanceof jQuery ? options.focus : $e.find("[name="+ options.focus +"]");
				if(target.length > 0) {
					mapper.push([$e,"focus",function(ev){
						ev.data.target.focus();
						// Appanel.th(Appanel.dev.debug,"jQuery Entry: set focus to '"+ ev.data.target.toString() +"'");
					},{target:target}]);
				}
			}
			
			// create hidden fields for all entry field when click on submit button
			$e.find(csubmitattr).each(function(i,s){
				var $s = $(s);
				if(button === undefined) {
					button = $s;
				}
				if(!$s.is(cloadingattr)) {
					mapper.push([$s,Appanel.type.click,function(ev){
						// Appanel.th(Appanel.dev.debug,"calling submit without loading panel ...");
						// find form
						var	form = Appanel.router.find("#"+$(ev.target).attr(csubmit));
						// submit
						submit(ev.data,form.length === 0 ? $(ev.target).parents(cform) : form);
					},e.entryContext]);
				}
			});
			
			// show loading when click on a button
			$e.find(cloadingattr).each(function(i,l){
				mapper.push([$(l),Appanel.type.click,function(ev){
					
					// add loading panel
					Appanel.router.append(Appanel.html.get("loading",{text:$(ev.target).attr(cloading)+"..."}));
					
					// play animate chains for loading panel
					var chains = "chains",
						values = ev.data.loading,
						$target = $(ev.target);
					if(typeof(values) === "string") {
						Appanel[chains](
							Appanel.router.find("#"+cloading).glass({
								color: "white",	// issued: transparent color and opacity 0 will made no glass on InternetExplorer
								opacity: 0.9
							}).sweep(chains,values),
							$target.is(csubmitattr) ? function(sweeper){
								// Appanel.th(Appanel.dev.debug,"show loading panel and calling submit...");
								// find form
								var	form = Appanel.router.find("#"+$target.attr(csubmit));
								// submit
								submit(e.entryContext,form.length === 0 ? $target.parents(cform) : form);
							} : undefined 
						);
					}
					
				},options]);
			});
			
			// use Enter and Arrows like Tab
			enter(inputs,button,mapper);
			
			// focus
			if(options.focus) {
				$e.triggerHandler("focus");
			}
			
		});
		
	};
	
})(Appanel,jQuery);
(function($){
	
	// variables must be declare by var before use, for development only
	'use strict';

	$.fn['toTag'] = function(tag) {
		if(this.length==0) return this;
		
		var
			$this = this.first(),
			old = $this.prop('tagName'),
			length = old.length+1,
			html = $this.get(0).outerHTML.substr(length),
			ret;
		
		//-- create new element by html and then remove old element
		html = '<'+tag+html.substr(0,html.length - length)+tag+'>';
		
	    //ret = $this.parent().append(html).find('iframe');
	    //$this.remove();
	    //return ret;
		
		return $this.replaceWith(html);
		
	};
	
})(jQuery);
/* example: Click open button to show menu by animated css and show close button and hide open button and when menu animation is ended then clear animated classes.
 * $('.open-menu').sweep({on:'click', sweep:[
 * 	
 * 	//-- sweeper #1: show menu by animated css
 *  {selector:'.menu',duration:0.9,add:'flip',sweep:[
 *  	//-- sweeper #4: when animation is ended then remove animated css
 *  	{remove:'animated flip',call:function () {alert('Menu is shown');}}
 *  ]},
 *  
 *  //-- sweeper #2: show close button
 * 	{selector:'.close-menu',remove:'hidden'},
 * 	
 * 	//-- sweeper #3: hide this element (this is open button)
 * 	{add:'hidden'}
 * 	
 * ]});
 */
(function (Appanel,$,undefined) {
	
	// variables must be declare by var before use
	// the 'use strict' is required, unknow errors will occurred after minify without 'use strict'. 
	'use strict';
	
	$.sweepPlayer = {
	    
		/**
		 * create dummy element for sweeper that has no element
		 */
		d: 0,
		dummy: function(sweepID) {
			if(this.d===0) {
				this.d = Appanel.router.append('<i class="hidden" id="dummy"></i>').find('#dummy');
			}
			return this.d.append('<i id="'+sweepID+'"></i>').find('#'+sweepID);
		},
		
	    /**
	     * Last used ID
	     */
	    lid: 0, 
	    
	    /**
	     * Sweep ID using running number on lid
	     */
	    id: function () {
	    	return 'sweep' + (++this.lid);
	    },
	    
		/**
		 * This is waiting list, it's an array of array of sweeper that still waiting to play
		 * 
		 * s[selector] = array of array of sweeper
		 * 
		 * selector is sweepID of sweep element that use to group the same selector sweep
		 */
		s: [],
		
		/**
		 * Start of group play
		 */
		start: function (context) {
			context.active = true;
		},
		
		/**
		 * End of group play
		 */
	    end: function (context) {
	    	this.s = $.extend(this.s,context.s);
	    	// swap of 2 lines below will made errors after minify.
	    	context.active = false; 
	    	context.s = [];
	    },
	    
	    /**
	     * Get sweeper from context using label
	     * 
	     * @param context
	     */
	    sweeper: function (context,label) {
			var labelled = context.label.indexOf(label);
			if(labelled<0) { 
				return undefined;
			}else{
				return context.sweepers[labelled];
			}
	    },
		
		/**
		 * Add all sweepers to waiting list
		 * 
		 * @param sweepers is array of sweep
		 * @return selectors array of selector of sweepers
		 */
		waiting: function (sweepers,context) {
			var length = sweepers.length,
				result = [],
				collection = [],
				waiting = this.active?this.ss:this.s,
				i,selector,sweeper;
			for(i=0; i<length; i++) {
				sweeper = sweepers[i];
				
				//-- sweeper from label
				if(typeof sweeper ==='string') {
					sweeper = this.sweeper(context,sweeper);
					if(sweeper==undefined) {
						continue;
					}
				}
				
				//-- add link to sweeper and add sweeper to collection
				sweeper.link = result;
				collection.push(sweeper);
				
				// add sweep to sweeping
				selector = sweeper.$.get(0).sweepID;
				if(waiting.indexOf(selector)<0) {
					// create new sub with first child
					waiting.push(selector);
					waiting[selector] = [sweeper];
				}else{
					// append to sub
					waiting[selector].push(sweeper);
				}
				
				// add unique selector to result selectors
				if(result.indexOf(selector)<0) {
					result.push(selector);
					//if(this.debug) this.log('wait: '+selector+' = '+this.s[selector].length);
				}
				
			}
			
	    	//-- debug
	    	//this.log('waiting : '+this.s.toString());
			
			return result;
		},
		
		/**
		 * Play the sweep by selectors
		 * 
		 * @param selectors is result of waiting function
		 */
		playing: function (s) {
			
			// collection of sweeper wil play at the end of this function.
			var collection = [],
				selectors = $.extend([],s),
				si,sweepers,i,value,sweeper,selector,index;
			
			// collect sweeper by selectors
			for(si=0; si<selectors.length; si++) {
				selector = selectors[si];
				index = this.s.indexOf(selector);
				if(index>=0) {
					
					// find and remove selector from waiting list
					for(i=0; i<=index; i++) {
						value = this.s.shift(index);	// remove selector
						if(value==selector) {			// test selector
							break;
						}else{
							this.s.push(value);			// restore selector
						}
					}
					
					// read and clear data of selector
					sweepers = this.s[selector];
					this.s[selector] = undefined;
					
					// add all sweepers to collection
					//if(this.debug) this.log('play: '+selector+' = '+sweepers.length);
					while(sweepers.length>0) {
						sweeper = sweepers.shift();
						collection.push(sweeper);
						// link to play another
						if(sweeper.link!=undefined) {
							while(sweeper.link.length>0) {
								var linker = sweeper.link.shift();
								if(selectors.indexOf(linker)<0) {
									selectors.push(linker);
								}
							}
							sweeper.link=undefined;
						}
					}
					
				}
			}
			
			// play all sweeper in collection
			while(collection.length>0) {
				this.play(collection.shift(),1);
			}
			
		},
		
		/**
		 * Run each sweeper.
		 */
		playAll: function (sweepers,context) {
			var length = sweepers.length,
				sweeper,j;
			this.start(context);
			for(j=0; j<length; j++) {
				if(typeof sweepers[j] ==='string') {
					sweeper = this.sweeper(context,sweepers[j]);
					if(sweeper!=undefined) {
						this.play(sweeper);
					}
				}else if(sweepers[j].on==undefined) {
					this.play(sweepers[j]);
				}
			}
			this.end(context);
		},
		
	    /**
	     * Run sweeper called by trigger
		 * 
		 * @param sweeper is the sweep to play
		 * @param ing is true when called by ing-functions
		 */
		play: function (sweeper,ing) {
			
	    	//-- debug
	    	//this.log('play : '+sweeper.$.get(0).sweepID);
			
			// call by playing will skip this
			if(ing==undefined) {
				this.playing([sweeper.$.get(0).sweepID]);
			}
			
			//-- pause will push to play later
			if(sweeper.context.pause) {
				sweeper.context.play.push(sweeper);
				return;
			}
			
			// often use
	    	var
	    		$active = sweeper.find==undefined?sweeper.$:sweeper.$.find(sweeper.find),
	    		element = $active.get(0),
	    		speed = sweeper.context.speed;
	    	
	    	//-- call function, the function can make change of sweeper before play.
	    	if(typeof sweeper.runonce ==='function') {
	    		// runonce for initialize
	    		try{
	    			sweeper.runonce.call(sweeper,element,sweeper.runarg);
	    		}catch(e) {
	    			Appanel.th('error',e);
	    		}finally{
	    			sweeper.runone = sweeper.runonce;
	    			sweeper.runonce = false;
	    		}
	    	}
	    	if(typeof sweeper.run ==='function') {
	    		// run for every play time
	    		try{
	    			sweeper.run.call(sweeper,element,sweeper.runarg);
	    		}catch(e) {
	    			Appanel.th('error',e);
	    		}
	    	}
	    	
			// sweeper can modify before this line.
	    	var
	    		rawclass = $active.attr('class'),
	    		$orgclass = rawclass==undefined?'':rawclass,
	    		$class = $orgclass.split(' '),
	    		rawstyle = $active.attr('style'),
	    		$orgstyle = rawstyle==undefined?'':rawstyle,
	    		$style = $orgstyle+'',
	    		play = sweeper.play!=undefined,
	    		csstrans = sweeper.csstrans!=undefined && sweeper.csstrans===true,
	    		sweep = sweeper.sweep!=undefined,
	    		defer = sweeper.defer!=undefined;
	    	
	    	//-- remove class
	    	if(sweeper.remove!=undefined) {
	    		// if(this.debug) this.log('remove "'+sweeper.remove+'" from '+element.sweepID);
	    		var $cls = sweeper.remove.split(' '),
	    			clsi = 0,
	    			cls,found;
	    		while(clsi < $cls.length) {
	    			cls = $cls[clsi];
	    			found = $class.indexOf(cls);
	    			if(found >= 0) {
	    				$class.splice(found, 1);
	    			}
	    			clsi++;
	    		}
	    	}
	    	
	    	//-- play sub sweep and defer
	    	if(sweep || defer) {
	    		
		    	//-- handle AnimationEnd event before addClass
		    	
		    	// waiting for sweep
		    	if(sweep) {
		    		// why not use $active.one() see issue#1
		    		var waiting = this.waiting(sweeper.sweep,sweeper.context),
		    			end = this.animationEnd,
		    			timeout = Appanel.milli(csstrans || sweeper.loop == undefined ? sweeper.duration : sweeper.duration * sweeper.loop) * speed;
	    			setTimeout(function () {end.call(element,waiting);},timeout);
		    	}
	    		
		    	// waiting for defer
		    	if(defer) {
		    		var length = sweeper.defer.length,
		    			d;
		    		for(d=0; d<length; d++) {
	    				this.defer(element,sweeper.defer[d],sweeper.context);
		    		}
		    	}
		    	
	    	}
	    	
	    	//-- prepare add
	    	if(sweeper.add!=undefined) {
	    		var $cls = sweeper.add.split(' '),
	    			cls;
	    		for(var clsi in $cls) {
	    			cls = $cls[clsi];
	    			if($class.indexOf(cls) < 0) {
	    				$class.push(cls);
	    			}
	    		}
		    	//-- hidden first to avoid flashing problem before hide.
		    	if(sweeper.add.search(sweeper.hidden)>=0) {
		    		$active.attr('class',sweeper.hidden);
		    	}
	    	}
	    	
	    	//-- always clear older duration
    		$style = $style.replaceAll(/-webkit-animation-duration:[^;]*;|animation-duration:[^;]*;|-webkit-animation-iteration-count:[^;]*;|animation-iteration-count:[^;]*;|-webkit-animation-timing-function:[^;]*;|animation-timing-function:[^;]*;|-webkit-transition-duration:[^;]*;|transition-duration:[^;]*;|-webkit-transition-timing-function:[^;]*;|transition-timing-function:[^;]*;/,'');
	    	
    		//-- sweeper duration
    		var duration = sweeper.duration * speed;
    		
	    	//-- prepare animation
	    	if(play) {
	    		$style += '-webkit-animation-duration:'+duration+'s;animation-duration:'+duration
		    		  +  's;-webkit-animation-iteration-count:'+sweeper.loop+';animation-iteration-count:'+sweeper.loop+';';
	    		if(sweeper.timing!=undefined) {
	    			$style += '-webkit-animation-timing-function:'+sweeper.timing+';animation-timing-function:'+sweeper.timing+';';
	    		}
	    		//-- class to add
	    		var $cls = sweeper.play.split(' '),
	    			cls;
	    		for(var clsi in $cls) {
	    			cls = $cls[clsi];
	    			if($class.indexOf(cls) < 0) {
	    				$class.push(cls);
	    			}
	    		}
	    		// if(this.debug) this.log('play animation "'+sweeper.play+'" on '+element.sweepID);
	    	}
	    	
	    	//-- prepare transition
	    	if(csstrans) {
	    		$style += '-webkit-transition-duration:'+duration+'s;transition-duration:'+duration+'s;';
	    		if(sweeper.timing!=undefined) {
	    			$style += '-webkit-transition-timing-function:'+sweeper.timing+';transition-timing-function:'+sweeper.timing+';';
	    		}
	    		// if(this.debug) this.log('play transition on '+element.sweepID);
	    	}
	    	
    		//-- apply style before use jQuery.css
	    	if($style !== $orgstyle) {
	    		$active.attr('style',$style);
	    	}
	    	
	    	//-- apply classes
	    	$class = $class.join(' ');
	    	if($class !== $orgclass) {
	    		$active.attr('class',$class);
	    	}
	    	
	    	//-- apply css before add classes (transition effect may be create by browser)
	    	if(typeof sweeper.css ==='object') {
	    		$active.css(sweeper.css);
	    		// if(this.debug) this.log('css "'+this.json(sweeper.css)+'" to '+element.sweepID);
	    	}
	    	
	    },
	    
	    /* @uncomment on-release on-production;
		animationEnd: function (waiting) {
			$.sweepPlayer.playing(waiting);
    	}
	    */
		/**
		 * this = element of $active
		 * 
		 * @param waiting is a result of waiting() that want play
		 */
		animationEnd: function (waiting) {
			var player = $.sweepPlayer;
			// if(player.debug) player.log('animationEnd on '+this.sweepID+' with waiting "'+waiting+'"'); 
			player.playing(waiting);
    	},
    	
    	/**
    	 * defer play is used to create new closure scope of variables as arguments to avoid replaced value problem.
    	 * 
    	 * @param timeout duration in milliseconds
    	 * @param element element of active sweeper ($active)
    	 * @param defer the defer object (child of defer array)
    	 * @param onAniEnd event types for animationEnd
    	 */
    	defer: function (element,defer,context) {
    		var $this = this,
    			timespan = Appanel.milli(defer.duration) * context.speed;
			// if(this.debug) this.log('defer '+timespan+' ms on '+ element.sweepID);
    		setTimeout(function (ev) {
    			// if($this.debug) $this.log('defer '+timespan+' ms on '+ element.sweepID+' - play');
    			$this.playAll(defer.sweep,context);
			},timespan);
    	},
		
		/**
		 * pause now, will stack all sweeper that play after this point. 
		 */
		pause: function (context) {
			context.pause = true;
		},
		
		/**
		 * play stack of sweeper.
		 */
		resume: function (context) {
			if(context.pause) {
				var sweepers = context.play;
				context.play = [];
				context.pause = false;
				this.playAll(sweepers,context);
			}
		},
	    
	    /**
	     * Create $jQueryObject using selector or inherit from caller
	     * Handle on actions
	     * Normalize some values
	     * @returns true=on-action-sweeper,false=normal-sweeper
	     */
		handle: function (context,$hidden,$active,duration,timing,sweeper) {
	    	
			//-- any sweeper must contain context.
			sweeper.context = context;
			
			//-- label
			if(sweeper.label!=undefined) {
	    		var	label = sweeper.label;
	    		if(context.label.indexOf(label)<0) {
	    			context.label.push(label);
	    			context.sweepers.push(sweeper);
	    		}
			}
			
	    	// inherit of hidden, the hidden is used in this function only, don't send to play.
	    	if(sweeper.hidden!=undefined) {
	    		$hidden = sweeper.hidden;
	    	}
	    	
	    	// inherit of duration.
	    	var $duration,$timing;
	    	if(sweeper.duration!=undefined) {
	    		$duration = sweeper.duration;
	    	}else{
	    		$duration = duration;
	    	}
	    	if(sweeper.timing!=undefined) {
	    		$timing = sweeper.timing;
	    	}else{
	    		$timing = timing;
	    	}
	    	
	    	// inherit of jQueryObject or use selector
	    	if(sweeper.selector!=undefined) {
    			$active = (sweeper.selector instanceof jQuery)?sweeper.selector:$(sweeper.selector);
    			if(!$active.length) {
    				$active = this.dummy(this.id());
    			}
	    	}
	    	sweeper.$ = $active;
	    	
	    	// sweepID is needed
	    	if($active.get(0).sweepID==undefined) {
	    		$active.get(0).sweepID = this.id();
	    	}
	    	
	    	// handle each sweeper
	    	if(sweeper.handled==undefined) {
	    		
	    		var	hasSweep = sweeper.sweep!=undefined,
	    			hasDefer = sweeper.defer!=undefined,
	    			hasPlay = sweeper.play!=undefined,
	    			isOnAction = sweeper.on!=undefined,
	    			csstrans = sweeper.csstrans!=undefined && sweeper.csstrans===true,
	    			child;
	    		
	    		// protect original options with no changes
	    		if(hasSweep) {
	    			sweeper.sweep = $.extend([],sweeper.sweep);
	    			for(var sw=0; sw<sweeper.sweep.length; sw++) {
	    				child = sweeper.sweep[sw];
	    				if(typeof child !=='string') {
	    					sweeper.sweep[sw] = $.extend({},child); 
	    				}
	    			}
	    		}
	    		if(hasDefer) {
	    			sweeper.defer = $.extend([],sweeper.defer);
	    			for(var df=0; df<sweeper.defer.length; df++) {
	    				sweeper.defer[df] = $.extend({},sweeper.defer[df]);
	    				if(sweeper.defer[df].sweep!=undefined) {
	    					sweeper.defer[df].sweep = $.extend([],sweeper.defer[df].sweep);
			    			for(var sw=0; sw<sweeper.defer[df].sweep.length; sw++) {
			    				child = sweeper.defer[df].sweep[sw];
			    				if(typeof child !=='string') {
			    					sweeper.defer[df].sweep[sw] = $.extend({},child); 
			    				}
			    			}
	    				}
	    			}
	    		}
	    		
    			var	sweepers = hasSweep?sweeper.sweep:[],
    	    		length = sweepers.length;
	    		
	    		//-- mark as handled
	    		sweeper.handled = true;
	    		
		    	//-- required by animated class, (for add and play)
	    		if(sweeper.add!=undefined || hasPlay || csstrans || sweeper.remove!=undefined) {
	    			sweeper.timing = $timing;
			    	sweeper.duration =  $duration==undefined||$duration<0?0.001:$duration;
			    	if(sweeper.loop==undefined || sweeper.loop<=0) {
			    		sweeper.loop = 1;
			    	}
	    		}else{
	    			sweeper.duration =  0.001;
	    		}
	    		
		    	//-- auto remove play-class after played
		    	if(hasPlay) {
		    		
		    		//-- auto remove hidden before play animation
		    		if(sweeper.remove==undefined) {
		    			sweeper.remove = $hidden;
		    		}else if(sweeper.remove.search($hidden)<0) {
		    			sweeper.remove += ' '+$hidden;
		    		}
		    		
		    		//-- auto remove play-class after played
		    		var removePlay = sweeper.play.replace($hidden,'');
		    		if(hasSweep) {
			    		// no 'remove' then add 'remove'
			    		var	noremove = true,
			    			autoRemove = null,
			    			s,sw;
			    		for(s=0; s<length; s++) {
			    			sw = sweepers[s]; 
			    			if(typeof sw !=='string' && sw.selector==undefined) {
			    				autoRemove = sw;
				    			if(sw.remove!=undefined && sw.on==undefined && sw.selector==undefined) {
				    				// already have remove
				    				noremove = false;
					    			// remove all play classes except $hidden class
					    			sweepers[s].remove = removePlay+' '+sweepers[s].remove.replace($hidden,'');
				    				break;
				    			}
			    			}
			    		}
			    		if(noremove) {
			    			if(autoRemove==null) {
			    				sweepers[length] = {remove: removePlay};
			    				autoRemove = sweepers[length];
			    				length++;
			    			}else{
			    				autoRemove.remove = removePlay;
			    			}
			    		}
		    		}else{
		    			sweepers = [{remove: removePlay}];
		    			hasSweep = true;
		    			length = 1;
		    			sweeper.sweep = sweepers;
		    		}
		    		
		    	}// end of hasPlay
		    	
	    		//-- auto remove transition after play
		    	if(csstrans) {
		    		
		    		//-- auto remove hidden before play transition
		    		if(sweeper.remove==undefined) {
		    			sweeper.remove = $hidden;
		    		}else if(sweeper.remove.search($hidden)<0) {
		    			sweeper.remove += ' '+$hidden;
		    		}
		    		
		    		var removePlay = undefined;
		    		/*var removePlay = function (e) {
		    			var player = $.sweepPlayer;
		    			if(player.debug) player.log('remove transition for '+e.sweepID);
		    		};*/
		    		if(hasSweep) {
			    		// no active selector then add one
			    		var	noMe = true,
			    			s;
			    		for(s=0; s<length; s++) {
			    			if(typeof sweepers[s] !=='string' && sweepers[s].selector==undefined) {
			    				// already have remove
			    				noMe = false;
			    				break;
			    			}
			    		}
			    		if(noMe) {
			    			sweepers.unshift({run: removePlay});
			    			length++;
			    		}
		    		}else{
		    			sweepers = [{run: removePlay}];
		    			hasSweep = true;
		    			length = 1;
		    			sweeper.sweep = sweepers;
		    		}
		    	}// end of csstrans
			    
		    	// The sweep child that is action listener will be move to this actions array.
		    	var actions = [];
			    
		    	// handle sub sweep
	    		if(hasSweep) {
	    			
			    	// recursive drill down to sub sweep
		    		for(var i=0; i<length; i++) {
		    			if(typeof sweepers[i] ==='object' && this.handle(context,$hidden,$active,duration,timing,sweepers[i])) {
		    				// add to actions list
		    				actions.push(sweepers[i]);
		    				// remove from sweep child
		    				sweepers.splice(i--,1);
		    				length--;
		    			}
		    		}
		    		
		    		// remove sweep when had no sweep
		    		if(sweepers.length==0) {
		    			sweeper.sweep = undefined;
		    		}
		    		
	    		}
		    		
		    	// handle sub defer
	    		if(hasDefer) {
	    			
			    	// handle defers
	    			var dlength = sweeper.defer.length,
	    				d,defer;
	    			for(d=0; d<dlength; d++) {
	    				
	    				defer = sweeper.defer[d];
		    			length = defer.sweep.length;
	    				if(defer.duration==undefined) {
	    					defer.duration = 0.001;
	    				}
		    			
		    			// recursive drill down to sub sweep of defers
		    			for(var i=0; i<length; i++) {
			    			if(typeof defer.sweep[i] ==='object' && this.handle(context,$hidden,$active,duration,timing,defer.sweep[i])) {
			    				// add to actions list
			    				actions.push(defer.sweep);
			    				// remove from sweep child
			    				defer.sweep.splice(i--,1);
			    				length--;
			    			}
			    		}
		    			
			    		// remove defer when had no sweep
			    		if(defer.sweep.length==0) {
			    			sweeper.defer.splice(d--,1);
			    			dlength--;
			    		}
			    		
	    			}// end of for d=0;
	    		}
		    	
	    		// keep actions
	    		if(actions.length>0) {
	    			sweeper.actions = actions;
	    		}
		    	
	    		// capture action
		    	if(isOnAction) {
		    		var $this = this,
		    			$id = $active.get(0).sweepID;
		    		// if(this.debug) this.log('listen '+sweeper.on+' on '+$id);
		    		
		    		$active.on(sweeper.on,function (ev,arg) {
		    			// if($this.debug) $this.log('event '+ev.type+' on '+$id);
		    			sweeper.runarg = arg;
		    			$this.play(sweeper);
		    		});
		    		
		    		// true = isOnAction
		    		return true;
		    	}
		    	
	    	} // end of if(sweeper.handled==undefined)
	    	
	    	// false = isNotAction
	    	return false;
	    	
	    } // end of function handle
	    
	};// end of sweepPlayer
	
	/* jQuery Plugin */
	/**
	 * jQuery Plugin named sweep
	 * 
	 * @param sweep command string or the sweep options, please see demo for detail<br>
	 * <b>Possible commands: pause, resume, speed</b>
	 * @param speed for command 'speed' to set speed number (0.01 and up)
	 * 			or chains string for command 'chains'
	 */
	$.fn.sweep = function (sweep,speed) {
	    
		/* no item no sweep */
		if(this.length==0) {
			// if($.sweepPlayer.debug) console.warn("No element to Sweep for selector '"+this.selector+"'!!!");
			return this;
		}
		
		// player
		var player = $.sweepPlayer,
			$element = this.first(),
			element = $element.get(0),
			isCommand = typeof(sweep)==='string',
			context = isCommand?element.sweepContext:{
				
				/**
				 * array of label, add label by handle function.
				 */
				label:[],
				
				/**
				 * array of sweeper for label with the same index, get sweeper by $.sweepPlayer.sweeper function.
				 */
				sweepers:[],
				
				/**
				 * When you call waiting with active==true, this is waiting list instead of s until active==false.
				 */
				s: [],
				
				/**
				 * Flag to know this context is pause now.
				 */
				pause: false,
				
				/**
				 * Stack of sweeper when pause===false and will playAll when pause become true again. 
				 */
				play: [],
				
				/**
				 * Speed number or duration multiplier, possible values are all more than zero.
				 */
				speed: (sweep.speedx!=undefined?1.0 / sweep.speedx:(sweep.speed!=undefined?sweep.speed:1))
			
			};
		
		if(isCommand) {
			
			//-- play commands
			if(sweep==='resume') {
				for(var c in context) {
					player.resume(context[c]);
				}
				
			}else if(sweep==='pause') {
				for(var c in context) {
					player.pause(context[c]);
				}
				
				
			}else if(sweep==='speedx') {
				// speed = speedx = 1x, 1.5x, 2x, 3x
				if(speed==undefined) {
					// get speed x
					// x = 1 / speed
					return 1.0 / context[0].speed;
				}else{
					// set speed x
					// speed = 1 / x
					var speedx = 1.0 / speed;
					for(var c in context) {
						context[c].speed = speedx;
					}
				}
				
			}else if(sweep==='speed') {
				// speed = duration multiplier
				if(speed==undefined) {
					return context[0].speed;	// read speed number
				}else if(speed > 0.0) {
					for(var c in context) {
						context[c].speed = speed;		// replace speed number
					}
				}
				
			}else if(sweep === 'chains') {
				/**
				 * convert chains string to chains array for Appanel.chains function
				 * 
				 * @param speed chains string is chains#id[|chains#id] such as "-symbol--c5,symbol--c4:0.01#processing|-text--c5,text--c4:0.01#text"
				 * 			id is element id that is a child of jQuery object
				 * @return chains array please see Appanel.chains for detailed
				 */
				return speed.split("|").map(function(v) {
					v = v.split("#");
					return [v[1] === "self" ? $element : $element.find("#"+v[1]),v[0]];
				});
				
			}
			
		}else{
			
			//-- new context for animation
			
	    	//-- show debug log on firefox
	    	/*if(sweep.debug!=undefined) {
	    		player.enableDebug();
	    	}*/
			
			//-- keep options in context
			sweep = $.extend({
				/* default options */
				duration:Appanel.duration.animate,
				on: 'click touchstart'
			},sweep);
			context.sweep = sweep;
			
			//-- keep context in first element
			if(element.sweepContext==undefined) {
				element.sweepContext = [context];
			}else{
				element.sweepContext.push(context);
			}
	    	
	    	//-- inout can be used to pause and play this context
	    	if(sweep.inout!=undefined) {
	    		var inout = sweep.inout,
	    			$scope = inout.scope==undefined?$element:$(inout.scope);
	    		$(inout.scroller!=undefined?inout.scroller:'body').inout(
	    			$scope.on('inout:topin inout:bottomin',function () {
						player.resume(context);
		    		}).on('inout:topout inout:bottomout',function () {
						player.pause(context);
		    		}),
		    		inout.margin!=undefined?inout.margin:function () {return this.target.height() / 3 * -2;}
	    		);
	    	}
			
	    	//-- handle all action with default values
	    	player.handle(context,'hidden',$element,sweep.duration,sweep.timing,sweep);
	    	
	    	// see sweep after handle, debug only.
	    	// if(player.debug) player.log('ready sweep'+player.json(sweep));
	    	
	    	// ready to play
	    	$element.triggerHandler('sweep:ready');
	    	
		}
    	
	    //-- return this (jQuery Style)
	    return this;
	    
	};
	
})(Appanel,jQuery);
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