/*!
 * CSS Class Sweep is jQuery plugin, it's part of Appanel Styler Suite. 
 * This will change css class for more than one element in one action, it's designed to work with chains of Animated CSS.
 * 
 * Take effect to the First element of selector.
 * 
 * @name sweep
 * @version 1.4.3
 * @requires jQuery for Appanel.com
 * @author Prazit Jitmanozot
 * 
 * Copyright (c) 2016 Prazit (R) Jitmanozot (http://Appanel.com)
 */
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