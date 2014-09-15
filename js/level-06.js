(function() {
'use strict';

var Level_06 = function(game) {};

Level_06.prototype = Object.create(Level.prototype);
Level_06.prototype.constructor = Level_06;

Level_06.prototype.preload = function()
{ console.log('== level-06 preload'); };

Level_06.prototype.create = function()
{
    console.log('== level-06 create');

    // -- World
    this.game.world.setBounds(0, 0, 3150, 600);

    // -- Background
    this.bg = this.add.tileSprite(0, 0, 128*40, 600, 'bg');
    this.add.sprite(434, 244, 'hint-quantum-leap');

    // -- Ground
    this.walls = this.add.group();
    this.walls.enableBody = true;

    var bounds = [
        [600, 50, 100, 500],
        [8, 50, 60, 550],
        [8, 50, 682, 550],
        [50, 450, 50, 100],

        [300, 50, 1150, 500],
        [8, 50, 1160, 550],
        [8, 50, 1432, 550],

        [300, 50, 1800, 500],
        [8, 50, 1810, 550],
        [8, 50, 2082, 550],

        [400, 50, 2650, 500],
        [8, 50, 2660, 550],
        [8, 50, 3082, 550],
        [50, 450, 3050, 100],
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

    // -- Pickups
    new Pickup(this.game, this, 300, 500, this.player, 'quantum-leap');

    // -- Door
    new Door(this.game, 2850, 500-128, this.player, 'level-levels', { x: 1700, y: 500-128 });

    // ===
    this.setupPlayer(this.player);
    this.setup();
};

Level_06.prototype.update = function()
{
    this.setupCollisions();

    // ===
    this.handleHUD();
    this.handleParallax();
};

Level_06.prototype.setupCollisions = function() {
    this.game.physics.arcade.collide(this.player, this.walls);

    this.game.physics.arcade.collide(this.player, this.plats, function(player, platform) {
        if (!platform.active) {
            platform.active = true;
        }
    });
};

window.Level_06 = Level_06;
})();
