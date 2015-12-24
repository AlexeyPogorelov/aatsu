window.onload = function() {
	var drawingCanvas = document.getElementById('background-layers'),
		winWidth = window.innerWidth,
		winHeight = window.innerHeight;
	drawingCanvas.style.width = winWidth + 'px';
	drawingCanvas.style.height = winHeight + 'px';
	if(drawingCanvas && drawingCanvas.getContext) {
		var ctx = drawingCanvas.getContext('2d');
		var pic = new Image();
		pic.src = 'img/bg/1.jpg';
		pic.onload = function() {
			ctx.drawImage(pic, 0, 0);
		}

		ctx.save();
		
		// Create a shape, of some sort
		ctx.beginPath();
		ctx.arc(40, 40, 40, 0, Math.PI * 2, false);
		// Clip to the current path
		ctx.clip();
		
		ctx.drawImage(pic, 0, 0);
		
		// Undo the clipping
		// ctx.restore();
	}
}