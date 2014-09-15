(function() {
'use strict';

var Level_12 = function(game) {};

Level_12.prototype = Object.create(Level.prototype);
Level_12.prototype.constructor = Level_12;

Level_12.prototype.preload = function()
{ console.log('== level-12 preload'); };

Level_12.prototype.create = function()
{
    console.log('== level-12 create');

    // -- World
    this.game.world.setBounds(0, 0, 3200, 3000);

    // -- Background
    this.bg = this.add.tileSprite(0, 0, 128*40, 600, 'bg');
    this.bgTransition = this.add.tileSprite(0, 600, 128*40, 600, 'bg-transition');
    this.bgBelow = this.add.tileSprite(0, 1200, 128*40, 1800, 'bg-below');

    // -- Zack
    this.player = new Player(this.game, 200, 100);
    //this.player = new Player(this.game, 2800, 1900);
    this.player.sounds.kill = this.add.audio('kill', 1);
    this.player.sounds.hurt = this.add.audio('hurt', 1);

    // -- Lasers
    for (var i = 0; i < 5; i++) {
        new Laser(this.game, 2534, 1650 - i*100, this.player, 1000, 100, i*200, 400, 'x', true);
    }

    // -- Ground
    this.walls = this.add.group();
    this.walls.enableBody = true;

    var bounds = [
        // -- Upper
        // Ground & Left tunnel wall
        [700, 2700, 0, 300],

        // Left wall
        [100, 300, 0, 0],

        // Right tunnel wall
        [1000, 2600, 1100, 0],

        // -- Bottom
        [1000, 100, 700, 2900],

        [450, 100, 1900, 2900],
        [200, 200, 2350, 2800],
        [200, 300, 2550, 2700],
        [500, 1000, 2750, 2000],

        // -- The way up
        // Right wall
        [100, 200, 3100, 1800],
        [500, 600, 2750, 1200],
        [1100, 200, 2100, 700],
        [100, 300, 3100, 900],

        // Resting steps
        [300, 50, 2100, 1800],

        [100, 32, 2150, 1700],
        [100, 32, 2450, 1600],
        [100, 32, 2150, 1500],
        [100, 32, 2450, 1400],
        [100, 32, 2150, 1300],
        [100, 32, 2450, 1200],
    ];

    for (var i = 0; i < bounds.length; i++) {
        var bitmap = this.add.bitmapData(bounds[i][0], bounds[i][1]);
        bitmap.fill(49, 23, 49, 1);
        bounds[i] = this.add.sprite(
            bounds[i][2], bounds[i][3], bitmap, this.walls
        );
    }

    this.walls.addMultiple(bounds);
    this.walls.setAll('body.immovable', true);
    this.walls.setAll('body.allowGravity', false);

    // -- Door
    new Door(this.game, 2900, 1200-128, this.player, 'level-13');

    // -- Falling Platforms
    this.plats = [
        // Here are the digging stuffs
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1200, y: 2850 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1200, y: 2800 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1200, y: 2750 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1200, y: 2700 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1200, y: 2650 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1200, y: 2600 }),

        new FallingPlatform(this.game, { w: 100, h: 50, x: 1300, y: 2850 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1300, y: 2800 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1300, y: 2750 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1300, y: 2700 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1300, y: 2650 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1300, y: 2600 }),

        new FallingPlatform(this.game, { w: 100, h: 50, x: 1400, y: 2850 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1400, y: 2800 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1400, y: 2750 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1400, y: 2700 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1400, y: 2650 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1400, y: 2600 }),

        new FallingPlatform(this.game, { w: 100, h: 50, x: 1500, y: 2850 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1500, y: 2800 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1500, y: 2750 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1500, y: 2700 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1500, y: 2650 }),
        new FallingPlatform(this.game, { w: 100, h: 50, x: 1500, y: 2600 }),

        // Here are the real falling platforms
        new FallingPlatform(this.game, { w: 100, h: 32, x: 2300, y: 2600 }),
        new FallingPlatform(this.game, { w: 100, h: 32, x: 2150, y: 2500 }),
        new FallingPlatform(this.game, { w: 100, h: 32, x: 2450, y: 2400 }),
        new FallingPlatform(this.game, { w: 100, h: 32, x: 2600, y: 2300 }),
        new FallingPlatform(this.game, { w: 100, h: 32, x: 2300, y: 2200 }),
        new FallingPlatform(this.game, { w: 100, h: 32, x: 2600, y: 2100 }),

        new FallingPlatform(this.game, { w: 100, h: 32, x: 2450, y: 1900 }),

        /*
        // Laser platforms
        new FallingPlatform(this.game, { w: 100, h: 32, x: 2150, y: 1700 }),
        new FallingPlatform(this.game, { w: 100, h: 32, x: 2450, y: 1600 }),
        new FallingPlatform(this.game, { w: 100, h: 32, x: 2150, y: 1500 }),
        new FallingPlatform(this.game, { w: 100, h: 32, x: 2450, y: 1400 }),
        new FallingPlatform(this.game, { w: 100, h: 32, x: 2150, y: 1300 }),
        new FallingPlatform(this.game, { w: 100, h: 32, x: 2450, y: 1200 }),
        */
    ];

    // -- Ghosts
    this.ghosts = [
        new Ghost(this.game, 750, 2400, 400, this.player),
    ];

    // ===
    this.setupPlayer(this.player);
    this.setup();
};

Level_12.prototype.update = function()
{
    this.setupCollisions();
    if (this.player.position.x > 2000) {
        this.ghosts[0].active = false;
    }

    // ===
    this.handleHUD();
    this.handleParallax();
};

Level_12.prototype.handleParallax = function()
{
    this.bg.position.x = this.game.camera.world.position.x * 0.2;
    this.bgTransition.position.x = this.game.camera.world.position.x * 0.2;
    this.bgBelow.x = this.game.camera.world.position.x * 0.2;
};

Level_12.prototype.setupCollisions = function() {
    this.game.physics.arcade.collide(this.player, this.plats, function(player, platform) {
        if (!platform.active) {
            platform.active = true;
        }
    });

    this.game.physics.arcade.collide(this.player, this.walls);
    this.game.physics.arcade.collide(this.ghosts, this.walls);
};

window.Level_12 = Level_12;
})();
