'use strict';
var sprites = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'];

/**
 * @description Represents an enemy. Invokes radomizeSpeed() and randomizeDirection() methods upon instantiation.
 * @constructor
 * @param {number} yInTiles - the row that the enemy should spawn in, counting from the top starting at 0.
 */
var Enemy = function(yInTiles) {
    this.sprite = 'images/enemy-bug.png';
    this.yInTiles = yInTiles;
    this.x = 0 - TILE_WIDTH;
    this.xInTiles = Math.floor(this.x / TILE_WIDTH); //Because the enemy moves continuously, xInTiles is a derived value based on the pixel location
    this.randomizeSpeed();
    this.randomizeDirection();
};

/**
 * @description Sets enemy's speed attribute to random value. Starts at random number between 100-300. Top end of range increases in proportion to player score.
 */
Enemy.prototype.randomizeSpeed = function() {
    this.speed = 100 + (200 + player.score/20) * Math.random();
};

/**
 * @description Randomly place enemies at the left or right edge of the screen and have them move horizonatally to the opposite side.
 */
Enemy.prototype.randomizeDirection = function() {
    if (Math.random() < 0.5) {
        this.x = (0 - TILE_WIDTH);
    } else {
        this.x = ((numCols)*TILE_WIDTH); //one column to the right of the screen because we are starting at 0
        this.speed = -this.speed;
    }
};

/**
 * @description Update the enemy's position on the game board and randomly assign the enemy a new speed and heading when it moves off the gameboard
 * @param {number} dt - a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    this.x += dt * this.speed;
    this.xInTiles = Math.floor(this.x / TILE_WIDTH);
    //console.log(this.xInTiles);
    if (this.isOutOfBounds()) {
        this.randomizeSpeed();
        this.randomizeDirection();
    }
};

/**
 * @description Draw the enemy on the screen, including flipping the enemy sprite if the enemy is moving from right to left,
 */
Enemy.prototype.render = function() {
    if (this.speed > 0) {
        ctx.drawImage(Resources.get(this.sprite), this.x - Resources.get(this.sprite).width/2 + SPRITE_X_OFFSET, this.yInTiles * TILE_HEIGHT - Resources.get(this.sprite).height/2 + SPRITE_Y_OFFSET);
        //ctx.fillRect( this.x + SPRITE_X_OFFSET, this.yInTiles * TILE_HEIGHT + SPRITE_Y_OFFSET, 10, 10);
    } else {
        ctx.save();
        ctx.translate(this.x, this.yInTiles * TILE_HEIGHT);
        ctx.scale(-1, 1);
        ctx.drawImage(Resources.get(this.sprite), 0 - Resources.get(this.sprite).width/2 + SPRITE_X_OFFSET, 0 - Resources.get(this.sprite).height/2 + SPRITE_Y_OFFSET); // not actually (0,0), but the coordinates passed in ctx.translate. Offset by width of sprite to keep coordinates at top left of image
        //ctx.fillRect( 0 + SPRITE_X_OFFSET, 0 + SPRITE_Y_OFFSET, 10, 10);
        ctx.restore();
    }
};

/**
 * @description outOfBounds Convenience Function - Tests to see if an enemy moves off the game board. To ensure that the sprite is able to fully scroll off the screen, out of bounds is treated a 100px out of the viewable area.
 * @returns {boolean} - true means that the enemy is off the gameboard
 */
Enemy.prototype.isOutOfBounds = function() {
    if (this.xInTiles < -1 || this.xInTiles > numCols) {
        ////console.log("Enemy is out of bounds");
        return true;
    } else {
        return false;
    }
};

/**
 * @description Represents an Item, intended to act as an abstract superclass for the different types of items generated in the game. Items are created off the gameboard by default.
 * @constructor
 */
var Item = function() {
    this.xInTiles = -1;
    this.yInTiles = -1;
};

/**
 * @description randomizeLocation() function places game items on random square in the top three rows of the gameboard, where the enemies spawn.
 */
Item.prototype.randomizeLocation = function() {
    this.xInTiles = Math.floor(Math.random() * numCols);
    // switch (randomx) {
    //     case 0:
    //         this.x = 0;
    //         break;
    //     case 1:
    //         this.x = 100;
    //         break;
    //     case 2:
    //         this.x = 200;
    //         break;
    //     case 3:
    //         this.x = 300;
    //         break;
    //     case 4:
    //         this.x = 400;
    //         break;
    // }
    this.yInTiles = Math.floor(Math.random() * (numRows-1) + 1); // randomly select a row other than row 0
    // switch (randomy) {
    //     case 0:
    //         this.y = 75;
    //         break;
    //     case 1:
    //         this.y = 155;
    //         break;
    //     case 2:
    //         this.y = 235;
    //         break;
    // }
};

/**
 * @description Draw the item on the screen.
 */
