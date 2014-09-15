(function() {
'use strict';

/*
function tweenTint(game, obj, startColor, endColor, time) {
    // create an object to tween with our step value at 0
    var colorBlend = {step: 0};

    // create the tween on this object and tween its step property to 100
    var colorTween = game.add.tween(colorBlend).to({step: 100}, time);
    
    // run the interpolateColor function every time the tween updates, feeding it the
    // updated value of our tween each time, and set the result as our tint
    colorTween.onUpdateCallback(function() {
      obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);   
    });
    
    // set the object to the start color straight away
    obj.tint = startColor;    
    
    // start the tween
    colorTween.start();
}
*/

var Pickup = function(game, state, x, y, target, type) {
    // Type
    switch (type) {
        case 'quantum-leap':
            // Might want to change the sprite name if that is needed.
            // Then what to do.
            this.hudID = 0;

            break;

        case 'shield':
            // Might want to change the sprite name if that is needed.
            // Then what to do.
            this.hudID = 1;

            break;

        case 'health':
            // Might want to change the sprite name if that is needed.
            // Then what to do.

            break;

        default:
            console.log(type + ' is no valid type for a pickup.');
    }

    // Init the sprite
    Phaser.Sprite.call(this, game, x, y-16-8, 'pickup-' + type);
    game.add.existing(this);

    // Physics
    game.physics.enable(this);
    this.body.allowGravity = false;
    //this.body.immovable = false;

    // Setup
    this.target = target;
    this.pickupType = type;
    this.anchor.setTo(.5, .5);

    this.game = game;
    this.state = state;
};

Pickup.prototype = Object.create(Phaser.Sprite.prototype);
Pickup.prototype.constructor = Pickup;

Pickup.prototype.update = function() {
    //this.scale.setTo(1 - .05*Math.sin(this.game.time.now * .005));
    this.alpha = 1 - .2*Math.sin(this.game.time.now * .01);
    this.rotation = .1*Math.sin(this.game.time.now * .005);

    this.game.physics.arcade.overlap(this.target, this, function(player, pickup) {
        this.game.sounds.pickup.play();

        if (typeof this.hudID !== 'undefined') {
            this.state.abilityIcons.children[this.hudID].tint = 0xC82846;
            this.state.abilityIcons.children[this.hudID].alpha = 1;

            // TODO It might be a health pickup.
            player.powers[this.pickupType] = true;
        }

        else if (this.pickupType === 'health') {
            console.log(player.health);
            player.damage(-33);
            console.log(player.health);
        }

        this.body.enable = false;

        this.game.add.tween(this)
                     .to({ alpha: 0 }, 600, null, true);
        this.game.add.tween(this.scale)
                     .to({ x: 20, y: 20 }, 600, null, true)
                     .onComplete.add(function() {
                         this.destroy();
                     }, this);
    }, null, this);
}

window.Pickup = Pickup;
})();
