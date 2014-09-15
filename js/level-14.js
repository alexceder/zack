(function() {
'use strict';

var Level_14 = function(game) {};

Level_14.prototype = Object.create(Level.prototype);
Level_14.prototype.constructor = Level_14;

Level_14.prototype.preload = function()
{ console.log('== level-14 preload'); };

Level_14.prototype.create = function()
{
    console.log('== level-14 create');

    // -- World
    this.game.world.setBounds(0, 0, 5000, 600);

    // -- Background
    this.bg = this.add.tileSprite(0, 0, 5000, 600, 'bg');

    // -- Ground
    this.walls = this.add.group();
    this.walls.enableBody = true;

    var bounds = [
        [3800, 50, 100, 500],
        [50, 450, 50, 100],
        [8, 50, 60, 550],
        [8, 50, 3900+50-8-10, 550],
        [50, 450, 3900, 100],
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
    this.door = new Door(this.game, 3700, 500-128, this.player, 'level-04');

    // ===
    this.setupPlayer(this.player);
    this.setup();

    this.game.hud.children[0].visible = false;
    this.game.hud.children[1].visible = false;
    this.game.hud.children[2].visible = false;
};

Level_14.prototype.update = function()
{
    this.setupCollisions();

    // ===
    this.handleHUD();
};

Level_14.prototype.setupCollisions = function() {
    this.game.physics.arcade.collide(this.player, this.walls);
    this.game.physics.arcade.collide(this.walls, this.ghosts);

    this.game.physics.arcade.collide(this.player, this.plats, function(player, platform) {
        platform.onCollision(player);
    });
};

window.Level_14 = Level_14;
})();
