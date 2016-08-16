var ForgetLayer = cc.LayerColor.extend({
    ctor: function () {
        this._super(cc.color(96, 96, 96));
        var back = new cc.MenuItemImage('#icon_back.png', '#icon_back_hover.png', this.onBack, this);
        back.x = 40;
        back.y = Config.h - 50;
        var submitBtn = new cc.MenuItemImage('#btn_sure.png', '#btn_sure_hover.png', this.onSubmit, this);
        submitBtn.x = Config.w_2;
        submitBtn.y = Config.h_2 + 50;

        var menu = new cc.Menu(back, submitBtn);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);
        var top = new cc.Sprite('#forget_top.png');
        top.x = Config.w_2;
        top.y = Config.h - 105;
        /***手机号***/
        var phone = this.phone = new cc.EditBox(cc.size(561, 129), new cc.Scale9Sprite('forget_input.png'));
        phone.x = Config.w_2;
        phone.y = Config.h - 330;
        phone.placeHolder = '手机号';
        this.addChild(top);
        this.addChild(phone);
        return true;
    },
    onBack: function () {
        cc.director.runScene(new LoginScene());
    },
    onSubmit: function () {
        var phone = this.phone.string.trim();
        if (!phone) {
            alert('手机号不能为空！');
            return;
        }
        if (!Config.regPhone.test(phone)) {
            alert('手机号格式不正确！');
            return;
        }
        LoaderLayer.preload(Config.urls.captcha, { 'mobile': phone }, function (data) {
            alert('验证码已发送至你的手机，请注意查收短信！');
            cc.director.runScene(new ResetScene(phone));
        }, this);
    }
});
var ForgetScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new ForgetLayer();
        this.addChild(layer);
    }
});