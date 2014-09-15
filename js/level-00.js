(function() {
'use strict';

var Level_00 = function(game) {};

Level_00.prototype = Object.create(Level.prototype);
Level_00.prototype.constructor = Level_00;

Level_00.prototype.preload = function()
{ console.log('== level-00 preload'); };

Level_00.prototype.create = function()
{
    console.log('== level-00 create');

    // -- World
    this.game.world.setBounds(0, 0, 1024, 600);

    // -- Background
    this.bg = this.add.tileSprite(0, 0, 128*40, 600, 'bg');
    this.add.sprite(112, 0, 'hint-welcome');
    this.add.sprite(118+112, 244, 'hint-start-game');
    this.add.sprite(426+112, 244, 'hint-levels');

    // -- Ground
    this.walls = this.add.group();
    this.walls.enableBody = true;

    var bounds = [
        [700, 50, 50+112, 500],
        [8, 50, 60+112, 550],
        [8, 50, 732+112, 550],
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
    this.player = new Player(this.game, 400+112, 300);
    this.player.sounds.kill = this.add.audio('kill', 1);
    this.player.sounds.hurt = this.add.audio('hurt', 1);

    // -- Door
    var current_level = 6;
    new Door(this.game, 214+112, 500-128, this.player, 'level-01');
    new Door(this.game, 522+112, 500-128, this.player, 'level-levels', { x: current_level*200 + 300, y: 300 });

    // ===
    this.setupPlayer(this.player);
    this.setup();

    this.game.hud.children[0].visible = false;
    this.game.hud.children[1].visible = false;
    this.game.hud.children[2].visible = false;
};

Level_00.prototype.update = function()
{
    this.setupCollisions();

    // ===
    this.handleHUD();
    this.handleParallax();
};

Level_00.prototype.setupCollisions = function() {
    this.game.physics.arcade.collide(this.player, this.walls);
};

window.Level_00 = Level_00;
})();
