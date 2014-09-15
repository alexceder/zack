(function() {
'use strict';

var MovingPlatform = function(game, data) {
    this.game = game;
    this.plat_w = data.w;
    this.plat_h = data.h;
    this.plat_x = data.x;
    this.plat_y = data.y;
    this.plat_v = data.v;
    this.direction = data.direction;
    this.plat_time = data.time || 2000;
    this.plat_easing = data.easing || Phaser.Easing.Linear.None;

    this.bitmap = this.game.add.bitmapData(data.w, data.h);
    this.bitmap.fill(40, 30, 40, 1);

    Phaser.Sprite.call(this, game, data.x, data.y, this.bitmap);
    game.add.existing(this);

    game.physics.enable(this);
    this.body.immovable = true;
    this.body.allowGravity = false;

    this.tween();
};

MovingPlatform.prototype = Object.create(Phaser.Sprite.prototype);
MovingPlatform.prototype.constructor = MovingPlatform;

MovingPlatform.prototype.tween = function() {
    var obj = {};
    obj[this.direction] = this.plat_v;
    this.body.velocity[this.direction] = -this.plat_v;

    this.game.add.tween(this.body.velocity)
                 .to(obj, this.plat_time, this.plat_easing, true, 0, Number.MAX_VALUE, true);
};

MovingPlatform.prototype.onCollision = function(player) {
    /*
     * TODO: Figure out why I no longer need this.
     *
    if (player.body.touching.down && player.position.y > this.position.y) {
        player.body.velocity[this.direction] = this.body.velocity[this.direction];
    }
    */
};

window.MovingPlatform = MovingPlatform;
})();
