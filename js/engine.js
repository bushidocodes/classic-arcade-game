/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */
'use strict';
var gameOver = false;
var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    $('main').append(canvas);

    //var score = 0;

    /**
     * @description serves as the kickoff point for the game loop itself, including calling the update and render methods. Also contains the game over logic
     */
    function main() {

        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        if (!gameOver) {
            update(dt);
            render();

            /* Set our lastTime variable which is used to determine the time delta
            * for the next time this function is called.
            */
            lastTime = now;



        } else {
            // Draw the Game Over Screen
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.textAlign = 'center';
            ctx.font = '60px Arial';
            ctx.fillText('GAME OVER', canvas.width/2,200);
            ctx.fillText(player.score + ' points', canvas.width/2,300);
        };
        /* Use the browser's requestAnimationFrame function to call this
        * function again as soon as the browser is able to draw another frame.
        */
        win.requestAnimationFrame(main);


    }

    /**
     * @description This function does some initial setup that should only occur once, particularly setting the lastTime variable that is required for the game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /*
     * @description Calls updateEntities(). This is an alternate hook for collission detection, but is currently unused.
     */
    function update(dt) {
        updateEntities(dt);
    }

    /*
     * @description Loops through all of the objects within your allEnemies array as defined in app.js and calls their update() methods. It will then call the update function for your player object. These update methods should focus purely on updating the data/properties related to the object. Do your drawing in your render methods.
     * @param {number} dt - a time delta between ticks
     */
    function updateEntities(dt) {
        if (allEnemies != null) {
            allEnemies.forEach(function(enemy) {
                enemy.update(dt);
            });
        };

        if (player) {
            player.update();
        };

        if (allItems != null) {
            allItems.forEach(function(item) {
                item.update(dt);
            });
        }
    }

    /*
     * @description Invoked every game tick (loop of the game engine). Draws the gameboard and then calls renderEntities()
     */

    function render() {
        /*
         * This array holds the relative URL to the image used for that particular row of the game level.
         * This means that each row has the same tile type.
         */
        // TODO: Allow for variation of tile types within a row
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * TILE_WIDTH, row * TILE_HEIGHT);
            }
        }

        renderEntities();
    }

    /*
     * @description Invoked by the render function and thus called on each game tick (loop of the game engine).
     * Calls the render functions you have defined in the player, item, and enemy entities in app.js
     */
    function renderEntities() {
        allEnemies.forEach(function (enemy) {
            enemy.render();
        });

        player.render();

        allItems.forEach(function (item) {
            item.render();
        });
    }

    /*
     * @description Clears gameOver state, resets score, and reinstatiates player, enemies, and items.
     */
    function reset() {
        gameOver = false;
        //var score = 0;
        player = new Player();
        allEnemies = [new Enemy(1), new Enemy(2), new Enemy(3)];
        allItems = [new Heart(), new BlueGem(), new GreenGem(), new OrangeGem()];
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Heart.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
    // Make canvas global to be able to use width and height for in-bounds checking.
    global.canvas = canvas;
    global.init = init;
})(this);
