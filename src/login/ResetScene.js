var ResetLayer = cc.LayerColor.extend({
    count: 59,
    ctor: function (phone) {
        this._super(cc.color(96, 96, 96));
        this.phone = phone;
        var back = new cc.MenuItemImage(
            '#icon_back.png',
            '#icon_back_hover.png',
            this.onBack,
            this
        );
        back.x = 40;
        back.y = Config.h - 50;
        var submitBtn = new cc.MenuItemImage(
            '#btn_sure.png',
            '#btn_sure_hover.png',
            this.onSubmit,
            this
        );
        submitBtn.x = Config.w_2;
        submitBtn.y = Config.h_2 - 150;

        var codeBtn = this.codeBtn = new cc.MenuItemImage(
            '#reset_send.png',
            '#reset_send_hover.png',
            '#captcha_count.png',
            this.onGetCode,
            this
        );
        var codeBtnText = this.codeBtnText = new cc.LabelTTF('59', 'Arial', 32, cc.TEXT_ALIGNMENT_LEFT);
        codeBtnText.x = codeBtn.width / 2;
        codeBtnText.y = codeBtn.height / 2;
        codeBtnText.setFontFillColor(cc.color(0, 0, 0));
        //codeBtnText.setVisible(false);
        codeBtn.addChild(codeBtnText);
        codeBtn.x = Config.w_2 + 200;
        codeBtn.y = Config.h_2 + 175;
        codeBtn.setEnabled(false);

        var menu = new cc.Menu(back, submitBtn, codeBtn);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);
        var top = new cc.Sprite('#reset_top.png');
        top.x = Config.w_2;
        top.y = Config.h - 100;
        /***手机号显示****/
        var resetPhone = new cc.Sprite('#reset_phone.png');
        resetPhone.x = Config.w_2 - 130;
        resetPhone.y = Config.h - 250;
        var phoneText = new cc.LabelTTF(phone, 'Arial', 40, cc.TEXT_ALIGNMENT_LEFT);
        phoneText.setFontFillColor(cc.color(248, 182, 45));
        phoneText.x = resetPhone.width / 2;
        phoneText.y = resetPhone.height / 2;
        resetPhone.addChild(phoneText);

        /***验证码输入框*****/
        var code = this.code = new cc.EditBox(cc.size(364, 85), new cc.Scale9Sprite('reset_sms.png'));
        code.x = Config.w_2 - 80;
        code.y = Config.h_2 + 180;
        code.placeHolder = '短信验证码';

        /**新密码输入框****/
        var password = this.password = new cc.EditBox(cc.size(560, 93), new cc.Scale9Sprite('reset_pass.png'));
        password.x = Config.w_2 + 20;
        password.y = Config.h_2 + 60;
        password.placeHolder = '新密码';
        password.inputFlag = cc.EDITBOX_INPUT_FLAG_PASSWORD;

        this.addChild(top);
        this.addChild(resetPhone);
        this.addChild(code);
        this.addChild(password);
        this.schedule(this.captchaCount, 1.0);
        var loaderLayer = new LoaderLayer();
        this.addChild(loaderLayer);
        return true;
    },
    onBack: function () {
        cc.director.runScene(new ForgetScene());
    },
    onGetCode: function () {
        var _this = this;
        Utils.post(Config.urls.captcha, { 'mobile': this.phone }, function (data) {
            if (data['result'] == 0) {
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
    onSubmit: function () {
        var phone = this.phone,
            code = this.code.string.trim(),
            pass = this.password.string.trim();
        if (!code || !pass) {
            alert('验证码或密码不能为空！');
            return;
        }
        LoaderLayer.preload(Config.urls.reset, { 'usertelnum': phone, 'password': pass, 'captcha': code }, function (data) {
            alert('密码重置成功！');
            cc.director.runScene(new LoginScene());
        }, this);
    }
});
var ResetScene = cc.Scene.extend({
    ctor: function (phone) {
        this._super();
        this.phone = phone;
    },
    onEnter: function () {
        this._super();
        var layer = new ResetLayer(this.phone);
        this.addChild(layer);
    }
});