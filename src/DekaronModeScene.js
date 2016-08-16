var DekaronModeLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        return true;
    },
    onSingleMode: function () {
        cc.director.runScene(new cc.TransitionFade(1.2, new SingleModeScene()));
    },
    onPartyMode: function () {
        cc.director.runScene(new cc.TransitionFade(1.2, new PartyModeScene()));
    },
    onDekaronMode: function () {
        cc.director.runScene(new cc.TransitionFade(1.2, new DekaronModeScene()));
    }
});
var DekaronModeScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new DekaronModeLayer();
        this.addChild(layer);
    }
});