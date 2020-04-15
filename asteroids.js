let canvas;
let ctx;
let canvasWidth = 1400;
let canvasHeight = 700;
let keys = [];
let bullets = [];
let asteroids = [];
let ship;

// Adding event listener to setup the canvas when everything is loaded
document.addEventListener('DOMContentLoaded', setupCanvas);

function degreesToRadians(angle){
    return angle / Math.PI * 180;
}

function setupCanvas() {
    canvas = document.getElementById("my-canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = "black";
    ctx.fillRect(9, 0, canvas.width, canvas.height);

    ship = new Ship();

    for(let i = 0; i < 8; i++){
        asteroids.push(new Asteroid());
    }

    document.body.addEventListener("keydown", function(e){
        keys[e.keyCode] = true;
    });

    document.body.addEventListener("keyup", function(e){
        keys[e.keyCode] = false;
        
        // 32 is the code for Space Bar
            if(e.keyCode === 32){
                bullets.push(new Bullet(ship.angle));
            }
    });

    Render();
}

class Ship {
    constructor(){
        this.visible = true;
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.movingForward = false;
        this.speed = 0.1;
        this.velX = 0;
        this.velY = 0;
        this.rotateSpeed = 0.001;
        this.radius = 15;
        this.angle = 0;
        this.strokeColor = "white";
        this.noseX = canvasWidth / 2 + 15;
        this.noseY = canvasHeight / 2;
    }

    Rotate(dir){
        this.angle += this.rotateSpeed * dir;
    }

    Update() {
        let radians = degreesToRadians(this.angle);

        if(this.movingForward){
            // oldX + cos(radians) * distance
            this.velX += Math.cos(radians) * this.speed;

            // oldY + sin(radians) * distance
            this.velY += Math.sin(radians) * this.speed;
        }

        if(this.x < this.radius){
            this.x = canvas.width;
        }
    
        if(this.x > canvas.width){
            this.x = this.radius;
        }
    
        if(this.y < this.radius){
            this.y = canvas.height;
        }
    
        if(this.y > canvas.height){
            this.y = this.radius;
        }

        this.velX *= 0.99;
        this.velY *= 0.99;

        this.x -= this.velX;
        this.y -= this.velY;

    }

    Draw(){
        ctx.strokeStyle = this.strokeColor;
        ctx.beginPath();
        
        let vertAngle = ((Math.PI * 2) / 3);
        var radians = degreesToRadians(this.angle);

        this.noseX = this.x - this.radius * Math.cos(radians);
        this.noseY = this.y - this.radius * Math.sin(radians);

        for(let i = 0; i < 3; i++){
            ctx.lineTo(
                this.x - this.radius * Math.cos(vertAngle * i + radians), 
                this.y - this.radius * Math.sin(vertAngle * i + radians)
            );
        }
        ctx.closePath();
        ctx.stroke();
    }

}

class Bullet {
    constructor(angle){
        this.visible = true;
        this.x = ship.noseX;
        this.y = ship.noseY;
        this.angle = angle;
        this.height = 4;
        this.width = 4;
        this.speed = 5;
        this.velX = 0;
        this.velY = 0;
    }

    Update(){
        var radians = degreesToRadians(this.angle);
        this.x -= Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed;
    }

    Draw(){
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Asteroid {
    constructor(x, y){
        this.visible = true;
        this.x = Math.floor(Math.random() * canvasWidth);
        this.y = Math.floor(Math.random() * canvasHeight);
        this.speed = 1;
        this.radius = 50;
        this.angle = Math.floor(Math.random() * 359);
        this.strokeColor = 'white';
    }

    Update() {
        var radians = degreesToRadians(this.angle);
        this.x += Math.cos(radians)* this.speed;
        this.y += Math.sin(radians) * this.speed;

        if(this.x < this.radius){
            this.x = canvas.width;
        }
    
        if(this.x > canvas.width){
            this.x = this.radius;
        }
    
        if(this.y < this.radius){
            this.y = canvas.height;
        }
    
        if(this.y > canvas.height){
            this.y = this.radius;
        }
    }

    Draw(){
        ctx.beginPath();
        let vertAngle = ((Math.PI * 2) / 6);
        var radians = degreesToRadians(this.angle);
        for(let i = 0; i < 6; i++){
            ctx.lineTo(
                this.x - this.radius * Math.cos(vertAngle * i + radians), 
                this.y - this.radius * Math.sin(vertAngle * i + radians)
            );
        }
        ctx.closePath();
        ctx.stroke();
    }
}

function Render() {
    // 87 is the 'W' key
    ship.movingForward = (keys[87]);
    
    // 68 is the "D" key
    if(keys[68]){
        ship.Rotate(1);
    }

    // 65 is the "A" key
    if(keys[65]){
        ship.Rotate(-1);
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ship.Update();
    ship.Draw();

    if(bullets.length !== 0){
        for(let i = 0; i < bullets.length; i++){
            bullets[i].Update();
            bullets[i].Draw();
        }
    }

    if(asteroids.length !== 0){
        for(let j = 0; j < asteroids.length; j++){
            asteroids[j].Update();
            asteroids[j].Draw();
        }
    }

    requestAnimationFrame(Render);
}