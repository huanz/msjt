var RoleLayer = cc.Layer.extend({
    openIndex: 0,
    ctor: function (selectedRole) {
        this._super();
        this.selectedRole = selectedRole;
        this.initRole();
        this.initRemainRole();
        this.initLayer();
    },
    initLayer: function (scrollIndex) {
        this.scrollIndex = scrollIndex;
        this.arrLeft = [[180, 1135 / 5], [180, 1135 * 2 / 5], [180, 1135 * 3 / 5], [180, 1135 * 4 / 5], [180, 1135]];
        this.arrRight = [[540, 1135 / 5], [540, 1135 * 2 / 5], [540, 1135 * 3 / 5], [540, 1135 * 4 / 5], [540, 1135]];
        this.addRole();
        this.addRemainRole();
        var allArray = this.meishiArray.concat(this.remainSpriteArray);
        for (var i = 0; i < allArray.length; i++) {
            var _this = allArray[i];
            _this.removeAllChildren();
            _this.setSpriteFrame(_this.type + '.png');
        }
    },
    initRole: function () {
        var meishi = Config.CORRECT_ROLE_GROUP[this.selectedRole];
        this.meishiArray = [];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 2; j++) {
                var sprite = new RoleSprite('#' + meishi.groupConent[j] + '.png');
                sprite.type = meishi.groupConent[j];
                this.meishiArray.push(sprite);
            }
        }
    },
    initRemainRole: function () {
        var puzzle = Config.PUZZLE_ARRAY[this.selectedRole];
        this.remainSpriteArray = [];
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 2; j++) {
                var sprite = new RoleSprite('#' + puzzle[j] + '.png');
                sprite.type = puzzle[j];
                this.remainSpriteArray.push(sprite);
            }
        }
    },
    initChest: function () {
        var chestBody1 = new cc.Sprite('#icon_chest_body1.png');
        chestBody1.y = 38;
        var chestBody2 = new cc.Sprite('#icon_chest_body2.png');
        var chestCap = new cc.Sprite('#icon_chest_cap.png');
        chestCap.y = 45;
        chestCap.setName('chestCap');
        var chestLights = new cc.Sprite('#icon_chest_lights.png');
        chestLights.y = 25;
        this.chestSprite = new RoleSprite();
        this.chestSprite.type = 'chest';
        this.chestSprite.addChild(chestBody1, 1);
        this.chestSprite.addChild(chestBody2, 3);
        this.chestSprite.addChild(chestCap, 4);
        this.chestSprite.addChild(chestLights);
    },
    addRole: function () {
        this.meishiArray.sort(function () { return 0.5 - Math.random() });
        var tempArr = this.meishiArray.concat();
        for (var i = 0; tempArr.length > 0; i--) {
            this.setLeftPosition(tempArr[tempArr.length - 1]);
            tempArr.pop();
            this.setRightPosition(tempArr[tempArr.length - 1]);
            tempArr.pop();
        }
        this.remainArray = this.arrLeft.concat(this.arrRight);
    },
    addRemainRole: function () {
        var length = this.remainArray.length;
        this.remainSpriteArray.sort(function () { return 0.5 - Math.random() });
        if (this.scrollIndex % 3 == 0) {
            this.getProperty();
            this.setRemainPosition(this.chestSprite);
            this.addChild(this.chestSprite);
            length--;
        }
        for (var i = 0; i < length; i++) {
            var sprite = this.remainSpriteArray[i];
            this.setRemainPosition(sprite);
            this.addChild(sprite);
        }
    },
    setLeftPosition: function (meishi) {
        var num = this.getRandom(this.arrLeft.length);
        meishi.x = this.arrLeft[num][0];
        meishi.y = this.arrLeft[num][1];
        this.arrLeft.splice(num, 1);
        this.addChild(meishi);
    },
    setRightPosition: function (meishi) {
        var num = this.getRandom(this.arrRight.length);
        meishi.x = this.arrRight[num][0];
        meishi.y = this.arrRight[num][1];
        this.arrRight.splice(num, 1);
        this.addChild(meishi);
    },
    setRemainPosition: function (sprite) {
        var num = this.getRandom(this.remainArray.length);
        sprite.x = this.remainArray[num][0];
        sprite.y = this.remainArray[num][1];
        this.remainArray.splice(num, 1);
    },
    getProperty: function () {
        this.initChest();
        var propertyName;
        if (Config.totalFrequency == 0 && this.parent.openIndex == 0) {
            propertyName = Config.PROPERTY_ARRAY[0];
        } else if (Config.totalFrequency == 1 && this.parent.openIndex == 0) {
            propertyName = Config.PROPERTY_ARRAY[this.getRandom(2)];
        } else {
            propertyName = Config.PROPERTY_ARRAY[this.getRandom(Config.PROPERTY_ARRAY.length)];
        }
        var propertySprite = new cc.Sprite('#icon_chest_' + propertyName + '.png');
        propertySprite.y = 20;
        propertySprite.scale = 0.2;
        propertySprite.type = propertyName;
        propertySprite.setName('chestProperty');
        this.chestSprite.addChild(propertySprite, 2);
    },
    getRandom: function (max) {
        return Math.floor(Math.random() * max);
    }
});