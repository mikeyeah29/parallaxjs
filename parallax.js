/*

	HOW TO USE

	--> Give a section / div an id
	--> Fill with parallax items using the class prx_item
	--> Set start and finish percentages with data attributes

	<section class="post_section mbp_parallax" id="parallax">
	
		<div class="prx_item" data-prx_start="10" data-prx_finish="90">
			<img src="<?php echo get_bloginfo('template_directory'); ?>/img/placeholder1.png" />
		</div>

		<div class="prx_item" data-prx_start="-30" data-prx_finish="70">
			<img src="<?php echo get_bloginfo('template_directory'); ?>/img/placeholder2.png" />
		</div>

	</section>

	IMPROVEMENTS

	-> Make an option for start decimal

*/

window.Parallax = (function($){
	
	function Parallax(id, startDecimal, fullScreen){

		this.fullScreen = fullScreen || false;

		this.startDecimal = startDecimal || 0.2;

		this.container = $('#' + id);
		this.containerTop = this.container.offset().top;
		this.containerHeight = this.container.outerHeight();
		var containerPos = this.containerTop - this.containerHeight;
		this.parallaxElements = this.container.find('.prx_item');
		this.percentComplete = 0;
		this.windowHeight = $(window).height();

		if(this.fullScreen){
			// 0% in view
			this.startScrollPos = this.containerTop;
		}else{
			// 20% in view
			this.startScrollPos = (this.containerTop - this.windowHeight) + (this.windowHeight / 5);
		}

		var thisParallax = this;

		// initial positions
		this.parallaxElements.each(function(){
			var startTop = thisParallax.percentageToPxs(thisParallax.containerHeight, $(this).data('prx_start') );
			// $(this).data('start_pixels', startTop - (thisParallax.getParallaxElementHeight($(this)) / 2) );
			// $(this).css('top', startTop - (thisParallax.getParallaxElementHeight($(this)) / 2) );
			$(this).data('start_pixels', startTop);
			$(this).css('top', startTop);
			$(this).data('percent_complete', 0);
		});

		window.addEventListener("scroll", function(){

			var scr = this.scrollY;
			// if parallax container is 20% in view
			if(scr >= thisParallax.startScrollPos){
				// move parallax items
				thisParallax.animateItems(scr);
			}

		});

		// WINDOW RESIZE

			// update certain variables

	}

	// Parallax.prototype.getParallaxElementHeight = function(container){

	// 	var height = 0;

	// 	container.children().each(function(){
	// 		height = height + $(this).outerHeight();
	// 	});

	// 	return height;

	// };

	Parallax.prototype.percentageToPxs = function(height, percent){
		return (height / 100) * percent;
	};

	Parallax.prototype.getTop = function(start, finish, startPxs){

		var sRes = 100 - start;
		var fRes = 100 - finish;
		var percentageRange = sRes - fRes;
		var pxRange = this.percentageToPxs(this.container.outerHeight(), percentageRange);

		return this.percentageToPxs(pxRange, this.percentComplete) + startPxs;

	};

	Parallax.prototype.animateItems = function(scr){

		var thisParallax = this;
		thisParallax.percentComplete = thisParallax.getPercentageComplete(scr - this.startScrollPos);

		this.parallaxElements.each(function(){
			
		 	var prx_start = $(this).data('prx_start');
		 	var prx_finish = $(this).data('prx_finish');
		 	var startPxs = $(this).data('start_pixels');

		 	// console.log($(this), ' ', thisParallax.percentComplete);

		//	if(thisParallax.percentComplete < 100){
				var top = thisParallax.getTop(prx_start, prx_finish, startPxs);
		 		$(this).css('top', top + 'px');
		 //	}

		});

	};

	Parallax.prototype.getPercentageComplete = function(scr){

		/* 
			This is only to calclate how much of the screen has been scrolled
			It has NOTHING to do with the container height
		 */

		var scrollStart = this.startScrollPos;

		// 0.6 to finish 20% before the top or 0.8 to finish once at the top
		var scrollRange = this.windowHeight * 0.8;

		// how far into the scrollrange are we?...
		var pxsOver = scr - (scrollStart / scrollRange);
		var percentage = Math.round((pxsOver / scrollRange) * 100);

		return percentage;

	};

	return Parallax;

})(jQuery);