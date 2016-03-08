var score = 0;
var sprites = [
    "images/char-boy.png",
    "images/char-cat-girl.png",
    "images/char-horn-girl.png",
    "images/char-pink-girl.png",
    "images/char-princess-girl.png"
    ]
// Enemies our player must avoid
var Enemy = function(y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // MVP is set speed. TODO: Randomly generate enemy speed
    this.speed = 100 + 200 * Math.random() + score/20;


    if (Math.random() < 0.5) {
        this.x = -100;
    } else {
        this.x = 505 + 100; //use canvas width
        this.speed = -this.speed;
    }

    this.y = y; // 60,145,230
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;
    // console.log(" pre testing bounds");
    if (this.isOutOfBounds()) {
        // console.log(this.x + " is out of bounds");

        this.speed = 100 + 200 * Math.random() + score/20;
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
        console.log(this.sprite);
        // ctx.fillRect(this.x ,this.y,5,5);
    } else {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(-1, 1);
        //ctx.rotate(Math.PI);
        ctx.drawImage(Resources.get(this.sprite), 0, 0);
        // ctx.fillRect(0,0,5,5);
        //ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        //ctx.rotate(Math.PI);
        ctx.restore();
    }

};

// outOfBounds Convenience
Enemy.prototype.isOutOfBounds = function() {
    // console.log("testing bounds");
    // console.log(canvas.width);
    // console.log(this.x);
    if (this.x > canvas.width + 100 || this.x < - 100) {
        return true;
    } else {
        return false;
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.lives = 3;
    this.sprite = 'images/char-cat-girl.png';
    this.x = 200;//0,100,200,300,400
    this.y = 370;//50,130,210,290,370

}
Player.prototype.update = function(){
    Player.prototype.handleInput = function(input){
    var verticalStep = 80;
    var horizontalStep = 100;
    switch (input) {
        case "up":
            if ( this.y - verticalStep > 0) {
                // console.log ((this.y - verticalStep) + " > " + 0);
                this.y -= verticalStep;
            } else {
                score += 100;
                this.x = 200;//0,100,200,300,400
                this.y = 370;//50,130,210,290,370
            }
            break;
        case "down":
            if ( this.y + verticalStep < canvas.height -160) {
                // console.log ((this.y + verticalStep) + " < " + (canvas.height- 160));
                this.y += verticalStep;
            }
            break;
        case "left":
            if ( this.x - horizontalStep >= 0) {
                this.x -= horizontalStep;
                // console.log(this.x);
            }
            break;
        case "right":
            if ( this.x + horizontalStep <= canvas.width-105) {
                this.x += horizontalStep;
                // console.log(this.x  + " <= " + (canvas.width-105));
            }
            break;
    }
    // if (input === "up") {
    //     this.y -= 80;
    // }
    console.log(input);
};
};
Player.prototype.render = function(){
    ctx.font = "30px Arial";
    ctx.clearRect(0,0,200,30);
    ctx.fillText("Score: " + score, 10, 30);
    ctx.clearRect(380,0,200,30);
    ctx.fillText("Lives: " + player.lives, 380,30);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // ctx.fillRect(this.x,this.y,5,5);
    if (this.isDead()) {
        console.log("You died");
        player.lives--;
        if (player.lives <= 0) {
            gameOver = true;
            console.log("game over");
        }

        this.x = 200;//0,100,200,300,400
        this.y = 370;//50,130,210,290,370
    } else {
        //console.log("not dead");
    }
};


// outOfBounds Convenience
Player.prototype.isOutOfBounds = function() {
    // console.log("testing bounds");
    // console.log(canvas.width);
    // console.log(this.x);
    if (this.x > canvas.width + 100 || this.x < - 100) {
        return true;
    } else {
        return false;
    }
};

Player.prototype.isDead = function() {
    var playerSquareX = Math.round(player.x/100);
    var playerSquareY = Math.round(player.y/80);
    var collision = false;
    //console.log("Player in tile " + playerSquareX + ", " + playerSquareY);
    allEnemies.forEach( function(enemy) {
        let enemySquareX = 0;
        if (enemy.speed < 0) {
            enemySquareX = Math.round((enemy.x-101)/100);
        } else {
            enemySquareX = Math.round(enemy.x/100);
        }
        var enemySquareY = Math.round(enemy.y/80);
        // console.log(enemy.x);
        //console.log("Enemy in tile " + enemySquareX + ", " + enemySquareY);
        if (playerSquareX === enemySquareX && playerSquareY === enemySquareY) {
            //console.log("collision");
            collision = true;
        };
    });
    return collision;
}

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




        // console.log(sprites[1]);
        // ctx.font ="30px Arial";
        // ctx.fillText("Select Class", canvas.width/2,50);
        // ctx.drawImage(Resources.get(sprites[i]), canvas.width/5*i, 100);
        // //classOffset += 100;
    }
    // ctx.clearRect(0,0,canvas.width,canvas.height);
    // sprites.forEach( function(sprite){
    //     ctx.drawImage(Resources.get(sprite), classOffset, 10);

    // });


}



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
