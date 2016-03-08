// Enemies our player must avoid
var Enemy = function(y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // MVP is set speed. TODO: Randomly generate enemy speed
    this.speed = 150 * Math.random() + 50;


    if (Math.random() < 0.5) {
        this.x = -100;
    } else {
        this.x = 505 + 100; //use canvas width
        this.speed = -this.speed;
    }

    this.y = y;//60,145,230
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;
    console.log(" pre testing bounds");
    if (this.isOutOfBounds()) {
        console.log(this.x + " is out of bounds");

        this.speed = 150 * Math.random() + 50;
        if (Math.random() < 0.5) {
            this.x = -100;
        } else {
            this.x = 505 + 100; //use canvas width
            this.speed = -this.speed;
        }
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if (this.speed > 0) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    } else {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(-1, 1);
        //ctx.rotate(Math.PI);
        ctx.drawImage(Resources.get(this.sprite), 0, 0);
        //ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        //ctx.rotate(Math.PI);
        ctx.restore();
    }

};

// outOfBounds Convenience
Enemy.prototype.isOutOfBounds = function() {
    console.log("testing bounds");
    console.log(canvas.width);
    console.log(this.x);
    if (this.x > canvas.width + 100 || this.x < - 100) {
        return true;
    } else {
        return false;
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {}
Player.prototype.update = function(){};
Player.prototype.render = function(){};
Player.prototype.handleInput = function(){};




// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(60), new Enemy(145), new Enemy(230)];
var player = new Player;


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
