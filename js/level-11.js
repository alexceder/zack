(function() {
'use strict';

var Level_11 = function(game) {};

Level_11.prototype = Object.create(Level.prototype);
Level_11.prototype.constructor = Level_11;

Level_11.prototype.preload = function()
{ console.log('== level-11 preload'); };

Level_11.prototype.create = function()
{
    console.log('== level-11 create');

    // -- World
    this.game.world.setBounds(0, 0, 4600, 600);

    // -- Background
    this.bg = this.add.tileSprite(0, 0, 128*100, 600, 'bg');

    // -- Ground
    this.walls = this.add.group();
    this.walls.enableBody = true;

    var bounds = [
        // Ground
        [650, 50, 50, 500],
        [8, 50, 60, 550],
        [8, 50, 682, 550],

        [400+400, 100, 3700, 500],

        [100, 50, 2160, 200],

        // Walls
        [50, 100, 50, 384],
        [50, 100, 50, 268],
        [50, 100, 50, 152],

        [200, 400, 4100, 0],

        [100, 600, 4500, 0],

        // Blocks
        [300, 100, 400, 384],
        [200, 100, 500, 268],
        [100, 100, 600, 152],
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

    // -- Zack
    this.player = new Player(this.game, 200, 300);
    this.player.sounds.kill = this.add.audio('kill', 1);
    this.player.sounds.hurt = this.add.audio('hurt', 1);

    // -- Falling platforms
    var plats = [];

    for (var i = 0; i < 14; i++) {
        if (i < 8)
            plats.push(new FallingPlatform(this.game, { w: 100, h: 25, x: 700 + 32 + i*(150+32), y: 500 - i*50 }));
        else
            plats.push(new FallingPlatform(this.game, { w: 100, h: 25, x: 700 + 32 + i*200, y: 250 + (i-8)*50 }));
    }

    this.plats = this.add.group();
    this.plats.addMultiple(plats);

    // -- Lasers
    new Laser(this.game, 3684, 260, this.player, 0, 200, 0, 1800, 'x', true),
    new Laser(this.game, 3684, 376, this.player, 0, 200, 500, 1800, 'x', true),
    new Laser(this.game, 3584, 0, this.player, 600, 400, 1000, 1000, 'y');

    // -- Pickups
    new Pickup(this.game, this, 650, 150, this.player, 'quantum-leap');

    // -- Door
    new Door(this.game, 4400, 500-128, this.player, 'level-12');

    // -- Ghost
    this.ghosts = [
        new Ghost(this.game, 200, 100, 400, this.player),
    ];

    // ===
    this.setupPlayer(this.player);
    this.setup();
};

Level_11.prototype.update = function()
{
    this.setupCollisions();

    this.game.physics.arcade.collide(this.player, this.plats, function(player, platform) {
        if (!platform.active) {
            platform.active = true;
        }
    });

    // ===
    this.handleHUD();
    this.handleParallax();
};

Level_11.prototype.setupCollisions = function() {
    this.game.physics.arcade.collide(this.player, this.walls);
    this.game.physics.arcade.collide(this.ghosts, this.walls);
};

window.Level_11 = Level_11;
})();
