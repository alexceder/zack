(function() {
'use strict';

function tweenTint(game, obj, startColor, endColor, time) {
    var colorBlend = { step: 0 };
    var colorTween = game.add.tween(colorBlend).to({ step: 100 }, time);
    colorTween.onUpdateCallback(function() {
        obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);   
    });
    obj.tint = startColor;    
    colorTween.start();
}

var Boss_11 = function(game, x, y, target) {
    this.target = target;

    // States
    this.SLEEPING = 0;
    this.WAKING_UP = 1;
    this.SHOOTING = 2;
    this.TANTRUM = 3;
    this.DEAD = 4;

    // Visual
    this.bitmap = game.add.bitmapData(256, 256);
    this.bitmap.fill(255, 255, 255, 1);

    Phaser.Sprite.call(this, game, x, y, this.bitmap);
    game.add.existing(this);

    this.tint = 0xDC8C8C;

    this.anchor.setTo(0.5, 0.5);

    this.health = 4;

    // Eyes
    var eye_bmp = game.add.bitmapData(32, 32);
    eye_bmp.fill(250, 250, 250, 1);

    this.left_eye = game.add.sprite(x-50, y-16, eye_bmp);
    this.left_eye.anchor.setTo(0.5, 0.5);
    this.right_eye = game.add.sprite(x+50, y-16, eye_bmp);
    this.right_eye.anchor.setTo(0.5, 0.5);

    this.left_eye.scale.setTo(1, .1);
    this.right_eye.scale.setTo(1, .1);

    // Mouth
    var mouth_bmp = game.add.bitmapData(64, 16);
    mouth_bmp.fill(250, 250, 250, 1);

    this.mouth = game.add.sprite(x, y+64, mouth_bmp);
    this.mouth.anchor.setTo(0.5, 0.5);

    // Physics
    game.physics.enable(this);
    this.body.allowGravity = false;
    this.body.drag.setTo(500, 500);

    // Events
    this.events.onKilled.add(function() {
        // Set the health to 0, good to visuallu show death
        // when jumping outside the map.
        this.health = 0;
        this.sounds.destructionSlow.play();
        this.sounds.tantrum.stop();
        this.sounds.shooting.stop();

        this.state = this.DEAD;
        this.visible = true;

        tweenTint(this.game, this, 0xED1D1D, 0xFFFFFF, 6000);

        this.game.add.tween(this.position)
                 .to({ x: this.position.x + 50, y: this.position.y + 100 }, 100, null, true, 0, 60, true);

        this.game.add.tween(this.scale)
                 .to({ x: 12, y: 12 }, 3000, null, true, 3000)
                 .onComplete.add(function() {
                     this.left_eye.destroy();
                     this.right_eye.destroy();
                     this.mouth.destroy();

                     this.bossWalls.exists = false;
                     this.bossWalls.visible = false;

                     this.game.add.tween(this)
                              .to({ alpha: 0 }, 2000, null, true, 1000);
                 }, this);

        this.bombs.visible = false;

    }, this);

    this.bombs = this.game.add.group();
    this.pickups = this.game.add.group(); // So that we can add wall collisions
    this.pickups.enableBody = true;

    // Misc setup.
    this.state = this.SLEEPING;

    this.aux = 0;
    this.tweenInPosition = {};
    this.setupTweens();
};

Boss_11.prototype = Object.create(Phaser.Sprite.prototype);
Boss_11.prototype.constructor = Boss_11;

Boss_11.prototype.setupTweens = function() {
    this.tweenSleepMouth = this.game.add
        .tween(this.mouth.scale)
        .to({ x: .5, y: .5 }, 1400, null, false, 0, Number.MAX_VALUE, true);

    this.tweenLeftEye = this.game.add
        .tween(this.left_eye.scale)
        .to({ y: .1 }, 200, null, false)
        .to({ y: 1 }, 200, null, false, 2000, Number.MAX_VALUE);
    this.tweenRightEye = this.game.add
        .tween(this.right_eye.scale)
        .to({ y: .1 }, 200, null, false)
        .to({ y: 1 }, 200, null, false, 2000, Number.MAX_VALUE);
}

Boss_11.prototype.makeHealthPickup = function() {
    var pickup = new Pickup(this.game, this, this.body.position.x, this.body.position.y, this.target, 'health');
    pickup.body.allowGravity = true;

    this.pickups.add(pickup);
}

Boss_11.prototype.makeBomb = function() {
    var bomb = this.game.add.sprite(this.position.x, this.position.y + 64, 'bomb-spritesheet');
    this.game.physics.enable(bomb);
/*
    bomb.body.velocity.setTo(
         500 * Math.cos( Math.random() * (Math.PI/2) ),
        -500 * Math.sin( Math.random() * (Math.PI/2) )
    );
*/
    bomb.body.bounce.y = 0.5;
    bomb.body.gravity.y = 50;

    bomb.animations.add('bomb-animation', [0, 1, 2], 10);
    bomb.animations.play('bomb-animation');

    bomb.canHurtBoss = false;

    this.bombs.add(bomb);
}

Boss_11.prototype.update = function() {
    // Make face follow
    this.left_eye.position.setTo(this.position.x-50, this.position.y-16);
    this.right_eye.position.setTo(this.position.x+50, this.position.y-16);
    this.mouth.position.setTo(this.position.x, this.position.y+64);

    // The states
    switch (this.state) {
        case this.SLEEPING:
            if (!this.tweenSleepMouth.isRunning) {
                this.tweenSleepMouth.start();
                this.sounds.sleeping.play('', 0, .05, true);
            }

            if (this.game.physics.arcade.distanceBetween(this, this.target) < 300) {
                this.tweenSleepMouth.stop();
                this.sounds.sleeping.stop();
                this.sounds.sad.play();

                this.bossWalls.exists = true;
                this.bossWalls.visible = true;

                this.game.add
                    .tween(this.mouth.scale)
                    .to({ x: 1, y: 1 }, 500, null, true)
                    .onComplete.add(function() {
                        // Let's wake up
                        tweenTint(this.game, this, 0xDC8C8C, 0xED1D1D, 3000);

                        // Tween the eyes
                        this.tweenLeftEye.start()
                        this.tweenRightEye.start()

                        // Tween the mouth
                        this.game.add.tween(this.mouth.scale)
                                .to({ y: .2 }, 1000, null, true, 2500)
                                .to({ x: .5 }, 200, null, true, 500)
                                ._lastChild
                                .onComplete.add(function() {
                                    this.state = this.WAKING_UP;
                                    this.sounds.buildup.play();
                                }, this);
                    }, this);

                this.state = null;
            }
            break;

        case this.WAKING_UP:
            this.position.setTo(
                this.position.x + 10*Math.cos(++this.aux * .05),// + 5*Math.cos(this.aux * 2),
                this.position.y - 5*Math.sin(this.aux * .05) + 10*Math.cos(this.aux * 1)
            );

            if (this.aux > 120) this.state = this.SHOOTING;
            break;

        case this.SHOOTING:
            if (!this.inPosition) {
                this.game.tweens.pauseAll();
                this.sounds.shooting.play('', 0, .3, true);
                this.sounds.tantrum.stop();

                this.mouth.scale.y = 2;
                this.mouth.scale.x = 1;

                // Tween the eyes
                this.tweenLeftEye.resume();
                this.tweenRightEye.resume();

                // Tween shooting movement
                this.game.add
                    .tween(this.body.position)
                    .to({ x: 750, y: 900 }, 500, null, true)
                    .onComplete.add(function() {
                        this.game.add.tween(this.body.position)
                                     .to({ y: 850 }, 400, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
                        this.game.add.tween(this.body.position)
                                     .to({ x: 1550 }, 2500, Phaser.Easing.Quadratic.InOut, true, 0, Number.MAX_VALUE, true);
                    }, this);

                this.inPosition = true;
                this.aux = 0;
            }

            if (this.aux % 25 === 0) {
                this.sounds.bomb.play();
                this.makeBomb();
            }

            if (++this.aux > 500) {
                this.state = this.TANTRUM;
                this.inPosition = false;
            }
            break;

        case this.TANTRUM:
            if (!this.inPosition) {
                this.game.tweens.pauseAll();
                this.sounds.shooting.stop();
                this.sounds.tantrum.play('', 0, .3, true);

                this.mouth.scale.y = 3;
                this.mouth.scale.x = 3;

                this.game.add.tween(this)
                         .to({ alpha: .5 }, 100, null, true, 0, Number.MAX_VALUE, true);

                var TANTRUM_VELOCITY = 0.7;

                // Setup pos and time
                var pos = 700 + 900*Math.random(),
                    newPos,
                    time = Math.abs( this.body.position.y - pos[0] ) / TANTRUM_VELOCITY;

                this.tweenTantrum = this.game.add.tween(this.body.position);

                for (var i = 1; i < 7; i++) {
                    this.tweenTantrum.to({ x: pos, y: 800 }, time, null, true)
                                .to({ y: 1400-256 }, 400, Phaser.Easing.Quadratic.In, true, 0, 0, true);

                    newPos = 700 + 900*Math.random();
                    time = Math.abs(pos - newPos) / TANTRUM_VELOCITY;
                    pos = newPos;
                }

                this.tweenTantrum._lastChild.onComplete.add(function() {
                    this.state = this.SHOOTING;
                    this.alpha = 1;
                    this.inPosition = false;

                    // We might have depleted the shield and leap
                    // to finish the boss we need some hp.
                    // Reward a player completing a tantrum by
                    // dropping a health pickup
                    this.makeHealthPickup();
                }, this);

                this.inPosition = true;
                this.aux = 0;
            }

            if (!this.sounds.tantrumHit.isPlaying && this.body.position.y > 1000) {
                this.sounds.tantrumHit.play();
            }

            // During tantrum, you will die.
            this.game.physics.arcade.overlap(this.target, this, function(player, boss) {
                player.damage(100);
            });

            break;

        case this.DEAD:
        default:
            break;
    }

    // Handle collision
    this.game.physics.arcade.collide(this.target, this, function(player, ghost) {
        if (!player.sounds.hurt.isPlaying) {
            player.takingDamage = true;
            player.damage(10);
            player.sounds.hurt.play();
        }
    });

    this.game.physics.arcade.overlap(this.target, this.bombs, function(player, bomb) {
        if (!player.sounds.hurt.isPlaying) {
            player.takingDamage = true;
            player.damage(22);
            player.sounds.hurt.play();

            bomb.tint = 0x0;
            this.game.add.tween(bomb)
                         .to({ alpha: 0 }, 600, null, true);
            this.game.add.tween(bomb.scale)
                         .to({ x: 20, y: 20 }, 600, null, true)
                         .onComplete.add(function() {
                             bomb.destroy();
                         }, this);
        }
    }, null, this);

    this.game.physics.arcade.overlap(this.target.shield, this.bombs, function(shield, bomb) {
        var distance = this.game.physics.arcade.distanceBetween(shield, bomb);
        if (distance < 128.0) {
            var angle = this.game.physics.arcade.angleBetween(shield, bomb);
            bomb.body.velocity.setTo(Math.cos(angle)*2000, Math.sin(angle)*2000);
            bomb.canHurtBoss = true;
        }
    }, null, this);

    this.game.physics.arcade.overlap(this, this.bombs, function(boss, bomb) {
        if (bomb.canHurtBoss && this.state === this.SHOOTING) {
            boss.damage(1);

            this.sounds.damage.play()

            this.game.add.tween(boss.scale)
                         .to({ x: 1.1, y: 1.1 }, 100, null, true, 0, 3);
            this.game.add.tween(boss)
                         .to({ alpha: .5 }, 100, null, true, 0, 3, true);

            this.makeHealthPickup();

            bomb.tint = 0x0;
            this.game.add.tween(bomb)
                         .to({ alpha: 0 }, 600, null, true);
            this.game.add.tween(bomb.scale)
                         .to({ x: 20, y: 20 }, 600, null, true)
                         .onComplete.add(function() {
                             bomb.destroy();
                         }, this);

            bomb.canHurtBoss = false;
        }

    }, null, this);
};

window.Boss_11 = Boss_11;
})();
