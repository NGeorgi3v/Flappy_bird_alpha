//main2.js
(function (){
	var canvas = document.getElementById("playground"),
		ctx = canvas.getContext('2d');
	canvas.setAttribute("width", (window.innerWidth-50) + "px");
	canvas.setAttribute("height", (window.innerHeight-60) + "px");
	window.onresize = function(){
		canvas.setAttribute("width", (window.innerWidth-50) + "px");
		canvas.setAttribute("height", (window.innerHeight-60) + "px");
	};
	var bird_data = {
			x: 50,
			y: canvas.height/2,
			radius: 35,
			downForce: 1,
			upForce: 20,
			speed: 1
		},
		pipe_data = {
			width: 40,
			emptySpace: 200,
			minHeight: 30,
			height: 0,
			x: canvas.width,
			y: 0,
			speed: 3 
		},
		pipeCounter, pointCounter, animate, bird,pipes
		newGameButton = document.getElementById("new_game_button");

	newGameButton.onclick = function() {
		newGameButton.blur();
		newGameButton.style.display = "none";
		pipeCounter = 0,
		pointCounter = 0,
		animate = true,
		bird = new Bird(bird_data.x,
						bird_data.y, 
						bird_data.radius, 
						bird_data.downForce, 
						bird_data.upForce, 
						bird_data.speed),
		pipes = [];
		pipes.push(new Pipe(pipe_data.width, pipe_data.emptySpace, pipe_data.minHeight, pipe_data.height, pipe_data.x, pipe_data.y, pipe_data.speed));
		bird.draw();
		requestAnimationFrame(animationFrame);
	};

	//Random Number Function
	function getRandomNumber(min, max) {
	    return Math.random() * (max - min) + min;
	}

	//Bird constructor
	function Bird(x, y, radius,  downForce, upForce, speed){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.downForce = downForce;
		this.upForce = upForce;
		this.speed = speed;
		//Function for drawing the bird in the playground
		this.draw = function(){
			ctx.fillStyle = "#e74c3c";
			ctx.beginPath();
			ctx.moveTo(this.x+this.radius-4, this.y-this.radius/2);
			ctx.lineTo(this.x+this.radius*1.7, this.y);
			ctx.lineTo(this.x+this.radius, this.y);
			ctx.stroke();
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(this.x+this.radius, this.y);
			ctx.lineTo(this.x+this.radius*1.7, this.y);
			ctx.lineTo(this.x+this.radius-4, this.y+this.radius/2);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
			ctx.fillStyle = "#f1c40f";
			ctx.beginPath();
			ctx.arc(this.x,
					this.y, 
					this.radius, 
					0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
			ctx.fillStyle = "#f4f4f4";
			ctx.beginPath();
			ctx.arc(this.x+(this.radius/3),
					this.y-(this.radius/3), 
					this.radius/4,
					0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
			ctx.fillStyle = "#000";
			ctx.beginPath();
			ctx.arc(this.x+(this.radius/2.5),
					this.y-(this.radius/3.5),
					this.radius/10,
					0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
			console.log("x: " + this.x + " ,y: "+ this.y);
		};

		this.move = function(){
			if(this.y > canvas.height-this.radius || this.y <= this.radius)
			{
				animate = false;
			}else{
				this.speed += this.downForce;
				this.speed *= 0.9;
				this.y += this.speed;
				ctx.fill();
			}
		};

		this.jump = function(){
			this.speed += -(this.upForce*1.2);
			this.y += this.speed;
		}
	}

	//Pipe constructor
	function Pipe(width, emptySpace, minHeight, height, x, y, speed){
		this.width = width;
		this.emptySpace = emptySpace;
		this.minHeight = minHeight;
		this.height = getRandomNumber(minHeight, canvas.height-(minHeight+emptySpace));
		this.height2 = canvas.height - (this.height + this.emptySpace);
		this.x = x;
		this.y = y;
		this.y2 = this.height + this.emptySpace;
		this.speed = speed;

		this.draw = function(){
			ctx.fillStyle = "#27ae60";
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.rect(this.x, this.y, this.width, this.height);
			ctx.moveTo(this.x, this.y2);
			ctx.rect(this.x, this.y2, this.width, this.height2);
			ctx.fill();
		};

		this.move = function(){
			this.x -= this.speed;
		};

		this.hits = function(bird){
			bird.y <= this.height || bird.y > this.y2
			bird.x > this.x || bird.x <= (this.w + this.x)
			if( (bird.y <= this.height || bird.y > this.y2) && (bird.x > this.x || bird.x <= (this.w + this.x)) ){
				animate = false;
			}
		};
	}
	
	function animationFrame(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		if(pipeCounter == 100)
		{
			pipes.push(new Pipe(pipe_data.width, pipe_data.emptySpace, pipe_data.minHeight, pipe_data.height, pipe_data.x, pipe_data.y, pipe_data.speed));
			pipeCounter = 0;
		}else{
			pipeCounter++;
		}
		bird.move();
		bird.draw();
		for(var i = 0; i < pipes.length; i++)
		{
			pipes[i].draw();
			pipes[i].move();
			
			if(pipes[i].hits(bird)){
				animate = false;			
			}

			if(pipes[i].x == 0)
			{
				pipes.splice(i, 1);
			}
		}
		if(animate){
			requestAnimationFrame(animationFrame);
		}else{
			newGameButton.style.display = "block";
		}
	}
	
	document.body.onkeyup = function(e){
		if(e.keyCode == 87 && animate){
			bird.jump();
		}
	};
}());