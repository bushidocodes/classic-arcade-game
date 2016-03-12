var score = 0;
var sprites = [
    "images/char-boy.png",
    "images/char-cat-girl.png",
    "images/char-horn-girl.png",
    "images/char-pink-girl.png",
    "images/char-princess-girl.png"
    ]
// Enemy Constructor Method.
// Parameter: y, the y location of the horizonal path taken by the enemies.
var Enemy = function(y) {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // Movement speed of enemy. Starts at random number between 100-300. Top end of range increases in proportion to player score.
    this.y = y;
    this.randomizeSpeed();
    this.randomizeDirection();
};

Enemy.prototype.randomizeSpeed = function() {
    this.speed = 100 + (200 + player.score/20) * Math.random();
};

Enemy.prototype.randomizeDirection = function() {
    // Randomly place enemies at the left or right edge of the screen and have them move horizonatally to the opposite side.
    if (Math.random() < 0.5) {
        this.x = -100;
    } else {
        this.x = 505 + 100; //TO-DO: Modify code to be able to access canvas object to get width value
        this.speed = -this.speed;
    }
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;
    // When an enemy moves off the game board, randomly assign the enemy a new speed and heading
    if (this.isOutOfBounds()) {
        this.randomizeSpeed();
        this.randomizeDirection();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if (this.speed > 0) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        //console.log(this.sprite);
    } else { // If the enemy is moving from right to left, flip the image so that the head is facing left.
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(-1, 1);
        ctx.drawImage(Resources.get(this.sprite), 0, 0); // not actually (0,0), but the coordinates passed in ctx.translate
        ctx.restore();
    }

};

// 60,145,230

// outOfBounds Convenience Function - Tests to see if an enemy moves off the game board. To ensure that the sprite is able to fully
// scroll off the screen, out of bounds is treated a 100px out of the viewable area.
Enemy.prototype.isOutOfBounds = function() {
    if (this.x > canvas.width + 100 || this.x < -100) {
        return true;
    } else {
        return false;
    }
};

var Heart = function() {
    this.sprite = 'images/Heart.png';
    this.x = -99;
    this.y = -99;
}

Heart.prototype.randomizeLocation = function() {
    var randomx = Math.floor(Math.random() * 5)
    console.log(randomx)
    switch (randomx) {
        case 0:
            this.x = 0;
            break;
        case 1:
            this.x = 100;
            break;
        case 2:
            this.x = 200;
            break;
        case 3:
            this.x = 300;
            break;
        case 4:
            this.x = 400;
            break;
    }
    var randomy = Math.floor(Math.random() * 3)
    switch (randomy) {
        case 0:
            this.y = 75;
            break;
        case 1:
            this.y = 155;
            break;
        case 2:
            this.y = 235;
            break;
    }
}

Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    console.log("Heart at " + this.x + ", " + this.y );
}

Heart.prototype.update = function(dt) {
    if (Math.random() < .0003) {
        this.randomizeLocation();
    };
}


