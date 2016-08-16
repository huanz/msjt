var coinItem = cc.Layer.extend({
    ctor: function (type, num, score, flag) {
        //type: 0:已领取的 1：可领取的 2:未领取的
        //num: 牛币数  score: 分数
        //flag: 账号页面/结算页面  0/1
        this._super();
        this.type = type;
        var score = Utils.numberFmt(score);
        if (type == 1) {
            score += '分';
            if (flag == 1) type = 2;
        }
        var flagMap = [[
            [cc.rect(2, 176, 63, 56), cc.color(188, 122, 42), 48, cc.color(188, 122, 42), 42],
            [cc.rect(2, 176, 63, 56), cc.color(188, 122, 42), 48, cc.color(188, 122, 42), 42],
            [cc.rect(67, 176, 62, 55), cc.color(96, 96, 96), 48, cc.color(181, 181, 181), 42]
        ],
            [
                [cc.rect(2, 176, 63, 56), cc.color(188, 122, 42), 48, cc.color(188, 122, 42), 42],
                [cc.rect(2, 2, 196, 172), cc.color(188, 122, 42), 120, cc.color(188, 122, 42), 54],
                [cc.rect(67, 176, 62, 55), cc.color(96, 96, 96), 48, cc.color(181, 181, 181), 42]
            ]
        ];

        var coinMap = this.coinMap = flagMap[flag];
        var coin = new cc.Sprite(res.coin_png, coinMap[type][0]);
        var coinAward = new cc.LabelTTF(num, 'msjt', coinMap[type][2], cc.size(240, 180), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        coinAward.x = -coin.width * 0.04;
        coinAward.setFontFillColor(coinMap[type][1]);

        var scoreLabel = new cc.LabelTTF(score, 'msjt', coinMap[type][4], cc.size(540, 54), cc.TEXT_ALIGNMENT_CENTER);
        scoreLabel.y = -coin.height;
        scoreLabel.setFontFillColor(coinMap[type][3]);
        this.addChild(coin);
        this.addChild(coinAward);
        this.addChild(scoreLabel);
        this.coinArr = [coin, coinAward, scoreLabel];

        return true;
    },
    changeType: function (e, type) {
        var coinType = this.coinMap[type],
            coinArr = this.coinArr;
        coinArr[0].setTextureRect(coinType[0]);
        coinArr[1].setFontSize(coinType[2]);
        coinArr[1].setFontFillColor(coinType[1]);
        coinArr[2].y -= 60;
        coinArr[2].setFontSize(coinType[4]);
        coinArr[2].setFontFillColor(coinType[3]);
    }
});


var CoinLayer = cc.Layer.extend({
    achievePos: 0,
    awardCoin: null,
    achieved: 0,
    ctor: function (flag) {
        this._super();

        this.flag = flag;

        var posArrs = [
            [[35, 28], [110, -115], [235, 0], [310, -160], [430, 10], [480, -130]],
            [[0, -150], [150, -150], [300, -150], [450, -150], [600, -150], [750, -150]]
        ];

        var posArr = posArrs[flag],
            awards = Config.award;

        for (var i = 0; i < awards.length; i++) {
            var tmpCoin = null,
                item = awards[i];
            if (Config.score.total >= item[0]) {
                if (item[1]) {
                    tmpCoin = new coinItem(0, item[2], item[0], flag);
                } else {
                    tmpCoin = new coinItem(1, item[2], item[0], flag);
                    this.achieved += item[2];
                    awards[i][1] = 1;
                    this.achievePos = i;
                    this.awardCoin = tmpCoin;
                }
            } else {
                tmpCoin = new coinItem(2, item[2], item[0], flag);
            }
            tmpCoin.x = posArr[i][0];
            tmpCoin.y = posArr[i][1];
            this.addChild(tmpCoin);
        }

        return true;
    },
    onEnter: function () {
        this._super();
        var _this = this,
            pos = 300 - _this.achievePos * 150;
        var runTimer = setTimeout(function () {
            if (!_this.flag || !_this.awardCoin) {
                clearTimeout(runTimer);
                runTimer = null;
            } else {
                _this.runAction(cc.sequence(cc.moveBy(1.0, cc.p(pos, 0)).easing(cc.easeIn(1.0)), cc.callFunc(_this.awardCoin.changeType, _this.awardCoin, 1)));
            }
        }, 1500);
    }
});