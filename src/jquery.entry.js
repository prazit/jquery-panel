/*!
 * Entry service is jQuery Plugin to add control to all inputs inside one container element,
 * after call this service, the container element had entry controller object within. 
 * 
 * Take effect to all element in selector, each as container element.
 * 
 * @name entry
 * @version 1.1.4
 * @requires jQuery for Appanel
 * @author Prazit Jitmanozot
 * 
 * Copyright (c) Since 2016 Prazit (R) Jitmanozot (http://Appanel.com)
 */
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