(function(){
	//Declaring canvas
	var canvas = document.getElementById("playground"),
	ctx = canvas.getContext('2d');
	if(window.innerWidth > 1200){
		canvas.setAttribute("width", "800px");
		canvas.setAttribute("height", "600px");
	}else{
		canvas.setAttribute("width", "600px");
		canvas.setAttribute("height", "400px");
	}
	//canvas dimensions and background
	var height = canvas.height,
		width = canvas.width,
		bird, pipes, animate, frameCount, drawnGame;

	//Random Number Function
	function getRandomNumber(min, max) { return Math.random() * (max - min) + min;}

	//Bird object
	function Bird(){
		this.y = height/2;
		if(width>600){  }
	}

	//Game object
	function Game(){
		//Initialisation function
		this.init = function(){
			this.resetValues();
			this.draw_bg();
			this.showText("Press any key to start!", "30px", "#fff", 25, height/2);
		}

		this.draw_bg = function(){
			ctx.fillStyle = "#000";
			ctx.beginPath();
			ctx.rect(0, 0, width, height);
			ctx.fill();
			ctx.closePath();
		}

		this.showText = function(text, size, color, x, y){
			this.text = text;
			this.size = size;
			this.color = color;
			this.x = x;
			this.y = y;

			ctx.fillStyle = this.color;
			ctx.font = this.size + " Verdana";
			ctx.beginPath();
			ctx.fillText(this.text, x, y);
			ctx.closePath();
		}

		this.resetValues = function(){
			animate = false;
			frameCount = 0;
			drawnGame = false;
		}

		this.isDrawn = function(){
			if(drawnGame){
				return true;
			}
			return false;
		}

		this.draw = function(){
			this.draw_bg();
			this.showText("Press space to jump", 30, "#fff", width/2, height/2);
			drawnGame = true;
		}

		this.start = function(){
			this.draw_bg();
			animate = true;
			console.log("Entered animation frame!");
		}
	}

	 var MyGame = new Game();
	 MyGame.init();

	//Keypress event handler....
	document.body.onkeyup = function(e){
		if(!MyGame.isDrawn()){
			MyGame.draw();
		}else{
			if(!animate && e.keyCode == 32){
				MyGame.start();
				console.log("Here bird has to start jumping 1st time");
			}else if(animate && e.keyCode == 32){
				console.log("Here bird continues jumping");
			}
		}
	};	 
}());