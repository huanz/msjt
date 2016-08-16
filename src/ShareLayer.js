var ShareLayer = cc.LayerColor.extend({
    ctor: function () {
        this._super(cc.color(0, 0, 0, 200));
        var arrowSprite = new cc.Sprite('#share_arrow.png');
        arrowSprite.x = Config.w_2 + 30;
        arrowSprite.y = Config.h_2 + 40;

        this.addChild(arrowSprite);
        this.addListener();
        return true;
    },
    onCancel: function () {
        var parent = this.parent;
        cc.eventManager.resumeTarget(parent, true);
        parent.removeChild(this, true);
    },
    addListener: function () {
        var _this = this;
        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget(),
                    locationInNode = target.convertToNodeSpace(touch.getLocation()),
                    s = target.getContentSize(),
                    rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    _this.onCancel();
                    return false;
                }
                return false;
            }
        });
        cc.eventManager.addListener(touchListener, this);
    }
});
