var HelpLayer = cc.LayerColor.extend({
    ctor: function (color) {
        this._super(color);
        var bg = new BGSprite(res.help_bg);

        var back = new cc.MenuItemImage(
            '#icon_back.png',
            '#icon_back_hover.png',
            this.onBack,
            this
        );
        back.x = 40;
        back.y = Config.h - 50;
        var introBtn = new cc.MenuItemImage(
            '#btn_help_intro.png',
            '#btn_help_intro_hover.png',
            this.onIntro,
            this
        );
        introBtn.x = Config.w_2;
        introBtn.y = 100;
        var menu = new cc.Menu(back, introBtn);
        menu.x = 0;
        menu.y = 0;

        var scrollLayer = new cc.LayerColor(cc.color(17, 17, 17, 255));
        scrollLayer.width = 567;
        scrollLayer.height = 638;
        scrollLayer.x = (Config.w - scrollLayer.width) / 2;
        scrollLayer.y = (Config.h - scrollLayer.height) / 2;
        var detailText = new cc.Sprite(res.help_detail);
        detailText.x = 290;
        detailText.y = 20;
        scrollLayer.addChild(detailText);
        var scrollBtn = new cc.Sprite('#btn_scroll.png');
        scrollBtn.x = Config.w_2;
        scrollBtn.y = 230;
        scrollBtn.runAction(cc.sequence(
            cc.moveBy(0.5, cc.p(0, 20)),
            cc.moveBy(0.5, cc.p(0, -20))
        ).repeatForever());
        this.addChild(scrollLayer);
        this.addChild(bg);
        this.addChild(menu);
        this.addChild(scrollBtn);

        var startPos = null;
        var direct = 0;
        var swipeStart = function (e) {
            startPos = e.getLocation();
            return true;
        };
        var swipeMove = function (e) {
            var currentPos = e.getLocation();
            if (currentPos.y > startPos.y && detailText.y < 600) {
                detailText.y += currentPos.y - startPos.y;
                startPos.y = currentPos.y;
                direct = 0;
            } else if (currentPos.y <= startPos.y && detailText.y > 20) {
                detailText.y -= startPos.y - currentPos.y;
                startPos.y = currentPos.y;
                direct = 1;
            }
        };
        var swipeEnd = function (e) {
            detailText.y > 600 ? scrollBtn.visible = false : scrollBtn.visible = true;
            if (direct == 0) {
                detailText.runAction(cc.sequence(cc.moveBy(0.5, cc.p(0, 30)).easing(cc.easeSineOut()), cc.callFunc(function () {
                    if (detailText.y > 600) {
                        detailText.y = 600;
                    }
                })));
            } else if (direct == 1) {
                detailText.runAction(cc.sequence(cc.moveBy(0.5, cc.p(0, -30)).easing(cc.easeSineOut()), cc.callFunc(function () {
                    if (detailText.y < 20) {
                        detailText.y = 20;
                    }
                })));
            }
        };
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: swipeStart,
            onTouchMoved: swipeMove,
            onTouchEnded: swipeEnd
        }, detailText);
    },
    onIntro: function () {
        cc.director.runScene(new cc.TransitionFade(1.2, new IntroScene({ from: 'helpScene' })));
    },
    onBack: function () {
        cc.director.runScene(new cc.TransitionFade(1.2, new StartScene()));
    }
});
var HelpScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HelpLayer(cc.color(17, 17, 17, 255));
        this.addChild(layer);
    }
});