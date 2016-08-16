var SingleModeLayer = cc.Layer.extend({
    roles: [],
    current: 0,
    total: Config.roleSelect.length,
    ctor: function () {
        this._super();
        var bgSprite = new BGSprite(res.rolesBG_png);

        cc.spriteFrameCache.addSpriteFrames(res.selectRole_plist, res.selectRole_png);

        var playBtn = this.playBtn = new cc.MenuItemImage(
            '#btn_start.png',
            '#btn_start_hover.png',
            '#btn_start_disabled.png',
            this.onPlay,
            this
        );
        playBtn.x = Config.w_2;
        playBtn.y = 180;

        var back = new cc.MenuItemImage(
            '#icon_back.png',
            '#icon_back_hover.png',
            this.onBack,
            this
        );
        back.x = 40;
        back.y = Config.h - 50;

        var menu = new cc.Menu(playBtn, back);
        menu.x = 0;
        menu.y = 0;

        this.addChild(bgSprite);
        this.addChoose();
        this.addChild(menu);
        this.addChild(back);
        return true;
    },
    addChoose: function () {
        var leftBtn = new cc.MenuItemImage(
            '#icon_left.png',
            '#icon_left_hover.png',
            '#icon_left_disabled.png',
            function () {
                this.onChoose('left');
            },
            this
        );
        var rightBtn = new cc.MenuItemImage(
            '#icon_right.png',
            '#icon_right_hover.png',
            '#icon_right_disabled.png',
            function () {
                this.onChoose('right');
            },
            this
        );

        var controlBtn = new cc.Menu(leftBtn, rightBtn);
        controlBtn.alignItemsHorizontallyWithPadding(450);
        controlBtn.x = Config.w_2;
        controlBtn.y = Config.h_2 + 180;

        this.initRoles();

        var draw = this.draw = new cc.DrawNode();
        draw.x = Config.w_2 - (this.total - 2) * 35;
        draw.y = Config.h_2 - 30;

        for (var i = 0; i < this.total; i++) {
            if (i === 0) {
                draw.drawRect(cc.p(0, 0), cc.p(20, 20), cc.color(239, 178, 82), 1, cc.color(239, 178, 82));
            } else {
                draw.drawRect(cc.p(35 * i, 0), cc.p(35 * i + 20, 20), cc.color(181, 181, 181), 1, cc.color(181, 181, 181));
            }
        }

        this.addChild(controlBtn);
        this.addChild(draw);
    },
    initRoles: function () {
        //添加角色人物
        for (var j = 0, rolesConfig = Config.roleSelect; j < rolesConfig.length; j++) {
            var roleImg = rolesConfig[j] ? '#role' + j + '.png' : '#role' + j + '_locked.png',
                roleIntro = '#role' + j + 'intro.png';

            var tmpRole = new cc.Sprite(roleImg);
            tmpRole.x = Config.w_2;
            tmpRole.y = Config.h - 370;
            var tmpIntro = new cc.Sprite(roleIntro);
            tmpIntro.x = Config.w_2;
            tmpIntro.y = Config.h_2 - 165;

            if (j) {
                tmpRole.setOpacity(0);
                tmpIntro.setOpacity(0);
            }

            this.addChild(tmpRole);
            this.addChild(tmpIntro);
            this.roles[j] = [tmpRole, tmpIntro];
        }

        //滑动事件
        this.swipeChange();
    },
    onChoose: function (direction) {
        var last = this.current,
            actionIn = cc.fadeIn(0.2),
            actionOut = actionIn.reverse();

        if (direction === 'left') {
            this.current = last === 0 ? this.total - 1 : this.current - 1;
        } else {
            this.current = last === this.total - 1 ? 0 : this.current + 1;
        }

        var roleLast = this.roles[last],
            roleCurr = this.roles[this.current],
            s1 = cc.targetedAction(roleCurr[0], cc.show()),
            s2 = cc.targetedAction(roleCurr[1], cc.show()),
            t1 = cc.targetedAction(roleCurr[0], actionIn),
            t2 = cc.targetedAction(roleCurr[1], actionIn.clone());

        roleLast[0].runAction(cc.sequence(actionOut, cc.hide(), s1, t1));
        roleLast[1].runAction(cc.sequence(actionOut.clone(), cc.hide(), s2, t2));
        this.changeStatus(this.current, last);
        this.setPlayBtn();
    },
    setPlayBtn: function () {
        Config.roleSelect[this.current] ? this.playBtn.setEnabled(true) : this.playBtn.setEnabled(false);
    },
    changeStatus: function (current, last) {
        var draw = this.draw;
        draw.drawRect(cc.p(35 * current, 0), cc.p(35 * current + 20, 20), cc.color(239, 178, 82), 1, cc.color(239, 178, 82));
        draw.drawRect(cc.p(35 * last, 0), cc.p(35 * last + 20, 20), cc.color(181, 181, 181), 1, cc.color(181, 181, 181));
    },
    swipeChange: function () {
        var startPos = null,
            _this = this;

        var swipeStart = function (e) {
            startPos = e.getLocation();
            return true;
        };
        var swipeEnd = function (e) {
            var endPos = e.getLocation(),
                direction = null;
            if (startPos && Math.abs(startPos.x - endPos.x) > 30) {
                direction = (startPos.x - endPos.x > 0) ? 'right' : 'left';
                _this.onChoose(direction);
            }
        };

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: swipeStart,
            onTouchMoved: function () { },
            onTouchEnded: swipeEnd,
            onTouchCancelled: function () { }
        }, this);
    },
    onBack: function () {
        cc.director.runScene(new cc.TransitionFade(1.2, new StartScene()));
    },
    onPlay: function () {
        var _this = this;
        if (Config.first) {
            cc.director.runScene(new cc.TransitionFade(1.2, new IntroScene({ from: 'singleModeScene' })));
        } else {
            switchToGame();
            /**
             * @desc bukas 2016-08-11 
             */
            cc.director.runScene(new PlayScene(_this.current));
            // LoaderScene.ajaxLoad({
            //     url: Config.urls.start,
            //     data: {'UserId': Config.user.userId},
            //     success: function(data){
            //         if(data['msg']) {
            //             alert(data['msg']);
            //             cc.director.runScene(new SingleModeScene());
            //         }else{
            //             Utils.k = Utils.decrypt(Utils.h, data['zz']);
            //             cc.director.runScene(new PlayScene(_this.current));
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
var SingleModeScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new SingleModeLayer();
        //layer.bake();
        this.addChild(layer);
    }
});