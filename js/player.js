(function() {
'use strict';

var Player = function(game, x, y) {
    this.game = game;

    //this.bitmap = game.add.bitmapData(32, 64);
    //this.bitmap.fill(20, 10, 20, 1);

    //Phaser.Sprite.call(this, game, x, y, this.bitmap);
    Phaser.Sprite.call(this, game, x, y, 'zack-ss');
    game.add.existing(this);

    this.animations.add('run', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], 30);
    this.animations.add('run-l', [6, 7, 8, 1, 2, 3, 4, 5], 30);
    this.animations.add('run-r', [6, 7, 8, 1, 2, 3, 4, 5], 30);
    //this.animations.add('run-l', [15, 16, 17, 18, 1, 2, 3, 4, 5], 30);
    //this.animations.add('run-r', [6, 7, 8, 9, 10, 11, 12, 13, 14], 30);
    //this.animations.add('quantum-leap', [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], 30);
    this.animations.add('quantum-leap', [19, 21, 23, 25, 27, 29], 30);
    //this.animations.add('quantum-leap', [19, 20, 21, 22], 30);
    this.animations.add('idle', [0], 30);
    this.animations.play('idle');

    this.DRAG = 3000;
    this.MAX_SPEED = 500;
    this.takingDamage = false;
    this.takingLaserDamage = false;
    this.quantumLeaping = false;
    this.health = 100;
    this.sounds = {};

    this.anchor.setTo(.5, .5);

    // Physics setup
    this.game.physics.enable(this);
    this.body.drag.setTo(this.DRAG, 0);
    this.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10);
    this.checkWorldBounds = true;

    // Shield
    this.shield = game.add.sprite(x, y, 'shield');
    this.shield.anchor.setTo(.5, .5);
    this.shield.alpha = 0;
    this.game.physics.enable(this.shield);
    this.shield.body.immovable = true;
    this.shield.body.allowGravity = false;
    //this.shield.body.

    // Setup emitters
    this.emitterDamage = game.add.emitter(0, 0, 5000);
    this.emitterDamage.makeParticles('zack');
    this.emitterDamage.gravity = -3000;
    this.emitterDamage.minParticleSpeed.setTo(-100, -100);
    this.emitterDamage.maxParticleSpeed.setTo(100, 100);
    this.emitterDamage.forEach(function(particle) {
        particle.tint = 0xC82846;
    });
    this.emitterDamage.setAlpha(1, 0, 3000, Phaser.Easing.Linear.InOut);
    this.emitterDamage.setScale(1, 0, 1, 0, 3000, Phaser.Easing.Linear.InOut);

    // Respawn listener
    this.events.onOutOfBounds.add(function() {
        if (this.body.position.y > 0)
            this.kill();
    }, this);

    this.events.onKilled.add(function() {
        // Set the health to 0, good to visuallu show death
        // when jumping outside the map.
        this.health = 0;

        // Let's explode that sucker.
        this.emitterDamage.minParticleSpeed.setTo(-300, -300);
        this.emitterDamage.maxParticleSpeed.setTo(300, 300);
        var count = 0;
        this.emitterDamage.forEach(function(particle) {
            if (++count > 25)
                particle.tint = 0x140A14;
        });
        this.emitterDamage.explode(0, 50);

        // Play some tunes.
        //game.sound.stopAll();
        this.sounds.kill.play();

        // Show the dimmer
        this.game.hud.children[3].revive();

    }, this);

    this.events.onRevived.add(function() {
        this.health = 100;
        this.body.velocity.setTo(0, 0);
        this.position.setTo(200, 100);

        this.emitterDamage.minParticleSpeed.setTo(-100, -100);
        this.emitterDamage.maxParticleSpeed.setTo(100, 100);
        this.emitterDamage.forEach(function(particle) {
            particle.tint = 0xC82846;
        });
    }, this);

    // Set this variable so that we can check the
    // canEnterDoor property of it without grief.
    this.currentDoor = {};

    // Powers
    this.powers = {};

    this.setupInput();
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
    this.handleInput();

    // Have the emitter emit at the position of the player.
    this.emitterDamage.emitX = this.position.x;
    this.emitterDamage.emitY = this.position.y;

    if (this.takingDamage || this.takingLaserDamage) {
        this.onTakingDamage();
        this.takingLaserDamage = false;
        this.takingDamage = false;
    }

    if (this.shielding)
        this.shieldPlayer();
    else
        if (this.shield.alive)
            this.shield.kill();

    if (this.quantumLeaping)
        this.quantumLeap();

    this.bringToTop();
};

Player.prototype.onTakingDamage = function() {
    this.emitterDamage.explode(0, 5);
}

Player.prototype.shieldPlayer = function() {
    this.shield.revive();
    this.shield.position.setTo(this.position.x, this.position.y);
    this.shield.scale.setTo(1 - .01*Math.sin(this.game.time.now * .05));
    this.shield.alpha = 1 - .2*Math.sin(this.game.time.now * .03);
    this.shield.rotation = 0.1*Math.sin(this.game.time.now * 0.008);

    this.emitterDamage.explode(50, 1);
    this.damage(1);
};

