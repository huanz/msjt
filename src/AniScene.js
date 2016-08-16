var startAnimates = [
    [res.animation0_png, res.animation0_plist],
    [res.animation1_png, res.animation1_plist],
    [res.animation2_png, res.animation2_plist],
    [res.animation3_png, res.animation3_plist]
];

var AniLayer = cc.LayerColor.extend({
    ctor: function () {
        this._super(cc.color(216, 216, 216));
        this.startAnimate();
        return true;
    },
    startAnimate: function () {
        var _this = this,
            spriteFrameCache = cc.spriteFrameCache;
        for (var i = 0; i < startAnimates.length; i++) {
            spriteFrameCache.addSpriteFrames(startAnimates[i][1], startAnimates[i][0]);
        };

        var kaichang = new cc.Sprite(spriteFrameCache.getSpriteFrame('kaichang.png'));
        kaichang.x = Config.w_2;
        kaichang.y = Config.h + 200;

        var frames1 = [], frames2 = [];
        for (var j = 3; j < 21; j++) {
            frames1.push(spriteFrameCache.getSpriteFrame('kaichang_000' + ((j < 10) ? ('0' + j) : j) + '.png'));
        }
        for (var k = 28; k < 60; k++) {
            frames2.push(spriteFrameCache.getSpriteFrame('kaichang_000' + k + '.png'));
        }
        var animation1 = new cc.Animation(frames1, 0.08),
            animation2 = new cc.Animation(frames2, 0.08);

        var sprite1 = new cc.Sprite(spriteFrameCache.getSpriteFrame('shi1.png')),
            sprite2 = new cc.Sprite(spriteFrameCache.getSpriteFrame('shi2.png')),
            sprite3 = new cc.Sprite(spriteFrameCache.getSpriteFrame('shi3.png')),
            sprite4 = new cc.Sprite(spriteFrameCache.getSpriteFrame('shi4.png'));

        sprite1.x = Config.w_2 - 205;
        sprite2.x = Config.w_2 - 70;
        sprite3.x = Config.w_2 + 82;
        sprite4.x = Config.w_2 + 226;
        sprite1.y = sprite2.y = sprite3.y = sprite4.y = Config.h + 200;

        this.addChild(kaichang);
        this.addChild(sprite1);
        this.addChild(sprite2);
        this.addChild(sprite3);
        this.addChild(sprite4);

        /*var sprite1Move = cc.moveTo(1.5, cc.p(Config.w_2 - 205, Config.h_2 + 178)),
            sprite2Move = cc.moveTo(1.5, cc.p(Config.w_2 - 70, Config.h_2 + 179)),
            sprite3Move = cc.moveTo(1.5, cc.p(Config.w_2 + 82, Config.h_2 + 173)),
            sprite4Move = cc.moveTo(1.5, cc.p(Config.w_2 + 226, Config.h_2 + 191));*/
        var move = cc.moveTo(0.4, cc.p(Config.w_2, Config.h_2 + 150));
        var seq = cc.sequence(move, cc.animate(animation1), cc.delayTime(2.1), cc.animate(animation2), cc.callFunc(this.runStart, this));
        kaichang.runAction(seq);
        sprite1.runAction(cc.sequence(cc.delayTime(3.0), cc.moveBy(0.35, cc.p(0, -465))));
        sprite2.runAction(cc.sequence(cc.delayTime(3.2), cc.moveBy(0.35, cc.p(0, -464))));
        sprite3.runAction(cc.sequence(cc.delayTime(3.4), cc.moveBy(0.35, cc.p(0, -470))));
        sprite4.runAction(cc.sequence(cc.delayTime(3.6), cc.moveBy(0.35, cc.p(0, -452)), cc.callFunc(this.removeSprites, this, [sprite1, sprite2, sprite3, sprite4])));
    },
    removeSprites: function (e, sprites) {
        for (var i = 0; i < sprites.length; i++) {
            this.removeChild(sprites[i], true);
        }
    },
    runStart: function () {
        var toScene = Config.first ? new StartShowScene() : new StartScene();
        cc.director.runScene(new cc.TransitionFade(1.2, toScene));
    }
});
var AniScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new AniLayer();
        this.addChild(layer);
    },
    onExit: function () {
        this._super();
        var spriteFrameCache = cc.spriteFrameCache;
        for (var i = 0; i < startAnimates.length; i++) {
            spriteFrameCache.removeSpriteFramesFromFile(startAnimates[i][1]);
        };
    }
});