var awardTip = cc.LayerColor.extend({
    ctor: function (coin) {
        this._super(cc.color(0, 0, 0, 180));
        this.coin = coin;
        var alertLayer = new cc.Layer();
        alertLayer.x = Config.w_2;
        alertLayer.y = 3 * Config.h_2;
        this.addChild(alertLayer);

        var alertBG = new cc.Sprite(res.singleEnd_png, cc.rect(2, 298, 616, 580));
        alertBG.x = 0;
        alertBG.y = 0;

        var tip = new cc.LabelTTF('恭喜您！获得' + this.coin + '个流量币！', 'msjt', 60, cc.size(360, 240));
        tip.x = 20;
        tip.y = 0;
        tip.setFontFillColor(cc.color(0, 0, 0));

        alertLayer.addChild(alertBG);
        alertLayer.addChild(tip);

        var seq, menu, exBtn, closeBg;
        if (Config.isLogin) {
            seq = cc.sequence(cc.delayTime(0.5), cc.moveBy(0.5, cc.p(0, -Config.h)).easing(cc.easeOut(0.5)), cc.delayTime(1.5), cc.fadeOut(0.5), cc.callFunc(this.onRemove, this));
        } else {
            seq = cc.sequence(cc.delayTime(0.5), cc.moveBy(0.5, cc.p(0, -Config.h)).easing(cc.easeOut(0.5)));
            exBtn = new cc.MenuItemSprite(
                new cc.Sprite(res.btnEx_png, cc.rect(2, 2, 295, 99)),
                new cc.Sprite(res.btnEx_png, cc.rect(299, 2, 295, 99)),
                this.onExchange,
                this
            );
            exBtn.x = 0;
            exBtn.y = -100;

            closeBtn = new cc.MenuItemSprite(
                new cc.Sprite(res.singleEnd_png, cc.rect(103, 880, 48, 48)),
                new cc.Sprite(res.singleEnd_png, cc.rect(153, 880, 48, 48)),
                this.onRemove,
                this
            );
            closeBtn.x = 265;
            closeBtn.y = 270;

            menu = new cc.Menu(exBtn, closeBtn);
            menu.x = 0;
            menu.y = 0;

            closeBg = new cc.Sprite(res.singleEnd_png, cc.rect(2, 880, 99, 95));
            closeBg.x = 260;
            closeBg.y = 268;

            alertLayer.addChild(closeBg);
            alertLayer.addChild(menu);
        }
        alertLayer.runAction(seq);
        return true;
    },
    onExchange: function () {
        Config.UserGetCoin = this.coin;
        LoaderScene.preload(res.login_png, function () {
            cc.director.runScene(new LoginScene());
        });
    },
    onRemove: function () {
        cc.eventManager.resumeTarget(this.parent, true);
        this.removeFromParent(true);
    }
});

