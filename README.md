Classic Arcade Game
===============================

Classic Arcade Game is an overhead view action game reminiscent of games like Frogger. The game is built upon the HTML5 canvas element.

![](/images/classicArcadeGameScreenshotSmall.png)

Story
==============================
The Sprite Kingdom is under attack by the elite Swarm Brigade of the Bug Imperium, and the Sprite Castle has fallen! In his last dying breath, the King asked all sprite subjects to flee to royal ships waiting to evacuate. Save as many sprites as you can, being sure to grab as much treasure as possible.

How To Play
===============================

Keyboard Controls: Directional Arrows
Touch Controls: Not yet developed. Stay tuned!

Your sprite generates at the bottom of the game board, and the central objective is to evade the swarm and reach the fleet just off the coast. A single hit by a bug results in the sudden death of the sprite, decreasing your life count by one and regenerating a new sprite if you have lives remaining. Upon reaching the top of the board, your sprite has escaped, awarding you 100 points, and a new sprite appear at the bottom of the screen. Save as many sprites as you can before you run out of lives, but be careful, as the Swarm Brigade speeds up as you build up points. As your sprite escapes, be on the lookout for the appearance of items on the gameboard, including hearts, which provides extra life, and gems, which increase the player's score by a value that varies based on the gem color. You start with three lives, and running out of lives results in a Game Over.

Run on the Web
===============================
[Play me on spmcb.com](http://spmcb.com/classic-arcade-game/)

Local Installation
===============================

In BASH
```Bash
$ git clone https://github.com/spmcbride1201/classic-arcade-game
$ cd classic-arcade-game
$ open index.html
```

In PowerShell
```PowerShell
git clone https://github.com/spmcbride1201/classic-arcade-game
cd classic-arcade-game
Start-Process -FilePath index.html
```

**Note: The source currently is bundled with JQuery 2.2 and Bootstrap 3.3.6, and the files are intermingled in the js, css, font directories. I intend to clean up dependencies in the future through bower or npm.**

Credits
===============================

The underlying gameloop and image assets for this game were provided by the Udacity team. This project is forked from the repo containing the skeleton assets. My contributions were primarily around the game logic and Javascript objects for the players, enemies, and items. If you wish to isolate my code contributions, clone my repository and use the commit `c7ea9^!`

As this was built as a submission to a Udacity Front-End Web Developer Nanodegree, you can check out the detailed instructions on this project in this [guide](https://docs.google.com/document/d/1v01aScPjSWCCWQLIpFqvg3-vXLH2e8_SZQKC8jNO0Dc/pub?embedded=true)
and view the project's [grading rubric](https://www.udacity.com/course/viewer/#!/c-nd001/l-2696458597/m-2687128535) if you want to whip out your red pen.

Associated courses for this project include:
- [OO JavaScript by HackReactor](https://www.udacity.com/course/object-oriented-javascript--ud015)
- [HTML5 Canvas](https://www.udacity.com/course/html5-canvas--ud292)

I also sporadically referred to [Pro HTML5 Games by Aditya Ravi Shankar](http://www.amazon.com/HTML5-Games-Experts-Voice-Development/dp/143024710X). His [browser implementation of my childhood favorite Command & Conquer](http://www.adityaravishankar.com/projects/games/command-and-conquer/) convinced me that HTML5 canvas can be a seriously powerful tool.