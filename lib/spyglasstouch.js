// JavaScript Document

var down = 'touchstart',
	move = 'touchmove',
	up = 'touchend';

$(document).on(down, '.spyglass', function(event){
	var winWidth = $(window).width(), //I use this so much I might as well only calculate it once
	
		$this = $(event.target), //this image
		
		bigImage = $('<div class="bigImage" />').css({
			background: 'url("' + event.target.src + '") no-repeat left top',
			'background-size': $this.width()*4 + 'px ' + $this.height()*4 + 'px',
			width: winWidth*0.4, 
			height:winWidth*0.4
			}),//the enhanced partial image frame
			
		decal = winWidth*0.02, //need a standard decal for bigImage
		
		imgTop = $this.offset().top,
		imgBottom = imgTop + $this.height(),
		imgLeft = $this.offset().left,
		imgRight = imgLeft + $this.width(),
		
		newPos = function(xPos, yPos){ //clac position of bigImage
			var newLeft = xPos + decal,
				newTop = yPos - bigImage.height() - decal;
			return {left: newLeft, top: newTop};		
			},
			
		newImgPos = function(xPos, yPos){
			var newLeft = ((xPos - imgLeft) * 4) - (bigImage.width()/2),
				newTop = ((yPos - imgTop) * 4) - (bigImage.height()/2);
			return -((newLeft>0) ? newLeft : 0) + 'px ' + -((newTop<($this.height()*4 - bigImage.height())) ? newTop : $this.height()*4 - bigImage.height()) + 'px';
			}; 
			
	$('body').append(bigImage); //attach bigImage to the view
	bigImage.offset(newPos(event.pageX, event.pageY))
			.css('background-position', newImgPos(event.pageX, event.pageY));//initial position for bigImage		
	$this	.on(move, function(e){
				bigImage.offset(newPos(e.pageX, e.pageY))
						.css('background-position', newImgPos(e.pageX, e.pageY));
			})
			.attr('draggable', false); //this is just so the image doesn't drag while I test. 
	$(document).on(up, function(e){
		bigImage.remove(); //remove bigImage
		$this.off(move); //disable move
	});
});