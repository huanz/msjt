var IntroLayer = cc.Layer.extend({
    current: 0,
    total: 3,
    preLayer: null,
    ctor: function (opts) {
        this._super();
        this.opts = opts;
        var bakeLayer = new cc.Layer();
        bakeLayer.bake();
        this.addChild(bakeLayer);

        var bgSprite = new cc.Sprite('#intro_bg.png');
        bgSprite.x = Config.w_2;
        bgSprite.y = Config.h_2;
        var bgLayer = new cc.LayerColor(cc.color(0, 0, 0, 140));

        bakeLayer.addChild(bgSprite);
        bakeLayer.addChild(bgLayer);

        var skipBtn = new cc.MenuItemImage(
            '#intro_pass.png',
            '#intro_pass_hover.png',
            this.onStart,
            this
        );

        var menu = this.skipMenu = new cc.Menu(skipBtn);
        menu.x = Config.w - 80;
        menu.y = Config.h - 50;
        this.addChild(menu, 2);

        this.touchLayer0();
        return true;

    },
    touchLayer0: function () {
        var layer1 = new cc.Layer();
        var clipEllipse = new cc.Sprite('#intro_linkrole.png');
        clipEllipse.x = 100;
        clipEllipse.y = Config.h - 50;

        var look = new cc.Sprite('#intro_look.png');
        look.x = 275;
        look.y = Config.h - 100;


        var tipTxt = new cc.Sprite('#intro_score.png');
        tipTxt.x = Config.w_2;
        tipTxt.y = 260;

        var iKnow = new cc.MenuItemImage(
            '#intro_know.png',
            '#intro_know_hover.png',
            this.onNext,
            this
        );
        var iKnowMenu = new cc.Menu(iKnow);
        iKnowMenu.x = Config.w_2;
        iKnowMenu.y = 200;

        layer1.addChild(clipEllipse);
        layer1.addChild(look);
        layer1.addChild(tipTxt);
        layer1.addChild(iKnowMenu);

        this.addChild(layer1);
        this.preLayer = layer1;
    },
    touchLayer1: function () {
        var layer2 = new cc.Layer();
        var link = new cc.Sprite('#intro_link.png');
        link.x = 270;
        link.y = 760;

        var twoCircle = new cc.Sprite('#intro_2yuan.png');
        twoCircle.x = Config.w_2;
        twoCircle.y = 566;

        var sprite0 = new cc.Sprite('#niushi.png');
        sprite0.x = 230;
        sprite0.y = 566;
        sprite0.type = 0;

        var sprite1 = new cc.Sprite('#saoshi.png');
        sprite1.x = 510;
        sprite1.y = 566;
        sprite1.type = 1;

        var hand = new cc.Sprite('#intro_hand.png');
        hand.x = 270;
        hand.y = 410;

        layer2.addChild(link);
        layer2.addChild(twoCircle);
        layer2.addChild(sprite0, 1);
        layer2.addChild(sprite1, 1);
        layer2.addChild(hand, 2);
        this.addChild(layer2);

        var move1 = cc.moveBy(1.5, cc.p(300, 0)),
            move2 = cc.moveBy(0.8, cc.p(0, 10));
        hand.runAction(cc.sequence(cc.moveBy(1.6, cc.p(300, 0)), cc.moveBy(0, cc.p(-300, 0))).repeatForever());
        link.runAction(cc.sequence(move2, move2.reverse()).repeatForever());

        var line = new cc.DrawNode();
        layer2.addChild(line);

        var linkSprites = [sprite0, sprite1];
        this.addTouch(linkSprites, line);

        this.preLayer = layer2;
    },
    addTouch: function (linkSprites, draw) {
        var _this = this;
        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget(),
                    locationInNode = target.convertToNodeSpace(touch.getLocation()),
                    s = target.getContentSize(),
                    rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
                var pos = touch.getLocation(),
                    target = event.getCurrentTarget();
                _this.drawLine(draw, target, pos);
            },
            onTouchEnded: function (touch, event) {
                var endTarget = linkSprites[+!event.getCurrentTarget().type],
                    locationInNode = endTarget.convertToNodeSpace(touch.getLocation()),
                    s = endTarget.getContentSize();
                s.width *= 1.2;
                s.height *= 1.2;
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    _this.onNext();
                }
            }
        });
        cc.eventManager.addListener(touchListener, linkSprites[0]);
        cc.eventManager.addListener(touchListener.clone(), linkSprites[1]);
    },
    drawLine: function (draw, target, pos) {
        draw.clear();
        var pointer = [
            cc.p(target.x, target.y + 20),
            cc.p(pos.x, pos.y + 10),
            cc.p(pos.x, pos.y - 10),
            cc.p(target.x, target.y - 20)
        ];
        draw.drawPoly(pointer, cc.color(0, 0, 0, 255), 1, cc.color(0, 0, 0, 255));
        draw.drawDot(pos, 10, cc.color(0, 0, 0, 255));
    },
    touchLayer2: function () {
        var layer3 = new cc.Layer();

        var chest = new cc.Sprite('#intro_box.png');
        chest.x = 225;
        chest.y = 735;

        var hand = new cc.Sprite('#intro_hand.png');
        hand.x = 430;
        hand.y = 570;
        hand.rotation = -15;

        var boxTxt = new cc.Sprite('#intro_inbox.png');
        boxTxt.x = Config.w_2;
        boxTxt.y = 260;

        var iKnow = new cc.MenuItemImage(
            '#intro_know.png',
            '#intro_know_hover.png',
            this.onNext,
            this
        );
        var iKnowMenu = new cc.Menu(iKnow);
        iKnowMenu.x = Config.w_2;
        iKnowMenu.y = 200;

        layer3.addChild(chest);
        layer3.addChild(hand);
        layer3.addChild(boxTxt);
        layer3.addChild(iKnowMenu);
        this.addChild(layer3);


        var _this = this;
        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget(),
                    locationInNode = target.convertToNodeSpace(touch.getLocation()),
                    s = target.getContentSize(),
                    rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true;
                }
                return false;
            },
            onTouchEnded: function (touch, event) {
                var endTarget = event.getCurrentTarget(),
                    locationInNode = endTarget.convertToNodeSpace(touch.getLocation()),
                    s = endTarget.getContentSize(),
                    rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    _this.onNext();
                }
            }
        });
        cc.eventManager.addListener(touchListener, chest);

        hand.runAction(cc.sequence(cc.moveBy(1.5, cc.p(-50, 30)), cc.moveBy(0, cc.p(50, -30))).repeatForever());

        this.preLayer = layer3;
    },
    touchLayer3: function () {
        this.skipMenu.setVisible(false);

        var layer4 = new cc.Layer();

        var avoidTxt = new cc.Sprite('#intro_mihuo.png');
        avoidTxt.x = Config.w_2;
        avoidTxt.y = 180;

        var startBtn = new cc.MenuItemImage(
            '#btn_enter.png',
            '#btn_enter_hover.png',
            this.onStart,
            this
        );
        var startMenu = new cc.Menu(startBtn);
        startMenu.x = Config.w_2;
        startMenu.y = 140;
        startMenu.setVisible(false);

        var first = new cc.Sprite('#intro_pang.png');
        var second = new cc.Sprite('#intro_dao.png');
        var third = new cc.Sprite('#intro_las.png');
        var disable1 = new cc.Sprite('#intro_x.png');
        disable1.scale = 0;
        var disable2 = new cc.Sprite('#intro_x.png');
        disable2.scale = 0;
        var disable3 = new cc.Sprite('#intro_x.png');
        disable3.scale = 0;


        layer4.addChild(first);
        layer4.addChild(second);
        layer4.addChild(third);
        layer4.addChild(disable1);
        layer4.addChild(disable2);
        layer4.addChild(disable3);
        layer4.addChild(avoidTxt);
        layer4.addChild(startMenu);
        this.addChild(layer4);
        this.preLayer = layer4;

        first.runAction(cc.spawn(cc.moveTo(0.8, cc.p(505, 740)), cc.rotateBy(0.8, 720)));
        second.runAction(cc.spawn(cc.moveTo(0.8, cc.p(240, 398)), cc.rotateBy(0.8, 720)));
        third.runAction(cc.spawn(cc.moveTo(0.8, cc.p(496, 405)), cc.rotateBy(0.8, 720)));
        disable1.runAction(cc.sequence(cc.delayTime(0.8), cc.spawn(cc.scaleTo(0.5, 1), cc.moveTo(0.5, cc.p(505, 740)))));
        disable2.runAction(cc.sequence(cc.delayTime(1.3), cc.spawn(cc.scaleTo(0.5, 1), cc.moveTo(0.5, cc.p(240, 398)))));
        disable3.runAction(cc.sequence(cc.delayTime(1.8), cc.spawn(cc.scaleTo(0.5, 1), cc.moveTo(0.5, cc.p(496, 405))), cc.callFunc(function () {
            startMenu.setVisible(true);
        }, this)));

    },
    onNext: function () {
        this.preLayer.runAction(cc.sequence(cc.moveBy(0.5, cc.p(-Config.w, 0)), cc.removeSelf(true), cc.callFunc(function () {
            switch (++this.current) {
                case 1:
                    this.touchLayer1();
                    break;
                case 2:
                    this.touchLayer2();
                    break;
                case 3:
                    this.touchLayer3();
                    break;
                default:
                    break;
            }
        }, this)));
    },
    onStart: function () {
        if (this.opts.from === 'helpScene') {
            cc.director.runScene(new cc.TransitionFade(1.2, new SingleModeScene()));
        } else {
            /**
             * @desc bukas 2016-08-11
             */
            Config.first = false;
            cc.director.runScene(new PlayScene(0));
            // LoaderScene.ajaxLoad({
            //     url: Config.urls.start,
            //     data: {'UserId': Config.user.userId, 'update': 1},
            //     success: function(data){
            //         if(data['msg']) {
            //             alert(data['msg']);
            //             cc.director.runScene(new SingleModeScene());
            //         }else{
            //             Config.first = false;
            //             Utils.k = Utils.decrypt(Utils.h, data['zz']);
            //             cc.director.runScene(new PlayScene(0));
            //         }
            //     },
            //     error: function(xhr, status, msg){
            //         alert(msg);
            //         cc.director.runScene(new SingleModeScene());
            //     }
            // });
        }
    }
});

var IntroScene = cc.Scene.extend({
    ctor: function (opts) {
        this.opts = opts;
        this._super();
    },
    onEnter: function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.intro_plist, res.intro_png);
        var layer = new IntroLayer(this.opts);
        this.addChild(layer);
    },
    onExit: function () {
        this._super();
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.intro_plist);
    }
});