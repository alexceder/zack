(function() {
'use strict';

var Level_levels = function(game) {};

Level_levels.prototype = Object.create(Level.prototype);
Level_levels.prototype.constructor = Level_levels;

Level_levels.prototype.preload = function()
{
    console.log('== level-levels preload');

    this.game.load.image('hint-00', 'assets/hint-00.png');
    this.game.load.image('hint-01', 'assets/hint-01.png');
    this.game.load.image('hint-02', 'assets/hint-02.png');
    this.game.load.image('hint-03', 'assets/hint-03.png');
    this.game.load.image('hint-04', 'assets/hint-04.png');
    this.game.load.image('hint-05', 'assets/hint-05.png');
    this.game.load.image('hint-06', 'assets/hint-06.png');

    this.game.load.image('hint-real-levels', 'assets/hint-real-levels.png');
}

Level_levels.prototype.init = function(position)
{
    this.playerSpawnPosition = position;
}

Level_levels.prototype.create = function()
{
    console.log('== level-levels create');

    // -- World
    this.game.world.setBounds(0, 0, 4000, 600);

    // -- Background
    this.bg = this.add.tileSprite(0, 0, 128*40, 600, 'bg');
    //this.bgGreen = this.add.tileSprite(0, 0, 128*40, 600, 'bg-green');
    //this.bgGreen.alpha = 0;

    // -- Ground
    this.walls = this.add.group();
    this.walls.enableBody = true;

    var bounds = [
        [1600+200, 50, 50, 500],
        [8, 50, 60, 550],
        [8, 50, 1832, 550],

        [800, 50, 1950, 500],
        [8, 50, 1910+50, 550],
        [8, 50, 3482+50-800, 550],
    ];

    for (var i = 0; i < bounds.length; i++) {
        var bitmap = this.add.bitmapData(bounds[i][0], bounds[i][1]);
        //bitmap.fill(40, 30, 40, 1);
        //if (i > 2)
            //bitmap.fill(23, 49, 43, 1);
        //else
            bitmap.fill(49, 23, 49, 1);
        bounds[i] = this.add.sprite(
            bounds[i][2], bounds[i][3], bitmap, this.walls
        );
    }

    this.walls.addMultiple(bounds);
    this.walls.setAll('body.immovable', true);
    this.walls.setAll('body.allowGravity', false);

    // -- Zack
    this.player = new Player(this.game, 320, 300);
    if (this.playerSpawnPosition)
        this.player.position.setTo(this.playerSpawnPosition.x, this.playerSpawnPosition.y);
    this.player.sounds.kill = this.add.audio('kill', 1);
    this.player.sounds.hurt = this.add.audio('hurt', 1);

    this.add.sprite(200-50, 244, 'hint-00');
    this.add.sprite(400-50, 244, 'hint-01');
    this.add.sprite(600-50, 244, 'hint-02');
    this.add.sprite(800-50, 244, 'hint-03');
    this.add.sprite(1000-50, 244, 'hint-04');
    this.add.sprite(1200-50, 244, 'hint-05');
    this.add.sprite(1400-50, 244, 'hint-06');

    this.add.sprite(1600-50, 244, 'hint-real-levels', 'assets/hint-real-levels.png');

    this.add.sprite(200-50+1850+50, 244, 'hint-01');
    this.add.sprite(400-50+1850+50, 244, 'hint-02');
    this.add.sprite(600-50+1850+50, 244, 'hint-03');

    // -- Door
    new Door(this.game, 200, 500-128, this.player, 'level-00');
    new Door(this.game, 400, 500-128, this.player, 'level-01');
    new Door(this.game, 600, 500-128, this.player, 'level-02');
    new Door(this.game, 800, 500-128, this.player, 'level-03');
    new Door(this.game, 1000, 500-128, this.player, 'level-04');
    new Door(this.game, 1200, 500-128, this.player, 'level-05');
    new Door(this.game, 1400, 500-128, this.player, 'level-06');

    new Door(this.game, 200+1850+50, 500-128, this.player, 'level-11');
    new Door(this.game, 400+1850+50, 500-128, this.player, 'level-12');
    new Door(this.game, 600+1850+50, 500-128, this.player, 'level-13');

    this.bgChanged = false;

    // ===
    this.setupPlayer(this.player);
    this.setup();

    this.game.hud.children[0].visible = false;
    this.game.hud.children[1].visible = false;
    this.game.hud.children[2].visible = false;
};

Level_levels.prototype.handleParallax = function()
{
    this.bg.position.x = this.game.camera.world.position.x * 0.2;
    //this.bgGreen.position.x = this.game.camera.world.position.x * 0.2;
};

Level_levels.prototype.update = function()
{
    this.setupCollisions();

    /*
    if (!this.bgChanged && this.player.position.x > 1700) {
        this.add.tween(this.bgGreen)
                .to({ alpha: 1 }, 500, null, true);

        this.bgChanged = true;
    }
    */

    // ===
    this.handleHUD();
    this.handleParallax();
};

Level_levels.prototype.setupCollisions = function() {
    this.game.physics.arcade.collide(this.player, this.walls);
};

window.Level_levels = Level_levels;
})();
