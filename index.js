const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

//State
let starship = {
    x: (canvas.width-30) / 2,
    y: (canvas.height-70),
    width: 80,
    height: 60,
    vx: 180, // px/s
    dir: 0,
}

let asteroids = [];
let gameState = 'INGAME' // 'END'
let counter = 0;
const images = {
    background: new Image(),
    starship: new Image(),
    asteroid: new Image(),
    explosion: new Image(),
}

images.asteroid.src = 'art/SeekPng.com_asteroids-png_2168369.png';
images.background.src = 'art/background.png';
images.starship.src = 'art/PngItem_851786.png';
images.explosion.src = 'art/PngItem_3262794.png';

//Helper function
function random(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

function isCollision(r1, r2) {
    return !(
            r2.y + r2.height < r1.y ||
            r2.x > r1.x + r1.width  ||
            r2.y > r1.y + r1.height ||
            r2.x + r2.width < r1.x
        )
}

//Game loop
let lastTime = performance.now();

function gameLoop(now = performance.now())
{
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    update(dt);
    draw();
    /*
        if(gameState === 'INGAME') window.requestAnimationFrame(gameLoop); 
    */
    window.requestAnimationFrame(gameLoop); 
}

function update(dt) {
    //Starship
    starship.x += starship.dir * starship.vx * dt // ds = v * dt

    //New asteroid
    if (Math.random() < 0.03) {
        asteroids.push({
            x: random(0, canvas.width),
            y: -50,
            width: random(30, 50),
            height: random(30, 50),
            vx: random(-20, 20),
            vy: random(50, 120),
        })
    }

    //Move asteroids
    asteroids.forEach(ast => {
        ast.x += ast.vx * dt;
        ast.y += ast.vy * dt;

        if (isCollision(starship, ast)) {
            gameState = 'END';
        }
    })

    //Delete asteroids
    const before = asteroids.length;
    asteroids = asteroids.filter(ast => ast.y < canvas.height);
    const after = asteroids.length;
    if (gameState !== 'END') {    
        counter += (before - after);
    }

}

function draw() {
    
    //Background
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images.background, 0, 0, canvas.width, canvas.height);
    //Starship
    //context.fillStyle = gameState === 'INGAME' ? 'orange' : 'red';
    //context.fillRect(starship.x, starship.y, starship.width, starship.height);    
    if (gameState !== 'END') {
            context.drawImage(images.starship, starship.x, starship.y, starship.width, starship.height);
    }else {
        context.drawImage(images.explosion, starship.x, starship.y, starship.width, starship.height);
    }
    
    //Asterioid
    //context.fillStyle = 'brown';
    asteroids.forEach(ast => {
        //context.fillRect(ast.x, ast.y, ast.width, ast.height)
        context.drawImage(images.asteroid, ast.x, ast.y, ast.width, ast.height);
    })
    
    //The end
    if (gameState === 'END') {
        context.fillStyle = 'white';
        context.font = '100px Courier New';
        context.fillText('The end', 75, 200);
    }

    //Counter
    context.fillStyle = 'white';
    context.font = '25px Courier New';
    context.fillText(`Points: ${counter}`, 10, 30);
}

gameLoop();

//Event listeners
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

function onKeyDown(e) {

    if (e.key === 'ArrowLeft') {
        starship.dir = -1;
    }
    else if(e.key === 'ArrowRight') {
        starship.dir = 1;
    }
}

function onKeyUp(e) {

    starship.dir = 0;
}