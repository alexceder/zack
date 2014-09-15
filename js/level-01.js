(function() {
'use strict';

var Level_01 = function(game) {};

Level_01.prototype = Object.create(Level.prototype);
Level_01.prototype.constructor = Level_01;

Level_01.prototype.preload = function()
{ console.log('== level-01 preload'); };

Level_01.prototype.create = function()
{
    console.log('== level-01 create');

    // -- World
    this.game.world.setBounds(0, 0, 1400, 600);

    // -- Background
    this.bg = this.add.tileSprite(0, 0, 128*40, 600, 'bg');
    this.add.sprite(300, 244, 'hint-jump')

    // -- Ground
    this.walls = this.add.group();
    this.walls.enableBody = true;

    var bounds = [
        [1050, 50, 100, 500],
        [8, 50, 60, 550],
        [8, 50, 1132, 550],
        [50, 450, 50, 100],
        [50, 50, 400, 450],
        [50, 150, 700, 350],
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
    new Door(this.game, 1000, 500-128, this.player, 'level-02');

    // ===
    this.setupPlayer(this.player);
    this.setup();
};

Level_01.prototype.update = function()
{
    this.setupCollisions();

    // ===
    this.handleHUD();
    this.handleParallax();
};

Level_01.prototype.setupCollisions = function() {
    this.game.physics.arcade.collide(this.player, this.walls);
};

window.Level_01 = Level_01;
})();
