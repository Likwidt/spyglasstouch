/* The MIT License (MIT)

Copyright (c) 2013 Thierry Blais

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/


	
(function($){
	//detect touch support
	$.support.touch = 'ontouchend' in document;
	var down = ($.support.touch) ? 'touchstart' : 'mousedown',
		move =($.support.touch) ? 'touchmove' : 'mousemove',
		up = ($.support.touch) ? 'touchend' : 'mouseup',
		splitEvent = function(e){ //This doesn't work on Chrome and FF on windows 8 as far as I know
			if (e.originalEvent.touches){ //if touches detected use touches
				return [e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY];
				} else { //if not use mouse
					return [e.pageX, e.pageY];
					}
			};
	$.fn.spyglass = function( options ){
		if (!this.data('spyGlass')) {
			this.data('spyGlass', true);
		var winWidth = $(window).width(), //I use this so much I might as well only calculate it only once
			settings = $.extend({
				addClass: '',
				width: winWidth*0.4,
				height: winWidth*0.4,
				xDistance: winWidth*0.05,
				yDistance: winWidth*0.05,
				zoom: 4
				}, options);
		return this.each(function(index, elem){
			$(elem).on(down, function(event){
				$(document).on('scrollstart', false); //disable scrolling during spyglass
				var $this = $(event.target), //this image
			
					bigImage = $(document.createElement('div'), {'class': "sg-zoom", 'style': 'position:absolute'}).addClass(settings.addClass).css({	//the enhanced partial image frame
									background: 			'url("' + event.target.src + '") no-repeat left top',
									'background-size':		$this.width()*settings.zoom + 'px ' + $this.height()*settings.zoom + 'px',
									width: 					settings.width, 
									height:					settings.height
								}),
				
					//image borders		
					imgTop = $this.offset().top, 
					imgBottom = imgTop + $this.height(),
					imgLeft = $this.offset().left,
					imgRight = imgLeft + $this.width(),
				
					newPos =	function(a){ //calc position of bigImage
					//a refers to an array containing the even'ts x and y position as defined in splitEvent()
									var zoomWidth = bigImage.width(),//zoom window width
										zoomHeight =  bigImage.height(),//zoom window height
										zoomLeft = a[0] + settings.xDistance, //natural left border of zoom window
										zoomBottom = a[1] - settings.yDistance, //natural bottom border of zoom window
										zoomTop = zoomBottom - zoomHeight, //natural top border of zoom window
										zoomRight = zoomLeft + zoomWidth, //natural right border of zoom window										
										dd = Math.abs(zoomRight - a[0]),
										newLeft = (zoomLeft > 0) ? (zoomRight > winWidth) ? zoomLeft - zoomWidth - (2*settings.xDistance) : zoomLeft : a[0] + dd /*if the zoom window is to the left of the pointer I cannot rely on settings.xDistance for an accurate desired distance because I must assume that xDistance is a relatively large negative value so instead I position the left border at the point coordinats + the distance set by the userbetween the xoom window and the pointer*/,
										newTop = (zoomTop < 0) ? a[1] + settings.yDistance : zoomTop;									
									return {left: newLeft, top: newTop};		
								},
					
					newImgPos =	function(a){ //calc position of bigImage background
									var newLeft = ((a[0] - imgLeft) * settings.zoom) - (bigImage.width()/2),
										newTop = ((a[1] - imgTop) * settings.zoom) - (bigImage.height()/2),
										rightLimit = ($this.width()*settings.zoom)-bigImage.width(), //calculates the horizontal point at which the zoom screen background will move outside of the zoom mask's area
										topLimit = ($this.height()*settings.zoom) - bigImage.height(); ////calculates the vertical point at which the zoom screen background will move ouside of the zoom mask's area
									return -((newLeft>0) ? (newLeft<rightLimit) ? newLeft : rightLimit : 0) + 'px ' + -((newTop<topLimit) ? (newTop>0) ? newTop : 0 : topLimit)  + 'px';
								}; 
					
					$('body').append(bigImage); //attach bigImage to the view
					bigImage	.offset(newPos(splitEvent(event)))
								.css('background-position', newImgPos(splitEvent(event)));//initial position for bigImage		
					$this	.on(move,function(e){
								bigImage.offset(newPos(splitEvent(e))).css('background-position', newImgPos(splitEvent(e)));})
							.attr('draggable', false); //this is just so the image doesn't drag while I test in chrome. 
					$(document).on(up, function(e){
						bigImage.remove(); //remove bigImage
						$this.off(move); //disable move
						$(document).off('scrollstart');
						});
			});
		});
	}
	}
})(jQuery);