var RoleSprite = cc.Sprite.extend({
    index: 0,
    ctor: function (res) {
        this._super(res);
    },
    onEnter: function () {
        this._super();
        this.addTouchEventListenser();
        this.playLayer = this.parent.parent;
    },
    addTouchEventListenser: function () {
        var _this = this;
        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var pos = touch.getLocation();
                var target = event.getCurrentTarget();
                var boundingBox = target.getBoundingBoxToWorld();
                boundingBox.width += 100;
                boundingBox.height += 60;
                boundingBox.x -= 50;
                boundingBox.y -= 30;
                if (cc.rectContainsPoint(boundingBox, pos)) {
                    _this.initLine();
                    //开宝箱
                    if (target.type === 'chest') {
                        _this.playLayer.openIndex++;
                        _this.openChest();
                        return false;
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved: function (touch) {
                _this.endPoint = _this.parent.convertToNodeSpace(touch.getLocation());
                _this.getBoundingBoxToWorld().y <= 0 ? _this.removeLine() : _this.drawLine();
            },
            onTouchEnded: function (touch) {
                _this.removeLine();
                var targetPosition = touch.getLocation();
                var isLinkCorrect = false;
                var roleLayer1 = _this.playLayer.roleLayer1;
                var roleLayer2 = _this.playLayer.roleLayer2;
                var allSprites = roleLayer1.children.concat(roleLayer2.children);
                for (var i = 0; i < allSprites.length; i++) {
                    var boundingBox = allSprites[i].getBoundingBoxToWorld();
                    boundingBox.width += 100;
                    boundingBox.height += 60;
                    boundingBox.x -= 50;
                    boundingBox.y -= 30;
                    if (cc.rectContainsPoint(boundingBox, targetPosition)) {
                        //判断连接组合是否正确
                        var tempArray = [_this.type, allSprites[i].type];
                        tempArray.sort().toString() === _this.playLayer.selectedGroup.groupConent.sort().toString() ? isLinkCorrect = true : isLinkCorrect = false;
                        //连接正确，而且不在同一列
                        if (isLinkCorrect && allSprites[i].x != _this.x) {
                            var thisPosition = _this.getBoundingBoxToWorld();
                            var otherPosition = allSprites[i].getBoundingBoxToWorld();
                            _this.disappearAction(_this);
                            _this.disappearAction(allSprites[i]);
                            _this.playLayer.linkCorrect(thisPosition, otherPosition);
                            break;
                        }
                        //连接不对而且起点和终点不是同个角色
                        if (!isLinkCorrect && allSprites[i] != _this) {
                            _this.playLayer.linkError();
                            break;
                        }
                    }
                }

            }
        });
        cc.eventManager.addListener(touchListener, this);
    },
    initLine: function () {
        this.line = new cc.DrawNode();
        this.addChild(this.line, -1);
    },
    removeLine: function () {
        this.removeChild(this.line);
        this.unschedule(this.resetDrawLine);
    },
    drawLine: function () {
        this.clearLine();
        var x = this.getPosition().x - this.width / 2;
        var y = this.getPosition().y - this.height / 2;
        var endPoint = this.endPoint;
        this.line.drawSegment(
            cc.p(this.width / 2, this.height / 2),
            cc.p(endPoint.x - x, endPoint.y - y),
            8,
            cc.color(0, 0, 0, 255)
        );
        this.schedule(this.resetDrawLine, 0);
    },
    resetDrawLine: function () {
        if (this.getBoundingBoxToWorld().y <= 0) {
            this.removeLine();
        } else {
            this.endPoint.y += this.playLayer.speed;
            this.drawLine();
        }
    },
    clearLine: function () {
        this.line.clear();
        this.unschedule(this.resetDrawLine);
    },
    disappearAction: function (_this) {
        var frames = [];
        for (var i = 1; i < 13; i++) {
            frames.push(cc.spriteFrameCache.getSpriteFrame(_this.type + i + '.png'));
        }
        var animation = new cc.Animation(frames, 0.03);
        var aniAction = new cc.Animate(animation);
        var action = cc.sequence(aniAction, cc.callFunc(function () {
            _this.removeAllChildren();
            _this.removeFromParent(true);
        }, this));
        _this.runAction(action);
    },
    openChest: function () {
        var chestCap = this.getChildByName('chestCap');
        var property = this.getChildByName('chestProperty');
        var lights = new cc.Sprite('#icon_lights.png');
        lights.x = 15;
        lights.y = 150;
        this.addChild(lights, 1);
        chestCap.runAction(cc.spawn(cc.moveTo(0.2, cc.p(chestCap.x, chestCap.y + 40)), cc.fadeOut(1)));
        property.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.spawn(cc.scaleTo(0.5, 0.5, 0.5), cc.moveTo(0.5, cc.p(property.x, property.y + 80))),
            cc.callFunc(function () {
                var property_c = new cc.Sprite('#icon_chest_' + property.type + '.png');
                var boundingBoxToWorld = property.getBoundingBoxToWorld();
                property_c.x = boundingBoxToWorld.x + 50;
                property_c.y = boundingBoxToWorld.y + 50;
                property_c.scale = 0.5;
                this.playLayer.addChild(property_c, 9);
                this.removeFromParent(true);
                switch (property.type) {
                    case 'bomb':
                        this.bombAction(property_c); break;
                    case 'clear':
                        this.clearAction(property_c); break;
                    default:
                        this.propertyAction(property_c); break;
                }
            }, this)
        ));
    },
    //炸弹的动画
    bombAction: function (property_c) {
        property_c.runAction(
            cc.sequence(
                cc.moveTo(0.2, Config.w_2, Config.h_2),
                cc.scaleTo(0.1, 1, 1),
                cc.scaleTo(0.1, 0.8, 0.8),
                cc.scaleTo(0.1, 1, 1), cc.callFunc(function () {
                    property_c.removeFromParent(true);
                    var smokeSprite = new cc.Sprite();
                    var smoke1 = new cc.Sprite(res.property_smoke_png, cc.rect(2, 2, 349, 276));
                    var smoke2 = new cc.Sprite(res.property_smoke_png, cc.rect(2, 280, 373, 296));
                    var smoke3 = new cc.Sprite(res.property_smoke_png, cc.rect(2, 578, 388, 293));
                    var smoke4 = new cc.Sprite(res.property_smoke_png, cc.rect(2, 873, 364, 250));
                    smokeSprite.x = Config.w_2;
                    smokeSprite.y = Config.h_2 + 100;
                    smokeSprite.scale = 0.4;
                    smokeWidth = smokeSprite.width;
                    smokeHeight = smokeSprite.height;
                    smoke1.x = smokeWidth / 2 - 70;
                    smoke1.y = smokeHeight / 2 + 50;
                    smoke2.x = smokeWidth / 2 + 150;
                    smoke2.y = smokeHeight / 2;
                    smoke3.x = smokeWidth / 2 - 140;
                    smoke3.y = smokeHeight / 2 - 100;
                    smoke4.x = smokeWidth / 2 + 20;
                    smoke4.y = smokeHeight / 2 - 150;
                    var smokeArr = [smoke1, smoke2, smoke3, smoke4];
                    for (var i = 0; i < smokeArr.length; i++) {
                        smokeSprite.addChild(smokeArr[i]);
                    }
                    smokeSprite.runAction(cc.sequence(
                        cc.scaleTo(0.1, 1), cc.delayTime(4),
                        cc.callFunc(function () {
                            smokeSprite.removeFromParent(true);
                        })
                    ));
                    smoke1.runAction(cc.spawn(cc.scaleBy(0.6, 2.4), cc.fadeOut(3)));
                    smoke2.runAction(cc.spawn(cc.scaleBy(0.7, 2.4), cc.fadeOut(3)));
                    smoke3.runAction(cc.spawn(cc.scaleBy(0.6, 2.4), cc.fadeOut(3)));
                    smoke4.runAction(cc.spawn(cc.scaleBy(0.5, 2.4), cc.fadeOut(3)));
                    this.playLayer.addChild(smokeSprite, 4);
                }, this)
            )
        );
    },
    //清屏的动画
    clearAction: function (property_c) {
        property_c.runAction(cc.sequence(
            cc.moveTo(0.2, Config.w_2, 150).easing(cc.easeSineIn()),
            cc.scaleTo(0.1, 1.2),
            cc.scaleTo(0.1, 1),
            cc.rotateTo(0.1, 10),
            cc.rotateTo(0.1, -10),
            cc.rotateTo(0.1, 0),
            cc.callFunc(function () {
                //开始清屏
                this.playLayer.speed = this.playLayer.speed * 2;
                this.playLayer.autoPlay = true;
                var smokeSprite = new cc.Sprite();
                var smoke1 = new cc.Sprite(res.property_smoke_png, cc.rect(2, 1125, 349, 276));
                var smoke2 = new cc.Sprite(res.property_smoke_png, cc.rect(2, 1403, 388, 293));
                var smoke3 = new cc.Sprite(res.property_smoke_png, cc.rect(2, 1698, 364, 250));
                var smoke4 = new cc.Sprite(res.property_smoke_png, cc.rect(2, 1950, 373, 296));
                smokeSprite.x = Config.w_2;
                smokeSprite.y = 300;
                smokeSprite.scale = 0.6;
                smokeSprite.opacity = 0.5;
                smokeWidth = smokeSprite.width;
                smokeHeight = smokeSprite.height;
                smoke1.x = smokeWidth / 2 - 70;
                smoke1.y = smokeHeight / 2 + 50;
                smoke2.x = smokeWidth / 2 + 150;
                smoke2.y = smokeHeight / 2;
                smoke3.x = smokeWidth / 2 - 140;
                smoke3.y = smokeHeight / 2 - 100;
                smoke4.x = smokeWidth / 2 + 20;
                smoke4.y = smokeHeight / 2 - 150;
                var smokeArr = [smoke1, smoke2, smoke3, smoke4];
                for (var i = 0; i < smokeArr.length; i++) {
                    smokeSprite.addChild(smokeArr[i]);
                }
                smoke1.runAction(cc.spawn(cc.scaleBy(Config.CLEAR_NUM + 1, 4), cc.fadeOut(Config.CLEAR_NUM + 1)));
                smoke2.runAction(cc.spawn(cc.scaleBy(Config.CLEAR_NUM + 1, 4), cc.fadeOut(Config.CLEAR_NUM + 1)));
                smoke3.runAction(cc.spawn(cc.scaleBy(Config.CLEAR_NUM + 1, 4), cc.fadeOut(Config.CLEAR_NUM + 1)));
                smoke4.runAction(cc.spawn(cc.scaleBy(Config.CLEAR_NUM + 1, 4), cc.fadeOut(Config.CLEAR_NUM + 1)));
                smokeSprite.runAction(cc.sequence(cc.moveTo(2, cc.p(smokeSprite.x, smokeSprite.y + 20)), cc.delayTime(Config.CLEAR_NUM + 1 - 2), cc.callFunc(function () {
                    smokeSprite.removeFromParent(true);
                    property_c.runAction(cc.fadeOut(0.3), cc.callFunc(function () { property_c.removeFromParent(true) }));
                }, this)));
                this.playLayer.addChild(smokeSprite, 10);
            }, this)
        ));
    },
    //普通道具的动画
    propertyAction: function (property_c) {
        property_c.runAction(
            cc.spawn(
                cc.moveTo(0.2, Config.w_2, Config.h_2 + 100),
                cc.scaleTo(0.2, 1),
                cc.callFunc(function () {
                    var addScoreSprite = new cc.LabelTTF('+' + Config.PROPERTY_SCORE, 'Arial', 60);
                    addScoreSprite.setColor(this.playLayer.selectedGroup.cr);
                    addScoreSprite.x = property_c.width + 40;
                    addScoreSprite.y = property_c.height;
                    property_c.runAction(cc.sequence(cc.delayTime(0.4), cc.blink(2, 3), cc.callFunc(function () {
                        property_c.removeFromParent(true);
                        this.playLayer.addScore(Config.PROPERTY_SCORE);
                    }, this)));
                    property_c.addChild(addScoreSprite);
                }, this)
            )
        );
    }
});