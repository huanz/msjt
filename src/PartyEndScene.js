var PartyEndLayer = cc.Layer.extend({
    ctor: function (score, roleid) {
        this._super();
        return true;
    },
    setPlayBtn: function () {

    },
    onPlayagain: function () {
        cc.director.runScene(new cc.TransitionFade(1.2, new PlayScene(this.roleid)));
    },
    onBackIndex: function () {
        cc.director.runScene(new cc.TransitionFade(1.2, new StartScene()));
    },
    onShare: function () {
        cc.eventManager.pauseTarget(this, true);
        this.addChild(new ShareLayer(), 1);
    }
});
var PartyEndScene = cc.Scene.extend({
    ctor: function () {
        this._super();
    },
    onEnter: function () {
        this._super();
        var layer = new PartyEndLayer();
        this.addChild(layer);
    }
});