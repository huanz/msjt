var LoginLayer = cc.LayerColor.extend({
    ctor: function () {
        this._super(cc.color(96, 96, 96));
        var coin = Config.UserGetCoin;
        var back = new cc.MenuItemImage(
            '#icon_back.png',
            '#icon_back_hover.png',
            this.onBack,
            this
        );
        back.x = 40;
        back.y = Config.h - 50;

        var login = new cc.MenuItemImage(
            '#btn_login.png',
            '#btn_login_hover.png',
            this.onLogin,
            this
        );
        login.x = Config.w_2;
        login.y = 350;

        var register = new cc.MenuItemImage(
            '#register.png',
            '#register_hover.png',
            this.onRegister,
            this
        );
        register.x = 150;
        register.y = 40;

        var forget = new cc.MenuItemImage(
            '#forget.png',
            '#forget_hover.png',
            this.onForget,
            this
        );
        forget.x = Config.w - 110;
        forget.y = 40;

        var menu = new cc.Menu(back, login, register, forget);
        menu.x = 0;
        menu.y = 0;

        this.addChild(menu, 1);

        var bakeLayer = new cc.Layer();
        //bakeLayer.bake();
        this.addChild(bakeLayer);

        var top = new cc.Sprite('#login_top.png');
        top.x = Config.w_2;
        top.y = Config.h - 179;

        var coinNum = new cc.LabelTTF(coin + '', 'msjt', 200, cc.size(400, 200), cc.TEXT_ALIGNMENT_CENTER);
        coinNum.x = 200;
        coinNum.y = Config.h - 150;
        coinNum.setFontFillColor(cc.color(248, 182, 45));

        var flowCoin = new cc.LabelTTF('流量币', 'msjt', 40, cc.size(120, 40));
        flowCoin.x = 320;
        flowCoin.y = Config.h - 185;
        flowCoin.setFontFillColor(cc.color(0, 0, 0));

        var tipText = new cc.LabelTTF('送您免费wifi上网' + (coin * 10) + '分钟!怎能错过！', 'msjt', 32, cc.size(185, 140));
        tipText.x = Config.w - 150;
        tipText.y = Config.h - 185;
        tipText.setFontFillColor(cc.color(248, 182, 45));

        var tyCount = new cc.LabelTTF('天翼帐号', 'msjt', 48, cc.size(200, 48));
        tyCount.x = 150;
        tyCount.y = 660;
        tyCount.setFontFillColor(cc.color(0, 0, 0));

        var tyPass = new cc.LabelTTF('天翼密码', 'msjt', 48, cc.size(200, 48));
        tyPass.x = 150;
        tyPass.y = 520;
        tyPass.setFontFillColor(cc.color(0, 0, 0));

        bakeLayer.addChild(top);
        bakeLayer.addChild(coinNum);
        bakeLayer.addChild(flowCoin);
        bakeLayer.addChild(tipText);
        bakeLayer.addChild(tyCount);
        bakeLayer.addChild(tyPass);
        this.addInput();
        return true;
    },
    addInput: function () {

        var account = this.account = new cc.EditBox(cc.size(411, 114), new cc.Scale9Sprite('login_user.png'));
        account.placeHolder = '手机号 / 邮箱 / 用户名 / 易信帐号';
        account.x = 460;
        account.y = 680;

        var pass = this.pass = new cc.EditBox(cc.size(408, 124), new cc.Scale9Sprite('login_pass.png'));
        pass.placeHolder = '请输入登录密码';
        pass.x = 460;
        pass.y = 540;
        pass.inputFlag = cc.EDITBOX_INPUT_FLAG_PASSWORD;

        this.addChild(account);
        this.addChild(pass);
    },
    onLogin: function () {
        var user = this.account.string,
            pass = this.pass.string;

        if (!user || !pass) {
            alert('帐号或密码不能为空！');
            return;
        }
        LoaderLayer.preload(Config.urls.login, { 'Account': user, 'Password': pass }, function (data) {
            Config.zhpt_account = data['list']['userName'];
            Config.flowCoin = data['list']['coinNum'];
            Config.isLogin = true;
            cc.director.runScene(new DownLoadScene(Config.zhpt_account));
        }, this);
    },
    onRegister: function () {
        cc.director.runScene(new RegisterScene());
    },
    onForget: function () {
        cc.director.runScene(new ForgetScene());
    },
    onBack: function () {
        cc.director.runScene(new AccountScene());
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.login_plist);
    }
});

var LoginScene = cc.Scene.extend({
    ctor: function () {
        cc.view.resizeWithBrowserSize(false);
        this._super();
    },
    onEnter: function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.login_plist, res.login_png);
        var layer = new LoginLayer();
        this.addChild(layer);
    }
});