Item.prototype.render = function() {
    //ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    //ctx.drawImage(Resources.get(this.sprite), this.xInTiles * TILE_WIDTH, this.yInTiles * TILE_HEIGHT + SPRITE_Y_OFFSET);
    ctx.drawImage(Resources.get(this.sprite), this.xInTiles * TILE_WIDTH - Resources.get(this.sprite).width/2 + SPRITE_X_OFFSET, this.yInTiles * TILE_HEIGHT - Resources.get(this.sprite).height/2 + SPRITE_Y_OFFSET);
    //ctx.fillRect( this.xInTiles * TILE_WIDTH + SPRITE_X_OFFSET, this.yInTiles * TILE_HEIGHT + SPRITE_Y_OFFSET, 10, 10);
};

/**
 * @description At random intervals, moves the Item to a random locations on the gameboard.
 * @param {number} dt - a time delta between ticks
 */
//
Item.prototype.update = function(dt) {
    Math.random() < 0.0003 ? this.randomizeLocation() : null;
    // if (Math.random() < 0.0003) {
    //     this.randomizeLocation();
    // }
};

/**
 * @description Represents an Heart.
 * @constructor
 */
var Heart = function() {
    Item.call(this);
    this.sprite = 'images/Heart.png';
};

Heart.prototype = Object.create(Item.prototype);
Heart.prototype.constructor = Heart;

/**
 * @description Represents a Blue Gem.
 * @constructor
 */
var BlueGem = function() {
    Item.call(this);
    this.sprite = 'images/Gem Blue.png';
};

BlueGem.prototype = Object.create(Item.prototype);
BlueGem.prototype.constructor = BlueGem;

/**
 * @description Represents a Green Gem.
 * @constructor
 */
var GreenGem = function() {
    Item.call(this);
    this.sprite = 'images/Gem Green.png';
};

GreenGem.prototype = Object.create(Item.prototype);
GreenGem.prototype.constructor = GreenGem;

/**
 * @description Represents a Orange Gem.
 * @constructor
 */
var OrangeGem = function() {
    Item.call(this);
    this.sprite = 'images/Gem Orange.png';
};

OrangeGem.prototype = Object.create(Item.prototype);
OrangeGem.prototype.constructor = OrangeGem;

/**
 * @description Represents a Player.
 * @constructor
 */
var Player = function() {
    this.lives = 3;
    this.score = 0;
    this.sprite = 'images/char-cat-girl.png';
    this.moveToStart();
};

/**
 * @description Moves the Player back to the starting square
 * @constructor
 */
Player.prototype.moveToStart = function () {
    this.xInTiles = 2;
    this.yInTiles = 5;
}

/**
 * @description listens for keyboard input, moves the player on the gameboard, and handles the logic of player reaching top of screen
 */
Player.prototype.update = function(){
    Player.prototype.handleInput = function(input){
    switch (input) {
        case 'up':
            if ( this.yInTiles - 1 > 0) { //If there is a space above the player, move the player up
                this.yInTiles--;
            } else { //If the player reaches the top of the gameboard represented by row 0, respawn at the center of bottom row and add 100 points
                this.score += 100;
                this.moveToStart();
            }
            break;
        case 'down':
            if ( this.yInTiles + 1 < numRows) { // If there is a space below the player, move the player down
                this.yInTiles++;
            }
            break;
        case 'left':
            if ( this.xInTiles - 1 >= 0) { // If there is a space to the left of the player, move the player left
                this.xInTiles--;
            }
            break;
        case 'right':
            if ( this.xInTiles + 1 < numCols) { // If there is a space to the right of the player, move the player right
                this.xInTiles ++;
            }
            break;
        }
    };
};

/**
 * @description Draw the score, # of lives, and the player sprite on the screen. Also contains the logic for outcome logic when the player touches enemies and items.
 */
Player.prototype.render = function(){
    // Draw the score, # of lives
    ctx.textAlign = 'left';
    ctx.font = '30px Arial';
    ctx.clearRect(0,0,200,30);
    ctx.fillText('Score: ' + this.score, 10, 30);
    ctx.clearRect(380,0,200,30);
    ctx.fillText('Lives: ' + player.lives, 380,30);

    ctx.drawImage(Resources.get(this.sprite), this.xInTiles * TILE_WIDTH - Resources.get(this.sprite).width/2 + SPRITE_X_OFFSET, this.yInTiles * TILE_HEIGHT - Resources.get(this.sprite).height/2 + SPRITE_Y_OFFSET);
    //ctx.fillRect( this.xInTiles * TILE_WIDTH + SPRITE_X_OFFSET, this.yInTiles * TILE_HEIGHT + SPRITE_Y_OFFSET, 10, 10);

    // If the player is hit by an enemy, decrement the life counter. If the player is out of lives, set gameOver to true.
    // If the player still hase lives, respawn at the center of the bottom row of the gameboard.
    if (this.isHitByEnemy()) {
        this.lives--;
        gameOver = this.lives <= 0 ? true : false;
        // if (this.lives <= 0) {
        //     gameOver = true;
        // }
            this.moveToStart();
    }
    // This logic determines the outcome of picking up the item.
    // TODO: Shift Logic into a method called impact() for each respective item.
    let item = this.pickedUpItem();
    if (this.pickedUpItem() != null) {
        if (item instanceof Heart) {
            this.lives++;
        } else if (item instanceof BlueGem) {
            this.score += 50;
        } else if (item instanceof OrangeGem) {
            this.score += 100;
        } else if (item instanceof GreenGem) {
            this.score += 150;
        }
        item.xInTiles = -1;
        item.yInTiles = -1;
    }
};

