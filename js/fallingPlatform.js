(function() {
'use strict';

var FallingPlatform = function(game, data) {
    this.game = game;
    this.plat_w = data.w;
    this.plat_h = data.h;
    this.plat_x = data.x;
    this.plat_y = data.y;

    this.bitmap = this.game.add.bitmapData(data.w, data.h);
    this.bitmap.fill(100, 0, 100, 1);

    Phaser.Sprite.call(this, game, data.x, data.y, this.bitmap);
    game.add.existing(this);

    game.physics.enable(this);
    this.body.immovable = true;
    this.body.allowGravity = false;

    this.active = false;
    this.spent = false;

};

FallingPlatform.prototype = Object.create(Phaser.Sprite.prototype);
FallingPlatform.prototype.constructor = FallingPlatform;

FallingPlatform.prototype.update = function() {
    if (!this.spent && this.active) {
        var timer = this.game.time.create(this.game);
        timer.add(500, function() {
            this.body.allowGravity = true;
        }, this);
        timer.start();

        this.spent = true;
    }
};

window.FallingPlatform = FallingPlatform;
})();
