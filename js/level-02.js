(function() {
'use strict';

var Level_02 = function(game) {};

Level_02.prototype = Object.create(Level.prototype);
Level_02.prototype.constructor = Level_02;

Level_02.prototype.preload = function()
{ console.log('== level-02 preload'); };

Level_02.prototype.create = function()
{
    console.log('== level-02 create');

    // -- World
    this.game.world.setBounds(0, 0, 2400, 600);

    // -- Background
    this.bg = this.add.tileSprite(0, 0, 128*40, 600, 'bg');
    this.add.sprite(434, 244, 'hint-wait-platform');

    // -- Ground
    this.walls = this.add.group();
    this.walls.enableBody = true;

    var bounds = [
        [600, 50, 100, 500],
        [8, 50, 60, 550],
        [8, 50, 682, 550],
        [50, 450, 50, 100],
        [500, 50, 1800, 500],
        [8, 50, 1810, 550],
        [8, 50, 2332, 550],
        [50, 450, 2300, 100],
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

    // -- Platforms
    var plats = [
        {w: 200, h: 25, x: 900, y: 400, v: 500, time: 4000, direction: 'x'}
    ];

    for (var i = 0; i < plats.length; i++)
        plats[i] = new MovingPlatform(this.game, plats[i]);

    this.plats = this.add.group();
    this.plats.addMultiple(plats);

    // -- Zack
    this.player = new Player(this.game, 200, 300);
    this.player.sounds.kill = this.add.audio('kill', 1);
    this.player.sounds.hurt = this.add.audio('hurt', 1);

    // -- Door
    new Door(this.game, 2100, 500-128, this.player, 'level-03');

    // ===
    this.setupPlayer(this.player);
    this.setup();
};

Level_02.prototype.update = function()
{
    this.setupCollisions();

    // ===
    this.handleHUD();
    this.handleParallax();
};

Level_02.prototype.setupCollisions = function() {
    this.game.physics.arcade.collide(this.player, this.walls);

    this.game.physics.arcade.collide(this.player, this.plats, function(player, platform) {
        platform.onCollision(player);
    });
};

window.Level_02 = Level_02;
})();
