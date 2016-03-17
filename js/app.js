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
    this.resizeFactor = 0.5;
};

/**
 * @description randomizeLocation() function places game items on random square in the top three rows of the gameboard, where the enemies spawn.
 */
Item.prototype.randomizeLocation = function() {
    this.xInTiles = Math.floor(Math.random() * numCols);
    this.yInTiles = Math.floor(Math.random() * (numRows-1-2) + 1); // randomly select rows 1, 2, or 3. Avoid rows 0, 4, or 5.
};

/**
 * @description Draw the item on the screen.
 */
Item.prototype.render = function() {
    //ctx.drawImage(Resources.get(this.sprite), this.xInTiles * TILE_WIDTH, this.yInTiles * TILE_HEIGHT + SPRITE_Y_OFFSET);
    ctx.drawImage(
        Resources.get(this.sprite),
        this.xInTiles * TILE_WIDTH - Resources.get(this.sprite).width*this.resizeFactor/2 + SPRITE_X_OFFSET,
        this.yInTiles * TILE_HEIGHT - Resources.get(this.sprite).height*this.resizeFactor/2 + SPRITE_Y_OFFSET,
        Resources.get(this.sprite).width * this.resizeFactor,
        Resources.get(this.sprite).height * this.resizeFactor
    );
    //ctx.fillRect( this.xInTiles * TILE_WIDTH + SPRITE_X_OFFSET, this.yInTiles * TILE_HEIGHT + SPRITE_Y_OFFSET, 10, 10);
};

/**
 * @description At random intervals, moves the Item to a random locations on the gameboard.
 * @param {number} dt - a time delta between ticks
 */
//
Item.prototype.update = function(dt) {
    Math.random() < 0.0003 ? this.randomizeLocation() : null;
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

/**
 * @description isHitByEnemy Convenience Function - checks for player collision with an enemy based on the grid system.
 * @returns {boolean} - true means that the player is in the same gameboard square as an enemy
 */
//TODO: modify initial test to check if in same or adjascent tiles and add detailed test based on geometric overlays that approximate sprites.
Player.prototype.isHitByEnemy = function() {
    var collision = false;
    allEnemies.forEach( function(enemy) {
        if (player.xInTiles === enemy.xInTiles && player.yInTiles === enemy.yInTiles) {
            collision = true;
        }
    });
    return collision;
};

/**
 * @description pickedUpItem Convenience Function - checks for player collision with an item based on the grid system.
 * @returns {Item} - the item that is in the same grid square as the player
 */
Player.prototype.pickedUpItem = function() {
    var pickUp = null;
    allItems.forEach( function(item) {
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


// variable declarations
var numRows = 6;
var numCols = 5;
var TILE_HEIGHT = 83; //pixels to vertically move player one square
var TILE_WIDTH = 101; //pixels to horizonally move player one square
var SPRITE_X_OFFSET = TILE_WIDTH / 2;
var SPRITE_Y_OFFSET = 60;
var player, allEnemies, allItems;
selectClass();

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