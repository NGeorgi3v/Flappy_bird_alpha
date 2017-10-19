(function(){
	//Declaring canvas and it's dimensions
	var canvas = document.getElementById("playground"),
	ctx = canvas.getContext('2d');
	canvas.setAttribute("width", "600px");
	canvas.setAttribute("height", "400px");
	var height = canvas.height,
		width = canvas.width;

	//Basic SetUp..
	ctx.fillStyle = "#000";
	ctx.beginPath();
	ctx.rect(0,0,width,height);
	ctx.fill();
	ctx.closePath();
	ctx.fillStyle = "#fff";
	ctx.font = "30px Verdana";
	ctx.beginPath();
	ctx.fillText("Press enter to start!", 15, height/2);
	ctx.font = "15px Verdana";
	ctx.fillText("(Jump with space)", 15, (height/2) + 35);
	ctx.closePath();


	//Declaring Bird and Pipes
	var bird = new Bird();
	var pipes = [];
	var frameCount = 0;
	var hit = false;
	
	//Random Number Function
	function getRandomNumber(min, max) {
	    return Math.random() * (max - min) + min;
	}

	//Keypress event handler....
	document.body.onkeyup = function(e){
		if(e.keyCode == 32){
			bird.up();
		}else if(e.keyCode == 13){
			startNewGame();
		}
	};

	//Bird contstructor
	function Bird(){
		this.y = height/2;
		this.x = 25;
		this.radius = 15;
		this.gravity = 0.5;
		this.velocity = 0;
		this.upForce = -16;
		this.airResisstance = 0.9


		this.show = function(){
			ctx.fillStyle = "#fff";
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
			ctx.fill();
			ctx.closePath();
		}// Bird.show - END

		this.up = function(){
			this.velocity += this.upForce;
		}// Bird.up - END

		this.passed = function(pipe){
			if(pipe.x+pipe.w == this.x-this.radius  && pipe.hit == false){
				return true;
			}
		}

		this.update = function(){
			this.velocity *= this.airResisstance;
			this.velocity += this.gravity;
			this.y += this.velocity;

			if(this.y > height-this.radius ) {
				this.y = height-this.radius;
				this.velocity = 0;
			}

			if(this.y < this.radius ) {
				this.y = this.radius;
				this.velocity = 0;
			}
		}// Bird.update - END
	}// Bird Constructor - END 
	
	//Pipe construnctor
	function Pipe(){
		this.spacing = getRandomNumber(100, height/4);
		this.centery = getRandomNumber(this.spacing, height-this.spacing);

		this.top = this.centery - this.spacing/2;
		this.bottom = height - (this.centery + this.spacing/2);
		this.x = width;
		this.w = 20;
		this.speed = 2;
		this.highlight = false;
		this.hit = false;

		this.show = function(){
			ctx.fillStyle = "#fff";
			if(this.highlight){
				ctx.fillStyle = "#f00";
			}
			ctx.beginPath();
			ctx.moveTo(this.x, 0);
			ctx.rect(this.x, 0, this.w, this.top);
			ctx.moveTo(this.x, height-this.bottom);
			ctx.rect(this.x, height-this.bottom, this.w, this.bottom);
			ctx.fill();
			ctx.closePath(); 
		}// Pipe.show - END

		this.offscreen = function(){
			if(this.x < -this.w){
				return true;
			}
		}// Pipe.offscreen - END

		this.hits = function(bird){
			if(bird.y < this.top+bird.radius || bird.y+bird.radius > height - this.bottom){
				if(bird.x > this.x-bird.radius && bird.x-bird.radius < this.x+this.w){
					this.highlight = true;
					this.hit = true;
					return true;
				}
			}
			this.highlight = false;
			return false;
		}// Pipe.hits(bird) - END

		this.update = function(){
			this.x -= this.speed;
		}// Pipe.update - END

	}

	//Main Function
	function startNewGame(){
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = "#000";
		ctx.beginPath();
		ctx.rect(0,0,width,height);
		ctx.fill();
		ctx.closePath();
		bird.show();
		requestAnimationFrame(updateFrame);
	}

	//Animation Function
	function updateFrame(){
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = "#000";
		ctx.beginPath();
		ctx.rect(0,0,width,height);
		ctx.fill();
		ctx.closePath();

		for(var i = pipes.length-1; i >= 0; i--){
			pipes[i].show();
			pipes[i].update();
			if(pipes[i].offscreen()){
				pipes.splice(i, 1);
			}
			if(pipes[i].hits(bird)){
				console.log("HIT");
				hit = true;
			}else if(bird.passed(pipes[i])){
				console.log("POINT");
			}
		}

		bird.update();
		bird.show();

		if(frameCount % 100 == 0){
			pipes.push(new Pipe());
		}
		frameCount++
		requestAnimationFrame(updateFrame);
	}
}());