Player.prototype.quantumLeap = function() {
    this.emitterDamage.explode(0, 1);
    this.quantumLeaping = true;

    var foo = Phaser.Point.normalize(this.body.velocity);
    this.body.position.x += 10 * foo.x;
    this.body.position.y += -Math.abs(10 * foo.y);

    this.damage(2);
};

Player.prototype.timestop = function() {
    // TODO
    this.damage(1);
};

Player.prototype.setupInput = function()
{
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN,
        Phaser.Keyboard.SPACEBAR,
        Phaser.Keyboard.Z,
        Phaser.Keyboard.X,
        Phaser.Keyboard.C
    ]);
};

Player.prototype.handleInput = function()
{
    // X and Z movement
    switch (true) {
        case this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT):
            this.body.acceleration.x = -this.game.ACCELERATION;
            if (!this.quantumLeaping)
                this.animations.play('run-l', true);
            /*
            if (this.animations.currentAnim.name !== 'run') {
                this.animations.play('run', true);
            }
            */
            if (!this.game.sounds.stepsFast.isPlaying && this.body.touching.down) {
                this.game.sounds.stepsFast.play();
            }
            break;

        case this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT):
            this.body.acceleration.x = this.game.ACCELERATION;
            if (!this.quantumLeaping)
                this.animations.play('run-r', true);
            /*
            if (this.animations.currentAnim.name !== 'run') {
                this.animations.play('run',  true);
                this.animations.currentAnim.setFrame(8, true);
            }
            */
            if (!this.game.sounds.stepsFast.isPlaying && this.body.touching.down) {
                this.game.sounds.stepsFast.play();
            }
            break;

        default:
            if (this.animations.currentAnim.name !== 'quantum-leap')
                this.animations.play('idle');
            this.body.acceleration.x = 0;
            this.game.sounds.stepsFast.stop();
            break;
    }


    switch (true) {
        case this.game.input.keyboard.justPressed(Phaser.Keyboard.UP, 1):
            if (this.currentDoor.canEnterDoor) {
                this.game.input.disabled = true;
                this.game.input.keyboard.clearCaptures();
                this.body.enable = false;
                this.game.sounds.stepsFast.stop();
                this.game.sounds.levelDone.play();

                var timer = this.game.time.create(this.game);
                timer.add(380, function() {
                    this.game.sounds.steps.play();
                }, this);
                timer.start();
                var timer2 = this.game.time.create(this.game);
                timer2.add(300, function() {
                    this.game.add.tween(this)
                        .to({alpha: .5}, 1500, null, true);
                }, this);
                timer2.start();
                this.game.add.tween(this.position)
                    .to({x: this.currentDoor.position.x + 32 - 8, y: this.currentDoor.position.y + 64 + 32}, 300, null, true)
                    .to({x: this.currentDoor.position.x + 32 + 2, y: this.currentDoor.position.y + 64 + 32 - 25}, 1500, null, true)
                    ._lastChild
                    .onComplete.add(function() {
                        if (this.game.state.checkState(this.currentDoor.goTo)) {
                            if (this.currentDoor.goToPosition) {
                                this.game.state.start(this.currentDoor.goTo, true, false, this.currentDoor.goToPosition);
                            } else {
                                this.game.state.start(this.currentDoor.goTo);
                            }
                        } else {
                            console.log('state did not exist, sending player back to level-00');
                            this.game.state.start('level-00');
                        }
                    }, this);
            }
            break;

        default:
            break;
    }

    // Y movement
    if (this.body.touching.down) this.preventJump = false;

    switch (true) {
        case !this.preventJump &&
              this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR, this.game.JUMP_TIME):
            if (this.alive) {
                this.body.velocity.y = this.game.JUMP_SPEED;

                if (!this.game.sounds.jump.isPlaying && this.body.touching.down) {
                    this.game.sounds.jump.play();
                }
            } else {
                this.game.state.restart();
            }
            break;

        default:
            this.preventJump = true;
            break;
    }

    // Upgrades
    switch (true) {
        // Shield
        case this.game.input.keyboard.isDown(Phaser.Keyboard.Z):
            if (this.health > 5 && this.powers['shield']) {
                console.log('shield');
                this.shielding = true;
                this.animations.play('quantum-leap',  true);

                if (!this.game.sounds.shield.isPlaying)
                    this.game.sounds.shield.play();

                break;
            }

        // Quantum Leap
        //case this.game.input.keyboard.justPressed(Phaser.Keyboard.X, 200):
        case this.game.input.keyboard.isDown(Phaser.Keyboard.X, 200):
            if (this.health > 5 && this.powers['quantum-leap']) {
                console.log('quantum leap');
                this.quantumLeaping = true;
                this.animations.play('quantum-leap',  true);

                if (!this.game.sounds.quantumLeap.isPlaying)
                    this.game.sounds.quantumLeap.play();

                break;
            }

        default:
            if (this.animations.currentAnim.name === 'quantum-leap')
                this.animations.play('idle');

            this.quantumLeaping = false;
            this.shielding = false;
            break;
    }
};

window.Player = Player;
})();
