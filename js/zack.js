(function() {
'use strict';

var Zack = function() {};

Zack.prototype.preload = function()
{
    this.game.stage.backgroundColor = 0x554455;

    this.bitmap = this.game.add.bitmapData(1024, 600);
    this.bitmap.fill(0, 0, 0, 1);

    var foo = this.add.sprite(0, 0, this.bitmap);
    this.load.setPreloadSprite(foo);

    // Sprite images
    this.game.load.image('zack', 'assets/zack.png');
    this.game.load.spritesheet('zack-ss', 'assets/zack-spritesheet.png', 32, 64);
    this.game.load.spritesheet('quantum-leap-ss', 'assets/quantum-leap-spritesheet.png', 32, 64);
    this.game.load.image('shield', 'assets/shield.png');
    this.game.load.image('splash', 'assets/splash.png');
    this.game.load.image('splash-dead', 'assets/splash-dead.png');
    this.game.load.image('ghost', 'assets/ghost.png');
    this.game.load.image('bg', 'assets/bg.png');
    this.game.load.image('bg-transition', 'assets/bg-transition.png');
    this.game.load.image('bg-below', 'assets/bg-below.png');
    this.game.load.image('bg-green', 'assets/bg-green.png');
    this.game.load.image('door', 'assets/door.png');
    this.game.load.image('triangle', 'assets/triangle.png');
    this.game.load.spritesheet('bomb-spritesheet', 'assets/bomb-spritesheet.png', 32, 32);

    this.game.load.image('pickup-quantum-leap', 'assets/pickup-quantum-leap.png');
    this.game.load.image('pickup-shield', 'assets/pickup-shield.png');
    this.game.load.image('pickup-health', 'assets/pickup-health.png');

    // Hints
    this.game.load.image('hint-jump', 'assets/hint-press-space-to-jump.png');
    this.game.load.image('hint-wait-platform', 'assets/hint-wait-for-the-platform.png');
    this.game.load.image('hint-ghosts', 'assets/hint-watch-out-for-ghosts.png');
    this.game.load.image('hint-start-game', 'assets/hint-start-game.png');
    this.game.load.image('hint-levels', 'assets/hint-levels.png');
    this.game.load.image('hint-welcome', 'assets/hint-welcome.png');
    this.game.load.image('hint-run', 'assets/hint-run.png');
    this.game.load.image('hint-lasers', 'assets/hint-lasers.png');
    this.game.load.image('hint-quantum-leap', 'assets/hint-quantum-leap.png');
    this.game.load.image('hint-shield', 'assets/hint-shield.png');

    // HUD
    this.game.load.image('hud-quantum-leap', 'assets/hud-quantum-leap.png');
    this.game.load.image('hud-shield', 'assets/hud-shield.png');

    // Audio
    this.game.load.audio('jump', 'assets/sound/jump.wav', true);
    this.game.load.audio('quantum-leap', 'assets/sound/quantum-leap-3.wav', true);
    this.game.load.audio('shield', 'assets/sound/shield.wav', true);
    this.game.load.audio('hurt', 'assets/sound/hurt.wav', true);
    this.game.load.audio('kill', 'assets/sound/kill.wav', true);
    this.game.load.audio('theme', 'assets/sound/theme.wav', false);
    this.game.load.audio('level-done', 'assets/sound/level-done.wav', true);
    this.game.load.audio('steps', 'assets/sound/steps.wav', true);
    this.game.load.audio('steps-fast', 'assets/sound/steps-fast.wav', true);
    this.game.load.audio('laser', 'assets/sound/laser.wav', true);
    this.game.load.audio('pickup', 'assets/sound/pickup.wav', true);
};

Zack.prototype.create = function()
{
    // Game constants
    this.game.GRAVITY = 3000;
    this.game.ACCELERATION = 5000;
    this.game.JUMP_SPEED = -700;
    this.game.JUMP_TIME = 150;

    // General setup
    this.game.stage.backgroundColor = 0x554455;

    // Visuals
    this.bg = this.add.tileSprite(0, 0, 128*40, 600, 'bg');
    this.bg.alpha = 1;

    var dimmer_bmp = this.add.bitmapData(1024, 600);
    dimmer_bmp.fill(0, 0, 0, 1);

    var splash = this.add.sprite(112, 0, 'splash');
    splash.alpha = 0;

    this.ready = false;

    var delay = 500;

    this.dimmer = this.add.sprite(0, 0, dimmer_bmp);
    this.add.tween(this.dimmer)
            .to({alpha: .5}, delay, null, true)
            .onComplete.add(function() {
                this.add.tween(splash)
                        .to({alpha: 1}, delay, null, true)
                        .onComplete.add(function() {
                            this.add.tween(this.dimmer)
                                    .to({alpha: 0}, delay*2, null, true)
                                    .onComplete.add(function() {
                                        this.add.tween(splash)
                                                .to({alpha: 0}, delay, null, true)
                                                .onComplete.add(function() {
                                                    this.ready = true;
                                                }, this);
                                    }, this);
                        }, this);
            }, this);


    // Initialize Physics
    this.game.physics.arcade.gravity.y = this.game.GRAVITY;

    // Sound
    this.game.sounds = {};
    this.game.sounds.jump = this.sound.add('jump');
    this.game.sounds.quantumLeap = this.sound.add('quantum-leap', .3);
    this.game.sounds.shield = this.sound.add('shield', .3);
    this.game.sounds.hurt = this.sound.add('hurt', .5);
    this.game.sounds.levelDone = this.sound.add('level-done', .05);
    this.game.sounds.steps = this.sound.add('steps', .05);
    this.game.sounds.stepsFast = this.sound.add('steps-fast', .05);
    this.game.sounds.laser = this.sound.add('laser', .1);
    this.game.sounds.pickup = this.sound.add('pickup', .3);
    this.game.sounds.theme = this.sound.play('theme', .1, true);

    // Fire up the first level
    //this.game.state.start('level-01');
};

Zack.prototype.update = function()
{
    if (this.ready) {
        this.game.state.start('level-00');
    }
};

window.Zack = Zack;
})();
