(function() {
'use strict';

var Level_13 = function(game) {};

Level_13.prototype = Object.create(Level.prototype);
Level_13.prototype.constructor = Level_13;

Level_13.prototype.preload = function()
{
    console.log('== level-13 preload');

    // Sounds
    this.game.load.audio('buildup', 'assets/sound/boss-11/buildup.wav', true);
    this.game.load.audio('destruction-fast', 'assets/sound/boss-11/destruction-fast.wav', true);
    this.game.load.audio('destruction-slow', 'assets/sound/boss-11/destruction-slow.wav', true);
    this.game.load.audio('explosion', 'assets/sound/boss-11/explosion.wav', true);
    this.game.load.audio('bomb', 'assets/sound/boss-11/bomb.wav', true);
    this.game.load.audio('shooting', 'assets/sound/boss-11/shooting.wav', true);
    this.game.load.audio('tantrum', 'assets/sound/boss-11/tantrum.wav', true);
    this.game.load.audio('tantrum-hit', 'assets/sound/boss-11/tantrum-hit.wav', true);
    this.game.load.audio('sad', 'assets/sound/boss-11/sad.wav', true);
    this.game.load.audio('sleeping', 'assets/sound/boss-11/sleeping.wav', true);
    this.game.load.audio('damage', 'assets/sound/boss-11/damage.wav', true);
};

Level_13.prototype.create = function()
{
    console.log('== level-13 create');

    // -- World
    this.game.world.setBounds(0, 0, 2550, 1500);

    // -- Background
    this.bg = this.add.tileSprite(0, 0, 138*40, 600, 'bg');
    this.bgTransition = this.add.tileSprite(0, 600, 138*40, 600, 'bg-transition');
    this.bgBelow = this.add.tileSprite(0, 1200, 138*40, 1800, 'bg-below');

    // -- Ground
    this.walls = this.add.group();
    this.walls.enableBody = true;

    var bounds = [
        // Main floor
        [2550, 100, 0, 1400],

        // Left
        [700, 300, 0, 900],
        [100, 100, 0, 1200],
        [700, 100, 0, 1300],

        // Right
        [400-36, 300, 1850, 900],
        [100, 400, 2450, 900],
        [700, 100, 1850, 1300],
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

    // Hints
    this.shield = this.add.sprite(394, 1022, 'hint-shield');

    // BOSS WALLS
    this.bossWalls = this.add.group();
    this.bossWalls.enableBody = true;

    bounds = [
        [25, 80, 700-25, 1200+10],
        [25, 80, 1850, 1200+10],
    ];

    for (var i = 0; i < bounds.length; i++) {
        var bitmap = this.add.bitmapData(bounds[i][0], bounds[i][1]);
        bitmap.fill(236, 29, 29, 1);
        bounds[i] = this.add.sprite(
            bounds[i][2], bounds[i][3], bitmap, this.bossWalls
        );
    }

    this.bossWalls.addMultiple(bounds);
    this.bossWalls.setAll('body.immovable', true);
    this.bossWalls.setAll('body.allowGravity', false);

    this.bossWalls.exists = false;
    this.bossWalls.visible = false;

    // -- Zack
    this.player = new Player(this.game, 200, 1300-32);
    this.player.sounds.hurt = this.add.audio('hurt', 1);
    this.player.sounds.kill = this.add.audio('kill', 1);

    // -- Boss
    this.boss = new Boss_11(this.game, 1300, 1100, this.player);

    // -- Sounds
    this.boss.sounds = {};
    this.boss.sounds.buildup = this.sound.add('buildup', .3);
    this.boss.sounds.destructionFast = this.sound.add('destruction-fast', .3);
    this.boss.sounds.destructionSlow = this.sound.add('destruction-slow', .6);
    this.boss.sounds.explosion = this.sound.add('explosion', .3);
    this.boss.sounds.bomb = this.sound.add('bomb', .3);
    this.boss.sounds.shooting = this.sound.add('shooting', .3);
    this.boss.sounds.tantrum = this.sound.add('tantrum', .3);
    this.boss.sounds.tantrumHit = this.sound.add('tantrum-hit', .3);
    this.boss.sounds.sad = this.sound.add('sad', .3);
    this.boss.sounds.sleeping = this.sound.add('sleeping', .3);
    this.boss.sounds.damage = this.sound.add('damage', .8);

    this.boss.bossWalls = this.bossWalls;

    // -- Door
    new Door(this.game, 2300, 1300-128, this.player, 'level-14');

    // -- Pickups
    new Pickup(this.game, this, 350, 1300, this.player, 'quantum-leap');
    new Pickup(this.game, this, 500, 1300, this.player, 'shield');

    // ===
    this.setupPlayer(this.player);
    this.setup();
};

Level_13.prototype.update = function()
{
    this.setupCollisions();

    // ===
    this.handleHUD();
    this.handleParallax();
};

Level_13.prototype.handleParallax = function()
{
    this.bg.position.x = this.game.camera.world.position.x * 0.2;
    this.bgTransition.position.x = this.game.camera.world.position.x * 0.2;
    this.bgBelow.x = this.game.camera.world.position.x * 0.2;
};

Level_13.prototype.setupCollisions = function() {
    this.game.physics.arcade.collide(this.player, this.walls);
    this.game.physics.arcade.collide(this.player, this.bossWalls);

    this.game.physics.arcade.overlap(this.player, this.boss.bombs);

    this.game.physics.arcade.collide(this.boss.pickups, this.walls);
};

window.Level_13 = Level_13;
})();