// /**
//  * @description outOfBounds Convenience Function - Tests to see if an player moves off the game board. To ensure that the sprite is able to fully scroll off the screen, out of bounds is treated a 100px out of the viewable area.
//  * @returns {boolean} - true means that the player is off the gameboard
//  */
// Player.prototype.isOutOfBounds = function() {
//     this.x > canvas.width + 100 || this.x < - 100 ? true : false;
//     // if (this.x > canvas.width + 100 || this.x < - 100) {
//     //     return true;
//     // } else {
//     //     return false;
//     // }
// };

/**
 * @description isHitByEnemy Convenience Function - checks for player collision with an enemy based on the grid system.
 * @returns {boolean} - true means that the player is in the same gameboard square as an enemy
 */
Player.prototype.isHitByEnemy = function() {
    // var playerSquareX = Math.round(player.x/TILE_WIDTH);
    // var playerSquareY = Math.round(player.y/TILE_HEIGHT);
    // //console.log(player.y);
    // //console.log('Player is at (' + playerSquareX + ',' + playerSquareY +')');
    var collision = false;
    allEnemies.forEach( function(enemy) {
        // let enemySquareX = 0;
        // let enemySquareY = Math.round((enemy.y)/TILE_HEIGHT);
        // //console.log(enemy.y);
        // enemySquareX = enemy.speed < 0 ? Math.round((enemy.x-TILE_WIDTH)/TILE_WIDTH) : Math.round(enemy.x/TILE_WIDTH);
        // if (enemy.speed < 0) {
        //     enemySquareX = Math.round((enemy.x-101)/100);
        // } else {
        //     enemySquareX = Math.round(enemy.x/100);
        // }
        // collision = (playerSquareX === enemySquareX && playerSquareY === enemySquareY) ? true : false;
        ////console.log('Enemy is at (' + enemySquareX + ',' + enemySquareY +')');
        if (player.xInTiles === enemy.xInTiles && player.yInTiles === enemy.yInTiles) {
            collision = true;
            ////console.log("collision");
        }
    });
    return collision;
};

/**
 * @description pickedUpItem Convenience Function - checks for player collision with an item based on the grid system.
 * @returns {Item} - the item that is in the same grid square as the player
 */
Player.prototype.pickedUpItem = function() {
    // var playerSquareX = Math.round(player.x/100);
    // var playerSquareY = Math.round(player.y/80);
    var pickUp = null;
    allItems.forEach( function(item) {
        // let itemSquareX = Math.round((item.x)/100);
        // let itemSquareY = Math.round((item.y)/80);
        //pickUp = (playerSquareX === itemSquareX && playerSquareY === itemSquareY) ? item : null;
        if (player.xInTiles === item.xInTiles && player.yInTiles === item.yInTiles) {
            pickUp = item;
        }
    });
    return pickUp;
};

/**
 * @description Function to allow the user to select the class of the player character. Currently class only determines the skin of the player character.
 */
function selectClass() {
    for (var i = 0; i < sprites.length; i++) {
        $('#charClass').append('<img id="sprite-'+i+'-clicked" src=' + sprites[i] +'></img>');
        $( '#sprite-0-clicked' ).click(function() {
            player.sprite = sprites[0];
        });
        $( '#sprite-1-clicked' ).click(function() {
            player.sprite = sprites[1];
        });
        $( '#sprite-2-clicked' ).click(function() {
            player.sprite = sprites[2];
        });
        $( '#sprite-3-clicked' ).click(function() {
            player.sprite = sprites[3];
        });
        $( '#sprite-4-clicked' ).click(function() {
            player.sprite = sprites[4];
        });
    }
}


// Now instantiate your objects.
// Place the player object in a variable called player
// Append the Character Class Selector to the web page
// Place all enemy objects in an array called allEnemies
// Place all item objects in an array called allItems
//var score = 0;
var numRows = 6;
var numCols = 5;
var TILE_HEIGHT = 83; //pixels to vertically move player one square
var TILE_WIDTH = 101; //pixels to horizonally move player one square
var SPRITE_X_OFFSET = TILE_WIDTH / 2;
var SPRITE_Y_OFFSET = 60;
var player, allEnemies, allItems;
selectClass();
//var allEnemies = [new Enemy(64), new Enemy(147), new Enemy(230)]; // Initialize one enemy per row
//var allItems = [new Heart(), new BlueGem(), new GreenGem(), new OrangeGem()];


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