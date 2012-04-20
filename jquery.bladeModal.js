/*
 * BladeModal - An plug in to general inline modal content windows.
 * Examples and documentation at: http://rewdy.com/blademodal
 * Version: 1 (03/2011)
 * Copyright (c) 2011 Andrew Meyer
 * Licensed under the MIT License: http://en.wikipedia.org/wiki/MIT_License
 * Requires:	jQuery v1.4+
 *				jQuery UI - effects component
*/

(function(jQuery) {
	jQuery.fn.bladeModal = function(opt){
		
		// define default options
		var defaults = {
			duration: 500, 					// length of time for transition
			action: 'auto', 				// determines how to display content. can be iframe, img, or ajax. 
			scrollToViewClearance: 15, 		// space below the modal after it scrolls into view
			appendAfter: 'p,div,ul,ol,h1,h2,h3,h4,h5,h6,blockquote,table' // selector. items to search for to append the content after
		};
		
		var options = jQuery.extend(defaults, opt);
		
		return this.each(function(index){
			el = jQuery(this);
			// tests to see if element is an anchor with an href. If it's not, we leave it alone.
			if (el.is('a[href]')) {
				// set some vars for each element
				var url = el.attr('href');
				var bladeId = 'blade_' + index;
				var action = (options.action == 'auto') ? determineAction(url) : options.action;
				
				// apply event handler for the links
				el.click(function(){
					if (jQuery('#'+bladeId).length===0) {
						// blade hasn't been built yet...
						// so, append the blade markup after the closest block level element:
						jQuery(this).closest(options.appendAfter).after('<div id="'+bladeId+'" class="bladeModal bladeModal_loading"><div class="bladeModal_contents"></div><a href="#close" class="close">Close</a></div>');
						// alias var to blade holder div
						var blade = jQuery('#'+bladeId);
						// set height to 1px
						blade.height(1);
						// alias var to the content div inside current blade
						var target = blade.find('.bladeModal_contents');
						// give the content div a class for styling based on content type
						target.addClass("bladeModal_"+action+"_type");
						// perform action based on the type of url
						switch (action) {
							case "iframe":
								// if external content, append an iframe
								target.append('<iframe src="'+url+'" frameborder="0" />');
								// hide it as the content is loading
								target.find('iframe').hide();
								// after it's load, show it and scroll so it's in view
								target.find('iframe').load(function(){
									jQuery(this).show();
									blade.height(target.find('iframe').height());
									blade.switchClass('bladeModal_loading','bladeModal_loaded',options.duration).removeClass('bladeModal_loading');
									scrollToView(blade);
								});
								// done
								break;
							case "img":
								// determine target width (max width) for images
								targetWidth = (target.innerWidth()*1)-40;
								// append the image tag, with alt tag :)
								target.append('<img alt="bladeModal Image" />');
								// make alias variable for the attached img
								img = target.find('img');
								// set the src url
								img.attr('src', url);
								// after the image is finished loading, adjust the size if 
								// need be, then show it, and make sure it's scrolled into view.
								img.load(function(){
									// if img is wider then max
									if (img.width() > targetWidth) {
										// calculate new height
										var newHeight = (targetWidth * img.innerHeight()) / img.width();
										// set width to target; set height to newly calculated height.
										img.width(targetWidth).height(newHeight);
									}
									// set the blade holder height to the img height
									blade.height(img.height());
									// show and scroll into view.
									blade.switchClass('bladeModal_loading','bladeModal_loaded',options.duration).removeClass('bladeModal_loading');
									scrollToView(blade);
								});
								// done
								break;
							default:
								// default is trying to include the content via an ajax call
								// load content, then show it, and scroll into view
								target.load(url, function(){
									// switch classes
									blade.switchClass('bladeModal_loading','bladeModal_loaded','fast').removeClass('bladeModal_loading');

									// get height of loaded content
									newheight = target.outerHeight(true);
									// get the needed extra space from margins of first and last element of appended content. This is sort of a weird necessity, but the height is wrong without it.
									extraSpace = target.children().first().css('margin-top').replace('px','') * 1;
									extraSpace += target.children().last().css('margin-bottom').replace('px', '') * 1;
									// add the extra space to the height we'll need
									newheight += extraSpace;
									// set the height.
									//blade.height(newheight);
									blade.animate({
										height: newheight
									}, options.duration);

									scrollToView(blade);
								});
						}
						// apply close link event handler
						blade.find('.close').click(function(){
							closeBlade(blade);
							return false;
						});
					} else {
						// blade has already been built, so close it.
						closeBlade(jQuery('#'+bladeId));
					}
					return false;
				});
			}
		});
		
		
		// various utility functions
		// **************************************************************
		// Private function that determines how to handle each type of url
		// Currently, only support for external urls, images, and local files is supported.
		function determineAction(string) {
			if (string.indexOf('http')>=0) {
				return 'iframe';	
			} else if (string.match(/(\.jpg|\.gif|\.png)$/)) {
				return 'img';
			} else {
				return 'div';
			}
		}
		
		// Private function to scroll an element into view
		// Note: only checks to see if elements are below the viewable
		// area. Doesn't check for elements above. Due to the functionality
		// of the plugin, this is all that is necessary.
		function scrollToView(el) {
			// el must be a jquery object
			// element calculations
			var elTop = jQuery(el).offset().top;
			var elLowestPoint = elTop+jQuery(el).outerHeight();
			
			// window calculations
			var windowHeight = jQuery(window).outerHeight();
			var pageOffsetTop = jQuery(document).scrollTop();
			var windowVisibleBottom = windowHeight + pageOffsetTop;
			
			if (elLowestPoint > windowVisibleBottom) {
				// element is out of view, scroll down...
				var scrollDifference = elLowestPoint - windowVisibleBottom;
				var newScrollTop = (pageOffsetTop + scrollDifference) + options.scrollToViewClearance;
				// if the showing the bottom of the image will hide the top, scroll to the top instead...
				if (newScrollTop > elTop) { newScrollTop = elTop; }
				// animate the scroll to the new position...
				jQuery('html, body').animate({scrollTop:newScrollTop}, options.duration);
			}
			// No ...else... needed. If element is not out of view, nothing needs to happen.
		}
		
		
		// Private function to close a blade. Function exposed elsewhere.
		function closeBlade(el) {
			// el is jquery object for the modal/s to close
			jQuery(el).animate({
					height: 0,
					paddingTop: 0,
					paddingBottom: 0,
					marginTop: 0,
					marginBottom: 0,
					opacity: 0
				},
				options.duration, function(){
				jQuery(this).remove();
			});
		}
		
	};
	// finished; return jQuery objects.
})(jQuery);