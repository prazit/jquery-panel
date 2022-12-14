/*!
 * Entry Box is single input for single field data such as profile name.
 * 
 * @name entrybox
 * @version 1.0.1
 * @requires jQuery v1+
 * @author Prazit Jitmanozot
 * 
 * Copyright (c) 2015 Prazit (R) Jitmanozot (http://Appanel.com) 
 */
/**
 * Syntax: $(selector).entrybox({options});
 */
(function($){
	
	// variables must be declare by var before use, for development only
	'use strict';

	$.entryboxactive = null;			// active entrybox
	
	$.fn.entrybox = function(options) {
		
		var defaults = {
				label: 'Entry-box:',		// the label of entry box
				text: '',					// default text
				holder: 'text',				// the holder-text appear on input box when has no text (text==empty)
				oktext: 'Ok',				// ok button
				canceltext: 'Cancel',		// cancel button
				textformat: '[^a-z0-9]',	// formatted text
				onchange: emptyfn,			// call back function that called when user change input text
				onok: emptyfn,				// call back function that called when user click on ok button
				oncancel: emptyfn,			// call back function that called when user click on cancel button or outside entrybox
				clickoutFireOk: true		// true will call 'onok' function when user click outside entrybox, false will call 'oncancel' function
			};
		
	    /**
	    * checkOffset - get the offset below/above and left/right element depending on screen position
	    * Thanks https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.datepicker.js
	    * 
	    * @param jQuery picker the container of picker
	    * @param jQuery input the input / trigger
	    */
	    function getOffset(picker, input) {
	        var 
		        extraY = 0,
		        dpWidth = picker.outerWidth(),
		        dpHeight = picker.outerHeight(),
		        inputHeight = input.outerHeight(),
		        doc = picker[0].ownerDocument,
		        docElem = doc.documentElement,
		        viewWidth = docElem.clientWidth + $(doc).scrollLeft(),
		        viewHeight = docElem.clientHeight + $(doc).scrollTop(),
		        offset = input.offset();
	        
	        offset.top += inputHeight;

	        offset.left -=
	            Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
	            Math.abs(offset.left + dpWidth - viewWidth) : 0);

	        offset.top -=
	            Math.min(offset.top, ((offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
	            Math.abs(dpHeight + inputHeight - extraY) : extraY));

	        return offset;
	    }
		
	    var
			click = 'click touchstart',
			key = 'keyup',
			emptyfn = function(){};
			
		return this.each(function(i,e){
			e.entrybox = options==undefined?$.extend({},defaults):$.extend({},defaults,options);
			
			e.entrybox.clicked = function(){
				var
					ebox = $('.entrybox.container');
				
				// create entry box (shared) for the first time
				if(ebox.length==0) {
					var html = '';						// html for entry box
	
					html +=	'<div class="entrybox container" style="position:absolute;">';
					html +=		'<div class="content">';
					html +=			'<label for="entrybox-text">&nbsp;</label>';
					html +=			'<input type="text" id="entrybox-text"/>';
					html +=		'</div>';
					html +=		'<div class="buttons">';
					html +=			'<a class="ok button">&nbsp;</a>';
					html +=			'<a class="cancel button">&nbsp;</a>';
					html +=		'</div>';
					html +=	'</div>';
					
					$('body').append(html);
					
					ebox = $('.entrybox.container');
				}
				
				var
					activebox = $.entryboxactive,
					callout = activebox != null,
					callshow = activebox !== this;
				
				if(callout) activebox.clickout();
				if(callshow) this.show();
				
			}; // end of triggerclicked
			
			e.entrybox.hide = function() {
				var
					ebox = $('.entrybox.container'),
					boxopts = $.entryboxactive;
				
				// reset active trigger
				$.entryboxactive = null;
				$(document).unbind(click,boxopts.clickout);
				
				// hide now
				ebox
					.removeClass('active')			// inactive now
					.offset({left:0,top:0})				// move to home
					.glasshole('remove');
			};
			
			e.entrybox.show = function() {
				var
					ebox = $('.entrybox.container'),
					content = ebox.find('.content'),
					input = content.find('input'),
					label = content.find('label'),
					buttons = ebox.find('.buttons'),
					ok = buttons.find('a.ok'),
					cancel = buttons.find('a.cancel'),
					$this = this;
					
				// when click on container
				ebox
					.off(click)
					.on(click,function(e){
						e.stopPropagation();
					});
				
				// when text is changed
				input
					.off(key)
					.on(key,function(e){
						// Enter
						if(e.keyCode==13) $this.clickok(e);
						
						// Esc
						else if(e.keyCode==27) $this.clickcancel(e);
						
						// Arrow keys
						else if(e.keyCode>=37 && e.keyCode<=40) {
							// to do nothing
						}
						
						// Another keys
						else{
							// replace text
							//input.val( String(input.val()).replace(new RegExp(entrybox.textformat),"") );
							// event onchange
							$this.onchange(input.val(),ebox);
						}
					});
				
				// when click on OK button
				ok
					.off(click)
					.on(click,this.clickok);
				
				// when click on Cancel button
				cancel
					.off(click)
					.on(click,this.clickcancel);
				
				// refresh content
				label.html($this.label);
				input.prop('value',$this.text).prop('placeholder',$this.holder);
				ok.html($this.oktext);
				cancel.html($this.canceltext);
				
				// then show entrybox & glasshole
				ebox
					.addClass('active')
					.offset(getOffset(ebox, $($this.trigger) ))
					.glasshole({dialogMode:true,cavity:e});
				
				// focus on input
				input.focus();
				
				// when click outside entry-box
				$.entryboxactive = $this;
				$(document).bind(click,$this.clickout);
				
			}; // end of show
			
			e.entrybox.clickout = function(e) {
	            // Return on right click.
	            if (e!=undefined && e.button == 2) return;
	            
	            // same action like click on OK button
	            if($.entryboxactive.clickoutFireOk) 
	            	$.entryboxactive.clickok();
	            else
	            	$.entryboxactive.clickcancel();
	        };
	        
	        e.entrybox.clickok = function(e) {
	        	var activebox = $.entryboxactive;
	        	
				activebox.text = $('.entrybox.container input').val();
				
				activebox.onok( activebox.text );
				
				activebox.hide();
	        };
	        
	        e.entrybox.clickcancel = function(e) {
	        	var activebox = $.entryboxactive;
	        
	        	activebox.oncancel( activebox.text );
				
	        	activebox.hide();
	        };
			
	        // make linked list between entrybox and trigger
	        e.entrybox.trigger = e;
	        
			// click on trigger to start entry-box process.
			$(this).on(click,function(ev){
				this.entrybox.clicked();
				
				// stop default action of trigger
				ev.stopPropagation();
				return false;
			});
		
		}); // end of $.each
		
	}; // end of $.entrybox
	
})(jQuery);