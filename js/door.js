(function() {
'use strict';

var Door = function(game, x, y, player, goTo, position) {
    this.player = player;
    this.goTo = goTo || 'level-00';
    this.goToPosition = position;

    Phaser.Sprite.call(this, game, x, y, 'door');
    game.add.existing(this);

    this.triangle = game.add.sprite(x, y, 'triangle');
    this.triangle.position.y -= 64/2 + 10;
    this.triangle.position.x += 64/4;
    this.triangle.alpha = 0;
    this.triangle.scale.setTo(.5, .5);
    this.triangle.tint = 0xC82846;

    game.physics.enable(this);
    this.body.immovable = true;
    this.body.allowGravity = false;

    this.game = game;
};

Door.prototype = Object.create(Phaser.Sprite.prototype);
Door.prototype.constructor = Door;

Door.prototype.update = function()
{
    this.canEnterDoor = false;

    this.game.physics.arcade.overlap(this.player, this, function(player, door) {
        this.canEnterDoor = true;

        if (this.canEnterDoor && !this.triangleTweening) {
            player.currentDoor = this;
            this.game.add.tween(this.triangle)
                         .to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            this.triangleTweening = true;
        }
    }, null, this);

    if (!this.canEnterDoor && this.triangleTweening) {
        this.game.add.tween(this.triangle)
                     .to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
        this.triangleTweening = false;
    }
};

window.Door = Door;
})();
