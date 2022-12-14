/*!
 * Change tag of element
 * 
 * Attributes that will be transferred:
 * - class, id and src attributes will be transferred to iframe
 * 
 * Take effect to the First element of selector.
 * 
 * @name toTag
 * @version 1.0.4
 * @requires jQuery v1+
 * @author Prazit Jitmanozot
 * 
 * Copyright (c) 2015 Prazit (R) Jitmanozot (http://Appanel.com)
 */
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