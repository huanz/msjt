var BGSprite = cc.Sprite.extend({
    ctor: function (res) {
        this._super(res);
        this.attr({
            x: Config.w_2,
            y: Config.h_2
        });
    }
});