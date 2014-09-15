(function() {
'use strict';

var Level = function(game)
{
    console.log('== level constructor');
    this.game = game;
};

Level.prototype = Object.create(Phaser.State.prototype);
Level.prototype.constructor = Level;

Level.prototype.handleHUD = function()
{
    if (this.game.time.fps !== 0)
        this.fpsText.setText(this.game.time.fps + ' fps');

    // Set healthbar so that it corresponds to player health
    this.health.key.clear().fill(50, 10, 20, 1);
    this.health.key.rect(0, 0, this.player.health * 4, 25, '#c82846');

    // Flash health bar when under 20 percent health
    if (!this.health.low_health_tween.isRunning && this.player.health < 20) {
        this.health.low_health_tween.start();
    } else if (this.health.low_health_tween.isRunning && this.player.health >= 20) {
        this.health.low_health_tween.stop();
        this.health.alpha = 1;
    } else if (!this.player.alive) {
        this.health.low_health_tween.stop();
        this.health.alpha = 1;
    }

    this.handleInput();
};

Level.prototype.handleParallax = function()
{
    this.bg.position.x = this.game.camera.world.position.x * 0.2;
    //this.help.position.x = this.game.camera.world.position.x * 0.1;
};

Level.prototype.setup = function()
{
    this.setupHUD();
    this.setupInput();
}

Level.prototype.setupHUD = function()
{
    console.log('== level setup hud');

    // TODO: Refactor this.
    if (this.game.hud) this.game.hud.destroy();

    this.game.hud = this.add.group(null, 'hud', true);

    // -- Debug
    this.game.time.advancedTiming = true;
    this.fpsText = this.add.text(20, 20, '',
        { font: '16px Open Sans', fill: '#FFFFFF' }
    );

    // -- Health
    var health_bmd = this.add.bitmapData(400, 25);
    health_bmd.fill(50, 10, 20, 1);
    health_bmd.rect(0, 0, 300, 25, '#c82846');
    this.health = this.add.sprite(312, 25, health_bmd);
    this.health.low_health_tween = this.add.tween(this.health)
                 .to({ alpha: .5 }, 300, Phaser.Easing.Linear.None, false, 0, Number.MAX_VALUE, true);

    // -- Ability icons
    this.abilityIcons = this.add.group();
    var icons = [
        this.add.sprite(1024-25-64, 25*1+64*0, 'hud-quantum-leap'),
        this.add.sprite(1024-25-64, 25*2+64*1, 'hud-shield'),
    ];
    this.abilityIcons.addMultiple(icons);
    this.abilityIcons.children[0].tint = 0x0;
    this.abilityIcons.children[0].alpha = .1;
    this.abilityIcons.children[1].tint = 0x0;
    this.abilityIcons.children[1].alpha = .1;

    // -- Dimmer
    var dimmer_bmp = this.game.add.bitmapData(1024, 600);
    dimmer_bmp.fill(0, 0, 0, 1);
    this.dimmer = this.game.add.sprite(0, 0, dimmer_bmp);
    this.dimmer.alpha = .5;
    this.dimmer.kill();

    // -- Dead
    var dead = this.add.sprite(0, 0, 'splash-dead');
    dead.anchor.setTo(.5, 0);
    dead.position.setTo(512, -272);
    dead.kill();

    this.dimmer.events.onRevived.add(function() {
        dead.revive();
        dead.position.y = -272;
        this.add.tween(dead.position).to({ y: -25 }, 1000, Phaser.Easing.Cubic.Out, true, 0);

        this.dimmer.alpha = 0;
        this.add.tween(this.dimmer).to({ alpha: .3 }, 1000, null, true, 0);
    }, this);

    // Finally comprise the HUD
    this.game.hud.addMultiple([
        this.fpsText,
        this.health,
        this.abilityIcons,
        this.dimmer,
        dead
    ]);

    this.game.hud.visible = true;
    this.game.sound.stopAll();
    this.game.sounds.theme.play();
};

Level.prototype.setupPlayer = function(player)
{
    player.body.enable = true;
    this.game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
};

Level.prototype.setupInput = function()
{
    this.input.disabled = false;
    this.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN,
        Phaser.Keyboard.SPACEBAR,
        Phaser.Keyboard.Z,
        Phaser.Keyboard.X,
        Phaser.Keyboard.C,
        Phaser.Keyboard.ZERO,
        Phaser.Keyboard.ONE,
        Phaser.Keyboard.TWO,
        Phaser.Keyboard.THREE,
        Phaser.Keyboard.FOUR,
        Phaser.Keyboard.FIVE,
        Phaser.Keyboard.SIX,
        Phaser.Keyboard.L,
        Phaser.Keyboard.R,
        Phaser.Keyboard.Q
    ]);
};

Level.prototype.handleInput = function()
{
    switch (true) {
        case this.game.input.keyboard.isDown(Phaser.Keyboard.ZERO):
            this.game.state.start('level-00');
            break;

        case this.game.input.keyboard.isDown(Phaser.Keyboard.ONE):
            this.game.state.start('level-11');
            break;

        case this.game.input.keyboard.isDown(Phaser.Keyboard.TWO):
            this.game.state.start('level-12');
            break;

        case this.game.input.keyboard.isDown(Phaser.Keyboard.THREE):
            this.game.state.start('level-13');
            break;

        case this.game.input.keyboard.isDown(Phaser.Keyboard.FOUR):
            this.game.state.start('level-14');
            break;

        case this.game.input.keyboard.isDown(Phaser.Keyboard.FIVE):
            this.game.state.start('level-05');
            break;

        case this.game.input.keyboard.isDown(Phaser.Keyboard.SIX):
            this.game.state.start('level-06');
            break;

        case this.game.input.keyboard.isDown(Phaser.Keyboard.L):
            this.game.state.start('level-levels');
            break;

        case this.game.input.keyboard.isDown(Phaser.Keyboard.R):
            this.game.state.restart();
            break;

        case this.game.input.keyboard.isDown(Phaser.Keyboard.Q):
            this.game.state.start('level-00');
            break;
    }
};

window.Level = Level;
})();