var SingleEndLayer = cc.Layer.extend({
    awardCoins: [],
    ctor: function (score, roleid) {
        this._super();
        //记录选择的角色id
        this.roleid = roleid;
        this.score = score;

        var bakeLayer = new cc.Layer();
        //bakeLayer.bake();
        this.addChild(bakeLayer);

        var bgSprite = new BGSprite(res.singleEndBG_png);

        var playagainBtn = new cc.MenuItemImage(
            '#btn_playagain.png',
            '#btn_playagain_hover.png',
            this.onPlayagain,
            this
        );

        var goIndexBtn = new cc.MenuItemImage(
            '#btn_goindex.png',
            '#btn_goindex_hover.png',
            this.onBackIndex,
            this
        );

        var shareBtn = new cc.Menu(new cc.MenuItemImage(
            '#icon_share.png',
            '#icon_share_hover.png',
            this.onShare,
            this
        ));
        shareBtn.x = Config.w - 50;
        shareBtn.y = Config.h - 50;

        var menu = new cc.Menu(playagainBtn, goIndexBtn);
        menu.alignItemsHorizontallyWithPadding(70);
        menu.x = Config.w_2;
        menu.y = 105;


        bakeLayer.addChild(bgSprite);
        bakeLayer.addChild(shareBtn);
        bakeLayer.addChild(menu);
        this.addScores(score, bakeLayer);

        return true;
    },
    addScores: function (score, bakeLayer) {
        var nowTotal = Config.score.total + score;
        //Config.score.total += score;
        //人物解锁
        for (var i = 0; i < Config.roleSelect.length; i++) {
            if (!Config.roleSelect[i] && nowTotal >= Config.roleLock[i]) {
                Config.roleSelect[i] = true;
            }
        }
        var newRecord = false;
        //&& Config.score.high = score;
        if (score > Config.score.high) {
            Config.score.high = score;
            newRecord = true;
        }
        var txt = Config.isLogin ? '帐号流量币数:' : '可领取流量币:';
        var nbText = new cc.LabelTTF(txt, 'msjt', 36, cc.size(Config.w_2, 36));
        nbText.x = 200;
        nbText.y = Config.h - 45;
        nbText.setFontFillColor(cc.color(181, 181, 181));
        var ncoin = this.ncoin = new cc.LabelTTF(Config.flowCoin + '', 'msjt', 60, cc.size(Config.w_2, 60));
        ncoin.x = Config.w_2 + 80;
        ncoin.y = Config.h - 45;
        ncoin.setFontFillColor(cc.color(181, 181, 181));

        var HScore = null;
        if (newRecord) {
            HScore = new cc.Sprite(res.singleEnd_png, cc.rect(2, 2, 647, 294));
            HScore.x = Config.w_2;
            HScore.y = Config.h - 265;
        } else {
            HScore = new cc.LabelTTF(Config.score.high + '', 'msjt', 48, cc.size(Config.w_2, 48));
            HScore.x = Config.w_2 + 200;
            HScore.y = Config.h - 240;
            HScore.setFontFillColor(cc.color(96, 96, 96));
        }

        var AScore = this.AScore = new cc.LabelTTF(score + '', 'msjt', 148, cc.size(Config.w, 148), cc.TEXT_ALIGNMENT_CENTER);
        AScore.x = Config.w_2;
        AScore.y = 815;
        AScore.setFontFillColor(cc.color(239, 178, 82));

        var TScore = this.TScore = new cc.LabelTTF(Utils.numberFmt(Config.score.total), 'msjt', 72, cc.size(Config.w_2, 72));
        TScore.x = Config.w_2 + 180;
        TScore.y = 605;

        Config.score.total = nowTotal;

        var coinLayer = new CoinLayer(1);
        coinLayer.x = (!coinLayer.achieved && (nowTotal >= Config.award[4][0])) ? -90 : 60;
        coinLayer.y = Config.h_2 - 80;

        bakeLayer.addChild(nbText);
        bakeLayer.addChild(ncoin);
        bakeLayer.addChild(HScore);
        bakeLayer.addChild(AScore);
        bakeLayer.addChild(TScore);
        bakeLayer.addChild(coinLayer);
        this.achieved = coinLayer.achieved;
    },
    onEnter: function () {
        this._super();
        var scale = cc.scaleBy(0.3, 1.5),
            scaleBack = scale.reverse();

        this.AScore.runAction(cc.sequence(scale, scaleBack, scale.clone(), scaleBack.clone(), cc.callFunc(function () {
            this.loopCount = 0;
            this.schedule(this.runTotal, 0.1);
            this.scheduleOnce(this.showTip, 1.5);
        }, this)));

    },
    runTotal: function () {
        var TScore = this.TScore,
            nowScore = Utils.fmtNumber(TScore.getString()),
            inc = Math.floor(this.score / 10),
            endScore = 0;

        if (this.loopCount < 10) {
            endScore = Utils.numberFmt(inc + nowScore);
            this.loopCount++;
        } else {
            endScore = Utils.numberFmt(Config.score.total);
            this.unschedule(this.runTotal);
        }
        TScore.setString(endScore);
    },
    showTip: function () {
        if (this.achieved) {
            Config.flowCoin += this.achieved;
            cc.eventManager.pauseTarget(this, true);
            this.addChild(new awardTip(this.achieved), 2);
            this.ncoin.setString(Config.flowCoin);
        }
    },
    onPlayagain: function () {
        var _this = this;
        switchToGame();
        /**
         * @desc bukas 2016-08-11
         */
        cc.director.runScene(new PlayScene(_this.roleid));
        // LoaderScene.ajaxLoad({
        //     url: Config.urls.start,
        //     data: {'UserId': Config.user.userId},
        //     success: function(data){
        //         if(data['msg']){
        //             alert(data['msg']);
        //             _this.onBackIndex();
        //             return ;
        //         }
        //         Utils.k = Utils.decrypt(Utils.h, data['zz']);
        //         cc.director.runScene(new PlayScene(_this.roleid));
        //     },
        //     error: function(xhr, status, msg){
        //         alert(msg);
        //         _this.onBackIndex();
        //     }
        // });
    },
    onBackIndex: function () {
        cc.director.runScene(new cc.TransitionFade(1.2, new StartScene()));
    },
    onShare: function () {
        cc.eventManager.pauseTarget(this, true);
        this.addChild(new ShareLayer(), 1);
    }
});
var SingleEndScene = cc.Scene.extend({
    ctor: function (authorityScore, roleid) {
        this._super();
        this.score = authorityScore;
        this.roleid = roleid;
    },
    onEnter: function () {
        this._super();
        var layer = new SingleEndLayer(this.score, this.roleid);
        this.addChild(layer);
    }
});