// Player Contstructor Method
var Player = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.lives = 3;
    this.score = 0;
    this.sprite = 'images/char-cat-girl.png';
    this.x = 200;//0,100,200,300,400
    this.y = 370;//50,130,210,290,370

}
// Player Update function listens for keyboard input, moves the player on the gameboard, and handles the logic of player reaching top of screen
Player.prototype.update = function(){
    Player.prototype.handleInput = function(input){
    var verticalStep = 80; //pixels to vertically move player one square
    var horizontalStep = 100; //pixels to horizonally move player one square
    switch (input) {
        case "up":
            if ( this.y - verticalStep > 0) { //If there is a space above the player, move the player up
                this.y -= verticalStep;
            } else { //If the player reaches the top of the gameboard, respawn at the center of bottom row and add 100 points
                this.score += 100;
                console.log(this.score);
                this.x = 200;//0,100,200,300,400
                this.y = 370;//50,130,210,290,370
            }
            break;
        case "down":
            if ( this.y + verticalStep < canvas.height -160) { // If there is a space below the player, move the player down
                this.y += verticalStep;
            }
            break;
        case "left":
            if ( this.x - horizontalStep >= 0) { // If there is a space to the left of the player, move the player left
                this.x -= horizontalStep;
            }
            break;
        case "right":
            if ( this.x + horizontalStep <= canvas.width-105) { // If there is a space to the right of the player, move the player right
                this.x += horizontalStep;
            }
            break;
    }
};
};
Player.prototype.render = function(){

    //Draw the Player's score and # of lives remaining
    ctx.textAlign = "left";
    ctx.font = "30px Arial";
    ctx.clearRect(0,0,200,30);
    ctx.fillText("Score: " + this.score, 10, 30);
    ctx.clearRect(380,0,200,30);
    ctx.fillText("Lives: " + player.lives, 380,30);

    //Draw the Player's Sprite at it's current location
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // If the player is hit by an enemy, decrement the life counter. If the player is out of lives, set gameOver to true.
    // If the player still hase lives, respawn at the center of the bottom row of the gameboard.
    if (this.isHitByEnemy()) {
        this.lives--;
        if (this.lives <= 0) {
            gameOver = true;
        }
        this.x = 200;//0,100,200,300,400
        this.y = 370;//50,130,210,290,370
    }
        if (this.pickedUpHeart()) {
        this.lives++;
        heart.x = -99;
        heart.y = -99;
    }
};


// outOfBounds Convenience Function - Tests to see if an enemy moves off the game board. To ensure that the sprite is able to fully
// scroll off the screen, out of bounds is treated a 100px out of the viewable area.
Player.prototype.isOutOfBounds = function() {
    if (this.x > canvas.width + 100 || this.x < - 100) {
        return true;
    } else {
        return false;
    }
};

// The Player's isHitByEnemy function checks for player collision with an enemy based on the grid system
// If the player is in the same gameboard square as an enemy, the function returns true.
Player.prototype.isHitByEnemy = function() {
    var playerSquareX = Math.round(player.x/100);
    var playerSquareY = Math.round(player.y/80);
    var collision = false;
    allEnemies.forEach( function(enemy) {
        let enemySquareX = 0;
        let enemySquareY = Math.round((enemy.y)/80)
        if (enemy.speed < 0) {
            enemySquareX = Math.round((enemy.x-101)/100);
        } else {
            enemySquareX = Math.round(enemy.x/100);
        }
        if (playerSquareX === enemySquareX && playerSquareY === enemySquareY) {
            collision = true;
        };
    });
    return collision;
}

Player.prototype.pickedUpHeart = function() {
    var playerSquareX = Math.round(player.x/100);
    var playerSquareY = Math.round(player.y/80);
    var heartSquareX = Math.round((heart.x)/100);
    var heartSquareY = Math.round((heart.y)/80);
    if (playerSquareX === heartSquareX && playerSquareY === heartSquareY) {
        return true;
    } else {
        return false;
    };
}


// Function to allow the user to select the class of the player character
// Currently class only determines the skin of the player character.
function selectClass() {
    $(".charClass").append()
    for (var i = 0; i < sprites.length; i++) {
        $("#charClass").append("<img id='sprite-"+i+"-clicked' src=" + sprites[i] +"></img>");
        $( "#sprite-0-clicked" ).click(function() {
            player.sprite = sprites[0];
        });
        $( "#sprite-1-clicked" ).click(function() {
            player.sprite = sprites[1];
        });
        $( "#sprite-2-clicked" ).click(function() {
            player.sprite = sprites[2];
        });
        $( "#sprite-3-clicked" ).click(function() {
            player.sprite = sprites[3];
        });
        $( "#sprite-4-clicked" ).click(function() {
            player.sprite = sprites[4];
        });
    }
}

var player = new Player;
selectClass();
var heart = new Heart;
var allEnemies = [new Enemy(60), new Enemy(145), new Enemy(230)]; // Initialize one enemy per row
// init()


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