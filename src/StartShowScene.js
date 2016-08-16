var StartShowLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.beforeStorm();
    },
    beforeStorm: function () {
        var colorBg = this.colorBg = new cc.Sprite('#start_show_color_bg.png');
        colorBg.x = Config.w_2;
        colorBg.y = Config.h_2;
        var sun = this.sun = new cc.Sprite('#start_show_sun.png');
        sun.x = 200;
        sun.y = Config.h - 150;
        var sunlight = this.sunlight = new cc.Sprite('#start_show_sun_light.png');
        sunlight.x = 0;
        sunlight.y = 180;
        sunlight.scale = 0.7;
        var cloud1 = this.cloud1 = new cc.Sprite('#start_show_cloud1.png');
        cloud1.x = Config.w_2 + 60;
        cloud1.y = Config.h - 100;
        var cloud2 = this.cloud2 = new cc.Sprite('#start_show_cloud2.png');
        cloud2.x = Config.w_2 + 220;
        cloud2.y = Config.h - 130;
        var cloud3 = this.cloud3 = new cc.Sprite('#start_show_cloud3.png');
        cloud3.x = Config.w - 10;
        cloud3.y = Config.h - 40;
        this.addChild(colorBg);
        sun.addChild(sunlight);
        colorBg.addChild(sun);
        colorBg.addChild(cloud1);
        colorBg.addChild(cloud2);
        colorBg.addChild(cloud3);
        /**动作***/
        sunlight.runAction(cc.sequence(cc.moveTo(1, cc.p(sunlight.x - 5, sunlight.y + 5)), cc.moveTo(1, cc.p(sunlight.x + 5, sunlight.y - 5))).repeatForever())
        sunlight.runAction(cc.sequence(cc.scaleTo(1, 1), cc.scaleTo(1, 0.7)).repeatForever());

        cloud1.runAction(cc.moveBy(2, cc.p(-50, 0)));
        cloud2.runAction(cc.moveBy(3, cc.p(-70, 0)));
        cloud3.runAction(cc.sequence(cc.moveBy(2, cc.p(-50, 0)), cc.callFunc(function () {
            this.duringStorm();
        }, this)));
    },
    duringStorm: function () {
        var blackCloud1 = new cc.Sprite('#start_show_black_cloud1.png');
        blackCloud1.x = Config.w_2 + 200;
        blackCloud1.y = Config.h;
        var lighting = this.lighting = new cc.Sprite('#start_show_lighting.png');
        lighting.x = Config.w_2 - 20;
        lighting.y = Config.h - 300;
        var whiteLighting = new cc.Sprite('#start_show_white_lighting.png');
        whiteLighting.x = Config.w_2 - 20;
        whiteLighting.y = Config.h - 300;
        var blackLayer = new cc.LayerColor(cc.color(0, 0, 0, 0));
        var whiteLayer = new cc.LayerColor(cc.color(255, 255, 255, 255));
        this.addChild(blackCloud1);
        this.addChild(blackLayer);
        blackLayer.runAction(cc.fadeTo(0.5, 150));
        blackCloud1.runAction(cc.sequence(cc.moveTo(0.5, cc.p(Config.w_2, Config.h - 100))));
        this.sun.runAction(cc.sequence(cc.delayTime(0.2), cc.moveTo(0.3, cc.p(-200, this.sun.y)), cc.callFunc(function () {
            this.sun.removeFromParent(true);
            this.addChild(whiteLighting);
            this.addChild(lighting, 1);
            this.addChild(whiteLayer);
            lighting.runAction(cc.blink(0.5, 4));
            whiteLayer.runAction(cc.sequence(cc.blink(0.5, 4), cc.callFunc(function () {
                whiteLayer.removeFromParent();
                blackLayer.zIndex = 2;
                blackLayer.runAction(cc.sequence(
                    cc.fadeTo(0.5, 255), cc.delayTime(0.5), cc.callFunc(function () {
                        blackLayer.removeFromParent(true);
                        blackCloud1.removeFromParent(true);
                        whiteLighting.removeFromParent(true);
                        this.colorBg.removeFromParent(true);
                        this.afterStorm();
                    }, this)
                ))
            }, this)));
        }, this)));
    },
    afterStorm: function () {
        var blackBg = this.blackBg = new cc.Sprite('#start_show_black_bg.png');
        blackBg.x = Config.w_2;
        blackBg.y = Config.h_2;
        var blackClouds = new cc.Sprite('#start_show_black_clouds.png');
        blackClouds.x = Config.w_2;
        blackClouds.y = Config.h - 150;
        var amazeLashi = new cc.Sprite('#start_show_amaze_lashi.png');
        amazeLashi.x = 90;
        amazeLashi.y = Config.h_2 - 10;
        var amazeSaoshi = new cc.Sprite('#start_show_amaze_saoshi.png');
        amazeSaoshi.x = Config.w_2 - 100;
        amazeSaoshi.y = 280;
        var amazeXiashi = new cc.Sprite('#start_show_amaze_xiashi.png');
        amazeXiashi.x = Config.w_2 + 120;
        amazeXiashi.y = Config.h_2 + 90;
        var amazeNiushi = new cc.Sprite('#start_show_amaze_niushi.png');
        amazeNiushi.x = Config.w - 80;
        amazeNiushi.y = Config.h_2 + 240;
        this.addChild(blackBg);
        this.blackBg.addChild(blackClouds);
        this.blackBg.addChild(amazeLashi);
        this.blackBg.addChild(amazeSaoshi);
        this.blackBg.addChild(amazeXiashi);
        this.blackBg.addChild(amazeNiushi);
        /***动作****/
        amazeLashi.runAction(cc.blink(0.5, 2));
        amazeSaoshi.runAction(cc.blink(0.5, 2));
        amazeXiashi.runAction(cc.blink(0.5, 2));
        amazeNiushi.runAction(cc.blink(0.5, 2));
        this.blackBg.runAction(cc.sequence(cc.delayTime(0.8), cc.callFunc(function () {
            this.blackBg.removeFromParent(true);
            this.lighting.removeFromParent(true);
            this.runStart();
        }, this)));
    },
    runStart: function () {
        cc.director.runScene(new cc.TransitionFade(0.5, new StartScene()));
    }
});
var StartShowScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.startShow_plist, res.startShow_png);
        var layer = new StartShowLayer();
        this.addChild(layer);
    },
    onExit: function () {
        this._super();
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.startShow_plist);
    }
});