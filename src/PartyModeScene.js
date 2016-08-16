var PartyModeLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        var bgSprite = new BGSprite(res.party_menu_bg_png);
        var back = new cc.Menu(new cc.MenuItemSprite(
            new cc.Sprite('#icon_back.png'),
            new cc.Sprite('#icon_back_hover.png'),
            this.onBack,
            this
        ));
        back.x = 40;
        back.y = Config.h - 50;
        var playBtn = new cc.MenuItemSprite(
            new cc.Sprite('#btn_start.png'),
            new cc.Sprite('#btn_start_hover.png'),
            new cc.Sprite('#btn_start_disabled.png'),
            this.onPlay,
            this
        );
        var menu = new cc.Menu(playBtn);
        menu.x = Config.w_2;
        menu.y = 200;
        this.addChild(bgSprite);
        this.addChild(menu);
        this.addDesc();
        this.addChoose();
        this.addText();
        this.addChild(back);
        return true;
    },
    addDesc: function () {
        var party_number = new cc.Sprite('res/party_menu_icon.png', cc.rect(0, 486, 184, 94));
        party_number.x = Config.w_2 - 180;
        party_number.y = Config.h_2 + 280;
        var party_time = new cc.Sprite('res/party_menu_icon.png', cc.rect(0, 384, 213, 100));
        party_time.x = Config.w_2 + 180;
        party_time.y = Config.h_2 + 280;
        var party_number_box = new cc.Sprite('res/party_menu_icon.png', cc.rect(0, 0, 240, 188));
        party_number_box.x = Config.w_2 - 180;
        party_number_box.y = Config.h_2 + 50;
        var party_time_box = new cc.Sprite('res/party_menu_icon.png', cc.rect(0, 190, 235, 192));
        party_time_box.x = Config.w_2 + 180;
        party_time_box.y = Config.h_2 + 50;
        this.addChild(party_number);
        this.addChild(party_number_box);
        this.addChild(party_time);
        this.addChild(party_time_box);
    },
    addChoose: function () {
        var number_up_Btn = this.number_up_Btn = new cc.MenuItemSprite(
            new cc.Sprite('#icon_left.png'),
            new cc.Sprite('#icon_left_hover.png'),
            new cc.Sprite('#icon_left_disabled.png'),
            this.onNumberUp,
            this
        );
        var number_down_Btn = this.number_down_Btn = new cc.MenuItemSprite(
            new cc.Sprite('#icon_left.png'),
            new cc.Sprite('#icon_left_hover.png'),
            new cc.Sprite('#icon_left_disabled.png'),
            this.onNumberDown,
            this
        );
        number_down_Btn.setEnabled(false);
        var time_up_Btn = this.time_up_Btn = new cc.MenuItemSprite(
            new cc.Sprite('#icon_left.png'),
            new cc.Sprite('#icon_left_hover.png'),
            new cc.Sprite('#icon_left_disabled.png'),
            this.onTimeUp,
            this
        );
        var time_down_Btn = this.time_down_Btn = new cc.MenuItemSprite(
            new cc.Sprite('#icon_left.png'),
            new cc.Sprite('#icon_left_hover.png'),
            new cc.Sprite('#icon_left_disabled.png'),
            this.onTimeDown,
            this
        );
        var controlNumberBtn = new cc.Menu(number_up_Btn, number_down_Btn);
        controlNumberBtn.x = Config.w_2 - 180;
        controlNumberBtn.y = Config.h_2 + 50;
        controlNumberBtn.alignItemsVerticallyWithPadding(200);

        var controlTimeBtn = new cc.Menu(time_up_Btn, time_down_Btn);
        controlTimeBtn.x = Config.w_2 + 180;
        controlTimeBtn.y = Config.h_2 + 50;
        controlTimeBtn.alignItemsVerticallyWithPadding(200);
        this.addChild(controlNumberBtn);
        this.addChild(controlTimeBtn);
    },
    onNumberUp: function () {
        //        this.number_down_Btn.setEnabled(true);
        //        var number = parseInt(this.numberLabel.getString());
        //        if( number < 19){
        //            this.numberLabel.setString(number+1);
        //            if(this.numberLabel.getString() == 20){
        //               this.number_up_Btn.setEnabled(false);
        //            }
        //        }
    },
    onNumberDown: function () {
        this.number_up_Btn.setEnabled(true);
        var number = parseInt(this.numberLabel.getString());
        if (number > 2) {
            this.numberLabel.setString(number - 1);
        } else {
            this.number_down_Btn.setEnabled(false);
        }
    },
    addText: function () {
        var numberLabel = this.numberLabel = new cc.LabelTTF('2', 'msjt', 120, cc.size(0, 120));
        numberLabel.x = Config.w_2 - 180;
        numberLabel.y = Config.h_2 + 50;
        numberLabel.setFontFillColor(cc.color(238, 178, 82));

        var timeLabel = this.timeLabel = new cc.LabelTTF('10', 'msjt', 120, cc.size(0, 120));
        timeLabel.x = Config.w_2 + 180;
        timeLabel.y = Config.h_2 + 50;
        timeLabel.setFontFillColor(cc.color(238, 178, 82));

        this.addChild(numberLabel);
        this.addChild(timeLabel);
    }
});
var PartyModeScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new PartyModeLayer();
        this.addChild(layer);
    }
});