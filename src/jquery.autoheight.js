/*!
 * Auto calculate height to fit parent, start at top of element.
 * 
 * Take effect to all element of selector.
 * 
 * @name autoheight
 * @version 1.0.2
 * @requires jQuery v1+
 * @author Prazit Jitmanozot
 * 
 * Copyright (c) 2015 Prazit (R) Jitmanozot (http://Appanel.com)
 */
(function($){
	
	// variables must be declare by var before use, for development only
	'use strict';

	$.autoheight = function($parent){
		$parent.find('[auto-height]').each(function(){
	    	var
	    		$this = $(this).css({marginTop:0,marginBottom:0}),				// element must have no margin
	    		$parent = $this.parent().css({paddingTop:0,paddingBottom:0}),	// parent must have no padding
	    		$height = $parent.innerHeight() - $this.offset().top;
	    	if($height>0) {
	    		$this.css({height:$height});
	    	}
		});
	};
	
	function autoheight() {
		$.autoheight($('body'));
	}
	
	autoheight();
	
	Appanel.router.on('resize',autoheight);
	
})(jQuery);