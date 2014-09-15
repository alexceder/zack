(function() {
'use strict';

var Level_05 = function(game) {};

Level_05.prototype = Object.create(Level.prototype);
Level_05.prototype.constructor = Level_05;

Level_05.prototype.preload = function()
{ console.log('== level-05 preload'); };

Level_05.prototype.create = function()
{
    console.log('== level-05 create');

    // -- World
    this.game.world.setBounds(0, 0, 2350, 600);

    // -- Background
    this.bg = this.add.tileSprite(0, 0, 128*40, 600, 'bg');
    this.add.sprite(300, 244, 'hint-lasers')

    // -- Ground
    this.walls = this.add.group();
    this.walls.enableBody = true;

    var bounds = [
        //ground
        [2200, 50, 100, 500],
        [8, 50, 60, 550],
        [8, 50, 2282, 550],

        // left wall
        [50, 100, 50, 120],
        [50, 100, 50, 236],
        [50, 100, 50, 352],
        [50, 82, 50, 468],

        // right wall
        [50, 100, 2250, 120],
        [50, 100, 2250, 236],
        [50, 100, 2250, 352],
        [50, 82, 2250, 468],
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

    // -- Door
    new Door(this.game, 2100, 500-128, this.player, 'level-06');

    // -- Lasers
    new Laser(this.game, 3000, 228, this.player, 0, 500, 0),
    new Laser(this.game, 3000, 344, this.player, 0, 500, 500),
    new Laser(this.game, 3000, 460, this.player, 0, 500, 1000),

    // ===
    this.setupPlayer(this.player);
    this.setup();
};

Level_05.prototype.update = function()
{
    this.setupCollisions();

    // ===
    this.handleHUD();
    this.handleParallax();
};

Level_05.prototype.setupCollisions = function() {
    this.game.physics.arcade.collide(this.player, this.walls);
};

window.Level_05 = Level_05;
})();
