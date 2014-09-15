(function() {
'use strict';

var Ghost = function(game, x, y, radius, target) {
    this.target = target;

    this.radius = radius;

    this.bitmap = game.add.bitmapData(64, 64);
    this.bitmap.fill(255, 200, 255, 1);

    Phaser.Sprite.call(this, game, x, y, this.bitmap);
    game.add.existing(this);

    this.anchor.setTo(0.5, 0.5);

    // Physics
    game.physics.enable(this);
    this.body.allowGravity = false;
    this.body.drag.setTo(500, 500);

    // Setup emitter
    this.smokeEmitter = game.add.emitter(0, 0, 50);
    this.smokeEmitter.makeParticles('ghost');

    this.smokeEmitter.gravity = -0;
    this.smokeEmitter.setAlpha(1, 0, 2000, Phaser.Easing.Linear.InOut);
    this.smokeEmitter.setScale(1, 0, 1, 0, 2000, Phaser.Easing.Linear.InOut);

    this.smokeEmitter.start(false, 1000, 100);

    //this.game = game;
    this.active = true;
};

Ghost.prototype = Object.create(Phaser.Sprite.prototype);
Ghost.prototype.constructor = Ghost;

Ghost.prototype.update = function() {

    // Have the emitter follow the ghost
    this.smokeEmitter.emitX = this.position.x;
    this.smokeEmitter.emitY = this.position.y;

    // Opt-out if ghost not active.
    if (!this.active) {
        this.body.acceleration.setTo(0, 0);
        return;
    }

    // Handle collision
    //this.target.takingDamage = false;
    this.game.physics.arcade.collide(this.target, this, function(player, ghost) {
        if (!player.sounds.hurt.isPlaying) {
            player.takingDamage = true;
            player.damage(10);
            player.sounds.hurt.play();
        }
    });

    // Ghost should be affected by shields
    this.game.physics.arcade.overlap(this.target.shield, this, function(shield, ghost) {
        var distance = this.game.physics.arcade.distanceBetween(shield, ghost);
        if (distance < 128.0) {
            var angle = this.game.physics.arcade.angleBetween(shield, ghost);
            ghost.body.velocity.setTo(Math.cos(angle)*500, Math.sin(angle)*500);
        }
    }, null, this);

    var distance = this.game.physics.arcade.distanceBetween(this.target, this);
    if (distance < this.radius) {
        this.game.physics.arcade.accelerateToObject(this, this.target, 500, 300, 300);
    } else if (distance > 2*this.radius) {
        this.body.acceleration.setTo(0, 0);
    }
};

Ghost.prototype.explode = function(player) {
    // TODO: Make this explode, try and use some particles maybe.
    var angle = this.game.math.angleBetween(this.x, this.y, player.x, player.y);
    player.body.velocity.x = Math.cos(angle) * Math.abs(player.body.velocity.x) * 5;
    player.body.velocity.y = Math.sin(angle) * Math.abs(player.body.velocity.y) * 5;
};

window.Ghost = Ghost;
})();
