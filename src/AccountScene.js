var AccountLayer = cc.LayerColor.extend({
    ctor: function () {
        this._super(cc.color(96, 96, 96));

        var bgSprite = new BGSprite(res.accountBG_png);

        var back = new cc.MenuItemImage(
            '#icon_left.png',
            '#icon_back_hover.png',
            this.onBack,
            this
        );
        back.x = 40;
        back.y = Config.h - 50;

        var shareBtn = new cc.MenuItemImage(
            '#icon_share_black.png',
            '#icon_share_hover.png',
            this.onShare,
            this
        );
        shareBtn.x = Config.w - 50;
        shareBtn.y = Config.h - 50;

        var menu = new cc.Menu(back, shareBtn);
        menu.x = 0;
        menu.y = 0;

        //Microsoft YaHei Arial
        var userName = new cc.LabelTTF(Config.user.name, 'Microsoft YaHei', 28, cc.size(280, 40));
        userName.setFontFillColor(cc.color(96, 96, 96));
        userName.x = Config.w_2 + 160;
        userName.y = Config.h_2 + 280;

        var _this = this;
        cc.loader.loadImg(Config.user.avatar, function (err, img) {
            if (err) img = res.default_png;
            var avatar = new cc.Sprite(img);
            avatar.scale = 190 / avatar.width;
            avatar.x = 209;
            avatar.y = 755;
            _this.addChild(avatar);
        });

        var accountNiu = new cc.LabelTTF(Config.flowCoin + '', 'msjt', 60, cc.size(280, 60));
        accountNiu.setFontFillColor(cc.color(181, 181, 181));
        accountNiu.x = Config.w - 5;
        accountNiu.y = 785;

        var totalScore = new cc.LabelTTF(Config.score.total + '', 'msjt', 60, cc.size(280, 60));
        totalScore.setFontFillColor(cc.color(181, 181, 181));
        totalScore.x = 610;
        totalScore.y = 725;

        var coinLayer = new CoinLayer(0);
        coinLayer.x = 90;
        coinLayer.y = Config.h_2 - 90;

        var exCoin = null, txt = '';
        if (Config.isLogin) {
            txt = '帐号流量币数:';
        } else {
            txt = '可领取流量币:';
            if (Config.flowCoin > 0) {
                exMenu = new cc.Menu(new cc.MenuItemSprite(
                    new cc.Sprite(res.btnEx_png, cc.rect(2, 2, 295, 99)),
                    new cc.Sprite(res.btnEx_png, cc.rect(299, 2, 295, 99)),
                    this.onExchange,
                    this
                ));
                exMenu.x = Config.w_2;
                exMenu.y = 165;
                this.addChild(exMenu, 2);
            }
        }
        exCoin = new cc.LabelTTF(txt, 'msjt', 36, cc.size(Config.w, 60));
        exCoin.setFontFillColor(cc.color(181, 181, 181));
        exCoin.x = Config.w - 20;
        exCoin.y = 770;
        this.addChild(exCoin, 2);


        /*var exCoin = null, txt = '', exMenu = null;
        if(coinLayer.achieved || Config.owned){
            if(coinLayer.achieved){
                txt = '可兑换流量币数: '+coinLayer.achieved;
                exMenu = new cc.Menu(new cc.MenuItemSprite(
                    new cc.Sprite(res.btnEx_png, cc.rect(2,2,295,99)),
                    new cc.Sprite(res.btnEx_png, cc.rect(299,2,295,99)),
                    this.onExchange,
                    this
                ));
                exMenu.x = Config.w_2;
                exMenu.y = 165;
                this.addChild(exMenu, 1);
            }else{
                txt = '已兑换流量币数: '+Config.owned;
            }
            exCoin = new cc.LabelTTF(txt, 'msjt', 36, cc.size(Config.w, 60));
            exCoin.x = Config.w_2 + 90;
            exCoin.y = 540;
            this.addChild(exCoin, 2);
        }*/

        this.addChild(bgSprite, 1);
        this.addChild(menu, 1);
        this.addChild(userName, 1);
        this.addChild(accountNiu, 1);
        this.addChild(totalScore, 1);
        this.addChild(coinLayer, 1);
        return true;
    },
    onSingleMode: function () {
        cc.director.runScene(new cc.TransitionFade(1.2, new SingleModeScene()));
    },
    onBack: function () {
        cc.director.runScene(new cc.TransitionFade(1.2, new StartScene()));
    },
    onShare: function () {
        cc.eventManager.pauseTarget(this, true);
        this.addChild(new ShareLayer(), 3);
    },
    onExchange: function () {
        Config.UserGetCoin = Config.flowCoin;
        LoaderScene.preload(res.login_png, function () {
            cc.director.runScene(new LoginScene());
        });
    }
});
var AccountScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new AccountLayer();
        layer.bake();
        this.addChild(layer);
    }
});