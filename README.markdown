BladeModal Beta
===

Overview
---

BladeModal is a jQuery plugin to create inline modals in website content. 

BladeModal is somewhat unique in that it creates the modals within the content instead of as an overlay that covers or blacks out the rest of the content on the page. BladeModal is often useful for help dialogs disperced throughout a range of content, as a way to zoom a thumbnail image, or as part of a portfolio.

Currently, BladeModal is in an early beta stage. While it is fully functional, there are a number of features that need to be added and enhanced.

Features
---

* Intelligently inserts the modal after the closest parent that is a block level element. This means it will place the content where it makes the most sense in the HTML markup. (Via an option, this is further configurable as well.)
* Had three modes for including content: images, asyncronously loaded (AJAX) content, or iframe content. The mode is chosen automatically, but can be forced with an option.
* Fully stylable with CSS.

Use
---

Typical jQuery style implementation&mdash;include jQuery and the bladeModal javascript files then target the links with a selector and fire off the method:

	<script type="text/javascript" src="path/to/jQuery.js"></script>
	<script type="text/javascript" src="path/to/jQuery.bladeModal.js"></script>
	<script type="text/javascript">

		jQuery(function(){
			jQuery('a.blade').bladeModal();
		});

	</script>

That's all there is to it. You can pass an optional array of options to the @bladeModal()@ method if you'd like. Options reference is coming, but if you need to see it, check the code.

---

Roadmap
---

1. Add the ability to show "galleries" of images and navigate through them with arrow keys, links.
