(function() {
'use strict';

var Laser = function(game, x, y, target, to, size, delay, velocity, direction, renderEmitter) {
    console.log('--------------');
    // Setup target
    this.target = target;

    // Variables
    if (direction == 'x')
        var reverse = x > to ? 1 : -1;
    else
        var reverse = y > to ? 1 : -1;

    direction = direction || 'x';
    velocity = velocity || 1800;
    velocity = velocity / 1000; // convert to px/ms

    // Visuals
    if (direction == 'x') {
        this.bitmap = game.add.bitmapData(size, 8);
        this.bitmap.fill(200, 100, 200, 1);
        this.bitmap.rect(1, 1, size-2, 6, '#e6b4e6');
        this.bitmap.rect(2, 2, size-4, 4, '#f0dcf0');
        this.bitmap.rect(3, 3, size-6, 2, '#ffffff');
    } else {
        this.bitmap = game.add.bitmapData(8, size);
        this.bitmap.fill(200, 100, 200, 1);
        this.bitmap.rect(1, 1, 6, size-2, '#e6b4e6');
        this.bitmap.rect(2, 2, 4, size-4, '#f0dcf0');
        this.bitmap.rect(3, 3, 2, size-6, '#ffffff');
    }

    // Init the sprite
    var from = { x: x, y: y };
    from[direction] += reverse * size;

    Phaser.Sprite.call(this, game, from.x, from.y, this.bitmap);
    game.add.existing(this);

    if (typeof renderEmitter !== 'undefined' && renderEmitter) {
        var emitter_bmp = game.add.bitmapData(32, 16);
        emitter_bmp.fill(0, 0, 0, 1);
        var emitter = game.add.sprite(x+size*2, y, emitter_bmp);
        emitter.anchor.setTo(.5, .5);
    }

    // Physics
    game.physics.enable(this);
    this.body.allowGravity = false;
    this.body.immovable = true;

    // Setup
    //this.position.setTo(this.originalX, this.originalY);
    this.anchor.setTo(.5, .5);

    // Do the time calculation for the tween
    // based on velocity and travel distance
    var x_or_y = { x: x, y: y };
    if (direction === 'x')
        var time  = (x_or_y[direction] - to) / velocity;
    else
        var time  = (to - x_or_y[direction]) / velocity;

    // And then an object that can handle both directions
    var to_obj = {};
    to_obj[direction] = to - (reverse * size);

    // Setup the tween
    var tween = game.add
        .tween(this.body.position)
        .to(to_obj, time, Phaser.Easing.Linear.None, false, 0, Number.MAX_VALUE);

    // Reset the sound switch for each loop
    this.playingLaser = false;
    tween.onLoop.add(function() {
        this.playingLaser = false;
    }, this);

    // A small hack to have the delay once
    tween.delay(delay);
    tween.start();
    tween.delay(0);
};

Laser.prototype = Object.create(Phaser.Sprite.prototype);
Laser.prototype.constructor = Laser;

Laser.prototype.update = function() {
    //console.log(this.position);
    // Check to see if we are in sound range.
    // Would be nice if we could adjust the frequency
    // to utilize the Doppler effect but hey
    // this might be OK.
    if (this.game.physics.arcade.distanceBetween(this.target, this) < 400) {
        if (this.playingLaser !== true) {
            this.game.sounds.laser.play();
            this.playingLaser = true;
        }
    }

    // Handle collision
    this.game.physics.arcade.overlap(this.target, this, function(player, laser) {
        if (!player.sounds.hurt.isPlaying) {
            player.takingLaserDamage = true;
            player.damage(22);
            player.sounds.hurt.play();

            // the value doesn't really matter since
            // we got drag and velocity on the arrow keys
            //player.body.velocity.x *= -1000;
            //player.body.velocity.y *= -1000;

            player.body.velocity.x += -1000;
            player.body.velocity.y += -300;
        }
    }, null, this);
}

window.Laser = Laser;
})();
