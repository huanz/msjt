var RegisterLayer = cc.LayerColor.extend({
    count: 59,
    ctor: function () {
        this._super(cc.color(96, 96, 96));
        var back = new cc.MenuItemImage(
            '#icon_left.png',
            '#icon_left_hover.png',
            this.onBack,
            this
        );
        back.x = 40;
        back.y = Config.h - 50;
        var registerBtn = new cc.MenuItemImage(
            '#btn_register.png',
            '#btn_register_hover.png',
            this.onRegister,
            this
        );
        registerBtn.x = Config.w_2;
        registerBtn.y = Config.h_2 - 150;

        var codeBtn = this.codeBtn = new cc.MenuItemImage(
            '#register_get.png',
            '#register_get_hover.png',
            '#captcha_count.png',
            this.onGetCode,
            this
        );
        var codeBtnText = this.codeBtnText = new cc.LabelTTF('59', 'Arial', 32, cc.TEXT_ALIGNMENT_LEFT);
        codeBtnText.x = codeBtn.width / 2;
        codeBtnText.y = codeBtn.height / 2;
        codeBtnText.setFontFillColor(cc.color(0, 0, 0));
        codeBtnText.setVisible(false);
        codeBtn.addChild(codeBtnText);
        codeBtn.x = Config.w_2 + 180;
        codeBtn.y = Config.h_2 - 10;

        var menu = new cc.Menu(back, registerBtn, codeBtn);
        menu.x = 0;
        menu.y = 0;

        var top = new cc.Sprite('#register_top.png');
        top.x = Config.w_2;
        top.y = Config.h - 130;

        var phone = this.phone = new cc.EditBox(cc.size(561, 85), new cc.Scale9Sprite('register_phone.png'));
        phone.x = Config.w_2;
        phone.y = Config.h - 330;
        phone.placeHolder = '手机号';


        var password = this.password = new cc.EditBox(cc.size(560, 90), new cc.Scale9Sprite('register_pass.png'));
        password.x = Config.w_2;
        password.y = Config.h - 450;
        password.placeHolder = '密码';
        password.inputFlag = cc.EDITBOX_INPUT_FLAG_PASSWORD;

        var code = this.code = new cc.EditBox(cc.size(364, 89), new cc.Scale9Sprite('register_code.png'));
        code.x = Config.w_2 - 95;
        code.y = Config.h_2;
        code.placeHolder = '验证码';

        this.addChild(top);
        this.addChild(phone);
        this.addChild(password);
        this.addChild(code);
        this.addChild(menu);
        return true;
    },
    onBack: function () {
        cc.director.runScene(new LoginScene());
    },
    onGetCode: function () {
        var _this = this,
            phone = _this.phone.string.trim();
        if (!phone) {
            alert('请输入手机号！');
            return;
        }
        if (!Config.regPhone.test(phone)) {
            alert('手机号格式不正确！');
            return;
        }
        Utils.post(Config.urls.captcha, { 'mobile': phone }, function (data) {
            if (data['result'] == 0) {
                //_this.codeBtn.setNormalImage("#reset_send.png");
                //_this.codeBtn.setSelectedImage("#reset_send_hover.png");
                //alert('验证码已发送至你的手机，请注意查收短信！');
                _this.codeBtn.setEnabled(false);
                _this.codeBtnText.setVisible(true);
                _this.schedule(_this.captchaCount, 1.0);

            } else {
                alert(data['list']['msg']);
            }
        });
    },
    captchaCount: function () {
        this.count--;
        if (this.count <= 0) {
            this.count = 59;
            this.unschedule(this.captchaCount);
            this.codeBtnText.setVisible(false)
            this.codeBtn.setEnabled(true);
        }
        this.codeBtnText.setString(this.count);
    },
    onRegister: function () {
        var phone = this.phone.string.trim(),
            pass = this.password.string.trim(),
            code = this.code.string.trim();
        if (!phone || !pass) {
            alert('手机号或密码不能为空！');
            return;
        }
        if (!code) {
            alert('验证码不能为空！');
            return;
        }
        if (!Config.regPhone.test(phone)) {
            alert('手机号格式不正确！');
            return;
        }
        LoaderLayer.preload(Config.urls.register, { 'usertelnum': phone, 'password': pass, 'captcha': code }, function (data) {
            Config.zhpt_account = phone;
            Config.isLogin = true;
            cc.director.runScene(new DownLoadScene(phone));
        }, this);
    }
});
var RegisterScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new RegisterLayer();
        this.addChild(layer);
    }
});