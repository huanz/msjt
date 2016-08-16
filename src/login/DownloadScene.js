var DownLoadLayer = cc.LayerColor.extend({
    ctor: function (phone) {
        this._super(cc.color(96, 96, 96));
        var coin = Config.UserGetCoin;
        Config.UserGetCoin = 0;
        var back = new cc.MenuItemImage(
            '#icon_back.png',
            '#icon_back_hover.png',
            this.onBack,
            this
        );
        back.x = 40;
        back.y = Config.h - 50;
        var downloadBtn = new cc.MenuItemImage(
            '#btn_down.png',
            '#btn_down_hover.png',
            this.onDownload,
            this
        );
        downloadBtn.x = 180;
        downloadBtn.y = 120;

        var backHomeBtn = new cc.MenuItemImage(
            '#btn_goindex.png',
            '#btn_goindex_hover.png',
            this.onBackHome,
            this
        );
        backHomeBtn.x = Config.w - 180;
        backHomeBtn.y = 120;
        var menu = new cc.Menu(back, downloadBtn, backHomeBtn);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);
        var top = new cc.Sprite('#download_top.png');
        top.x = Config.w_2;
        top.y = Config.h - 312;
        var coinNum = new cc.LabelTTF(coin, 'msjt', 300, cc.size(Config.w, 300), cc.TEXT_ALIGNMENT_CENTER);
        coinNum.x = 250;
        coinNum.y = Config.h - 220;
        coinNum.setFontFillColor(cc.color(248, 182, 45));

        var flowCoin = new cc.LabelTTF('流量币', 'msjt', 60, cc.size(Config.w, 60));
        flowCoin.x = Config.w;
        flowCoin.y = Config.h - 280;
        flowCoin.setFontFillColor(cc.color(0, 0, 0));

        var phoneText = new cc.LabelTTF(phone + '', 'Arial', 40, cc.TEXT_ALIGNMENT_LEFT);
        phoneText.setFontFillColor(cc.color(248, 182, 45));
        phoneText.x = Config.w_2;
        phoneText.y = Config.h_2 + 75;

        var downloadText1 = new cc.LabelTTF('下载流量宝去上网吧！', 'msjt', 50, cc.size(Config.w, 50));
        downloadText1.x = Config.w_2 + 100;
        downloadText1.y = Config.h_2 - 150;
        downloadText1.setFontFillColor(cc.color(0, 0, 0, 255));

        var downloadText2 = new cc.LabelTTF('可以免费wifi上网' + (coin * 10) + '分钟咯！', 'msjt', 30, cc.size(Config.w, 30));
        downloadText2.x = Config.w_2 + 150;
        downloadText2.y = Config.h_2 - 200;
        downloadText2.setFontFillColor(cc.color(50, 50, 50, 255));

        this.addChild(top);
        this.addChild(coinNum);
        this.addChild(flowCoin);
        this.addChild(phoneText);
        this.addChild(downloadText1);
        this.addChild(downloadText2);

        return true;
    },
    onEnter: function () {
        this._super();
        var maskLayer = new cc.LayerColor(cc.color(0, 0, 0, 180));
        var tip = new cc.Sprite('#achieve_tip.png');
        tip.x = Config.w_2;
        tip.y = 3 * Config.h_2;

        this.addChild(maskLayer, 2);
        maskLayer.addChild(tip);
        tip.runAction(cc.sequence(cc.moveBy(0.5, cc.p(0, -Config.h)).easing(cc.easeOut(0.5)), cc.delayTime(0.5), cc.callFunc(function () {
            this.removeChild(maskLayer, true);
        }, this)));

    },
    onBack: function () {
        cc.director.runScene(new LoginScene());
    },
    onBackHome: function () {
        cc.director.runScene(new StartScene());
    },
    onDownload: function () {
        var os = cc.sys.os,
            url = '';
        if (os == 'Android') {
            url = Config.downURL[0];
        } else if (os == 'iOS') {
            url = Config.downURL[1];
        } else {
            url = Config.downURL[2];
        }
        window.open(url, '_blank');
    }
});
var DownLoadScene = cc.Scene.extend({
    ctor: function (phone) {
        this._super();
        this.phone = phone;
    },
    onEnter: function () {
        this._super();
        var layer = new DownLoadLayer(this.phone);
        this.addChild(layer);
    },
    onExit: function () {
        this._super();
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.login_plist);
        cc.view.resizeWithBrowserSize(true);
    }
});