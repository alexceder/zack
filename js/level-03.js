(function() {
'use strict';

var Level_03 = function(game) {};

Level_03.prototype = Object.create(Level.prototype);
Level_03.prototype.constructor = Level_03;

Level_03.prototype.preload = function()
{ console.log('== level-03 preload'); };

Level_03.prototype.create = function()
{
    console.log('== level-03 create');

    // -- World
    this.game.world.setBounds(0, 0, 2200, 600);

    // -- Background
    this.bg = this.add.tileSprite(0, 0, 128*40, 600, 'bg');

    this.add.sprite(300, 244, 'hint-ghosts')

    // -- Ground
    this.walls = this.add.group();
    this.walls.enableBody = true;

    var bounds = [
        [2000, 50, 100, 500],
        [8, 50, 60, 550],
        [8, 50, 2132, 550],
        [50, 450, 50, 100],
        [50, 150, 700, 350],
        [50, 150, 1000, 350],
        [50, 450, 2100, 100],
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
    this.door = new Door(this.game, 1900, 500-128, this.player, 'level-04');

    // -- Ghost
    this.ghosts = [
        new Ghost(this.game, 300, 100, 400, this.player),
        new Ghost(this.game, 1000, 100, 400, this.player),
        new Ghost(this.game, 1600, 100, 400, this.player)
    ];

    // ===
    this.setupPlayer(this.player);
    this.setup();
};

Level_03.prototype.update = function()
{
    this.setupCollisions();

    // ===
    this.handleHUD();
};

Level_03.prototype.setupCollisions = function() {
    this.game.physics.arcade.collide(this.player, this.walls);
    this.game.physics.arcade.collide(this.walls, this.ghosts);

    this.game.physics.arcade.collide(this.player, this.plats, function(player, platform) {
        platform.onCollision(player);
    });
};

window.Level_03 = Level_03;
})();
