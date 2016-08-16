var PlayLayer = cc.Layer.extend({
    score: 0,//游戏分数
    timer: 0,
    lastTimer: 0,//用于计算倒计时的时间差
    correctNum: 0,
    scrollIndex: 2,
    autoPlay: false,
    openIndex: 0,//开箱子的记录
    autoPlayIndex: 0,
    ctor: function (selectedRole, playScene) {
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.property_plist, res.property_png);
        cc.spriteFrameCache.addSpriteFrames(res.gameover_plist, res.gameover_png);
        this.selectedRole = selectedRole;
        this.selectedGroup = Config.CORRECT_ROLE_GROUP[selectedRole];
        this.linkScore = this.selectedGroup.score;
        this.speed = this.selectedGroup.speed;
        this.totalTime = Config.TOTAL_TIME;
        //添加背景图
        this.initBgImage();
        //添加角色阵列的layer
        this.initRoleLayer();
        //顶部添加正确的连接图
        this.initTopRoleGroup();
        //添加暂停按钮
        this.initPauseBtn();
        //添加进度条
        this.initProgressBar();
        //添加分数
        this.initScore();
        //定时器
        this.scheduleUpdate();
        return true;
    },
    initBgImage: function () {
        var bgImage = new cc.Sprite(this.selectedGroup.bg);
        bgImage.x = Config.w_2;
        bgImage.y = Config.h_2;
        this.addChild(bgImage, 0);
    },
    initRoleLayer: function () {
        var selectedRole = this.selectedRole;
        var roleLayer1 = this.roleLayer1 = new RoleLayer(selectedRole);
        roleLayer1.x = 0;
        roleLayer1.y = Config.h;
        var roleLayer2 = this.roleLayer2 = new RoleLayer(selectedRole);
        roleLayer2.x = 0;
        roleLayer2.y = Config.h * 2;
        this.addChild(roleLayer1, 1);
        this.addChild(roleLayer2, 1);
    },
    initScore: function () {
        var scoreTextLabel = this.scoreTextLabel = new cc.LabelTTF('0', 'Arial', 60, cc.size(400, 50), cc.TEXT_ALIGNMENT_RIGHT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        scoreTextLabel.setFontFillColor(cc.color(255, 255, 255, 255));
        scoreTextLabel.attr({
            x: Config.w - 340,
            y: 60
        });
        var smallScoreSign = new cc.Sprite(this.selectedGroup.sign);
        smallScoreSign.x = Config.w - 80;
        smallScoreSign.y = 60;
        smallScoreSign.scale = 0.8;
        this.addChild(scoreTextLabel, 2);
        this.addChild(smallScoreSign, 2);
    },
    initScoreSign: function (y1, y2) {
        var scoreSign = new cc.Sprite(this.selectedGroup.sign);
        scoreSign.x = Config.w_2;
        scoreSign.y = (y2 - y1) / 2 + y1;
        var signScoreText = new cc.LabelTTF('+' + this.linkScore, 'Arial', 40);
        signScoreText.setColor(this.selectedGroup.cr);
        signScoreText.x = scoreSign.width + 40;
        signScoreText.y = scoreSign.height;
        scoreSign.addChild(signScoreText);
        this.addChild(scoreSign);
        this.addScore(this.linkScore);
        //分数上升动画
        signScoreText.runAction(
            cc.sequence(
                cc.moveTo(0.5, cc.p(signScoreText.x, signScoreText.y + 20)), cc.callFunc(function () {
                    signScoreText.removeFromParent(true);
                })
            )
        );
        scoreSign.runAction(cc.spawn(cc.moveTo(0.8, cc.p(scoreSign.x, 80)).easing(cc.easeSineIn()), cc.sequence(cc.delayTime(0.3), cc.fadeOut(0.5), cc.callFunc(function () {
            scoreSign.removeFromParent(true);
        }))));
    },
    addScore: function (score) {
        var scoreString = Utils.numberFmt(this.score + score);
        this.scoreTextLabel.setString(scoreString);
        this.score += score;
    },
    initTopRoleGroup: function () {
        var topRoleGroup = new cc.Sprite(this.selectedGroup.groupSrc);
        topRoleGroup.x = 100;
        topRoleGroup.y = Config.h - 50;
        this.addChild(topRoleGroup, 1);
    },
    initPauseBtn: function () {
        var pauseBtn = new cc.MenuItemImage('#icon_pause.png', '#icon_pause_hover.png', this.onPauseEvent, this);
        pauseBtn.width = 80;
        pauseBtn.height = 80;
        var pauseBtnMenu = new cc.Menu(pauseBtn);
        pauseBtnMenu.x = Config.w - 40;
        pauseBtnMenu.y = Config.h - 40;
        this.addChild(pauseBtnMenu, 1);
    },
    onPauseEvent: function () {
        this.pause();
        cc.eventManager.pauseTarget(this, true);
        var maskLayer = new PauseLayer(cc.color(0, 0, 0, 60), this.selectedRole);
        maskLayer.x = 0;
        maskLayer.y = 0;
        this.addChild(maskLayer, 9);
    },
    initProgressBar: function () {
        var progressBgBar = new cc.Sprite(res.progress_back_png);
        var progressBar = this.progressBar = new cc.Sprite(res.progress_front_png);
        var timeText = this.timeText = new cc.LabelTTF(0, 'msjt', 60, cc.size(300, 60));
        progressBgBar.setAnchorPoint(0, 0.5);
        progressBgBar.x = Config.w_2 - progressBgBar.width / 2 - 50;
        progressBgBar.y = Config.h - 50;
        progressBar.setAnchorPoint(0, 0.5);
        progressBar.x = Config.w_2 - progressBgBar.width / 2 - 50;
        progressBar.y = Config.h - 50;
        timeText.x = Config.w - 100;
        timeText.y = Config.h - 50;
        timeText.setColor(cc.color(0, 0, 0, 255));
        this.progressWidth = this.progressBar.width;
        this.setTimeLabel(Config.TOTAL_TIME);
        this.addChild(progressBgBar, 1);
        this.addChild(progressBar, 1);
        this.addChild(timeText, 1);
    },
    setTimeLabel: function (time) {
        var _minutes = Math.floor(time / 60);
        var _seconds = time % 60;
        var minutes = _minutes < 10 ? '0' + _minutes : _minutes;
        var seconds = _seconds < 10 ? '0' + _seconds : _seconds;
        this.timeText.setString(minutes + ':' + seconds);
    },

    update: function (dt) {
        if (this.totalTime <= 0 || this.progressBar.width <= 0) {
            this.gameOver();
            this.unschedule();
        } else {
            if (!this.autoPlay) {
                this.timer += dt;
                this.progressBar.setTextureRect(cc.rect(0, 0, this.progressBar.width - (this.progressWidth / Config.TOTAL_TIME) * dt, 33));
                if (this.timer - this.lastTimer >= (1 - dt)) {
                    this.setTimeLabel(--this.totalTime);
                    this.lastTimer = this.timer;
                }
            }
            var roleLayer1 = this.roleLayer1;
            var roleLayer2 = this.roleLayer2;
            var distance = this.speed * 1;
            roleLayer1.y -= distance;
            roleLayer2.y -= distance;
            if (roleLayer1.y <= -Config.h) {
                roleLayer1.y = Config.h + (roleLayer1.y + Config.h);
                roleLayer1.removeAllChildren();
                roleLayer1.initLayer(++this.scrollIndex);
                //自动连接
                if (this.autoPlay) {
                    this.autoPlayIndex++;
                    this.initAutoPlay(this.roleLayer2);
                }
            }
            if (roleLayer2.y <= -Config.h) {
                roleLayer2.y = Config.h + (roleLayer2.y + Config.h);
                roleLayer2.removeAllChildren();
                roleLayer2.initLayer(++this.scrollIndex);
                //自动连接
                if (this.autoPlay) {
                    this.autoPlayIndex++;
                    this.initAutoPlay(this.roleLayer1);
                }
            }
        }
    },
    gameOver: function () {
        this.pause();
        var colorArr = [cc.color(209, 240, 108, 255), cc.color(159, 191, 251, 255), cc.color(252, 177, 111, 255)]
        var gameOverLayer = this.gameOverLayer = new GameOverLayer(colorArr[this.selectedRole], this.score, this.selectedRole);
        gameOverLayer.initGameOverLayer();
        this.parent.addChild(gameOverLayer);
        this.upSceneAction();
    },
    linkCorrect: function (p1, p2) {
        this.initScoreSign(p1.y, p2.y);//连正确的动画
        if (this.speed <= Config.MAX_SPEED) {
            this.speed += 0.2;
        }
        var correctNum = ++this.correctNum;
        effectsNum = Config.LINK_COMBO.length;
        if (correctNum > 2) {
            (correctNum < effectsNum - 1) ? this.linkCombo(Config.LINK_COMBO[correctNum], p1, p2) : this.linkCombo(Config.LINK_COMBO[effectsNum - 1], p1, p2);
        }
        if (correctNum % 6 == 0) {
            var tips = new cc.LabelTTF('+' + Config.ENCOURAGE_TIME + 's', 'Arial', 40, cc.size(300, 40));
            tips.x = Config.w_2 + 200;
            tips.y = Config.h - 30;
            tips.setColor(this.selectedGroup.cr);
            tips.runAction(cc.sequence(cc.moveTo(1, cc.p(tips.x, tips.y + 10)), cc.callFunc(function () {
                tips.removeFromParent(true);
            })));
            this.addChild(tips, 9);
            this.totalTime += Config.ENCOURAGE_TIME;
            if (this.totalTime > Config.TOTAL_TIME) this.totalTime = Config.TOTAL_TIME;
            this.progressBar.setTextureRect(cc.rect(0, 0, this.progressBar.width + this.progressWidth * (Config.ENCOURAGE_TIME / Config.TOTAL_TIME), 19));
            if (this.progressBar.width > this.progressWidth) this.progressBar.width = this.progressWidth;
        }
    },
    linkCombo: function (string, p1, p2) {
        var text1 = new cc.Sprite('#' + string + '.png');
        text1.x = p1.x + 60;
        text1.y = p1.y + 10;
        var text2 = new cc.Sprite('#' + string + '.png');
        text2.x = p2.x + 60;
        text2.y = p2.y + 10;
        text1.runAction(cc.sequence(cc.scaleTo(0.2, 1.3, 1.3), cc.moveTo(0.1, text1.x, text1.y + 20), cc.callFunc(function () { text1.removeFromParent(true) })));
        text2.runAction(cc.sequence(cc.scaleTo(0.2, 1.3, 1.3), cc.moveTo(0.3, text2.x, text2.y + 20), cc.callFunc(function () { text2.removeFromParent(true) })));
        this.addChild(text1, 9);
        this.addChild(text2, 9);
    },
    linkError: function () {
        if (this.totalTime > Config.PUNISH_TIME) {
            this.speed = this.speed >= Config.MIN_SPEED ? this.speed - 0.5 : this.speed;
            this.totalTime -= Config.PUNISH_TIME;
            this.correctNum = 0;
            this.progressBar.setTextureRect(cc.rect(0, 0, this.progressBar.width - this.progressWidth * (Config.PUNISH_TIME / Config.TOTAL_TIME), 19));
            var blackBg = new cc.LayerColor(cc.color(0, 0, 0, 255));
            blackBg.runAction(cc.sequence(cc.blink(0.5, 12), cc.callFunc(function () { blackBg.removeFromParent(true) })));
            this.addChild(blackBg);
            var move = cc.moveBy(0.05, cc.p(10, 0));
            var moveBack = move.reverse();
            var moveSeq = cc.sequence(move, moveBack);
            var moveRep = moveSeq.repeat(5);
            this.parent.runAction(moveRep);
        } else {
            this.gameOver();
        }
    },
    initAutoPlay: function (roleLayer) {
        var roles = roleLayer.children;
        var type1 = this.selectedGroup.groupConent[0];
        var type2 = this.selectedGroup.groupConent[1];
        for (var i = 0; i < roles.length; i++) {
            if (roles[i].type == type1 || roles[i].type == type2) {
                roles[i].disappearAction(roles[i]);
                this.addScore(this.linkScore / 2);
            }
        }
        //恢复，清屏结束
        if (this.autoPlayIndex == Config.CLEAR_NUM) {
            this.speed = this.speed / 2;
            this.autoPlay = false;
            this.autoPlayIndex = 0;
        }
    },
    upSceneAction: function () {
        switchToStart();
        this.parent.runAction(
            cc.sequence(
                cc.moveTo(1.5, cc.p(this.parent.x, Config.h)), cc.callFunc(function () {
                    this.gameOverLayer.playAni();
                    this.removeFromParent(true);
                }, this)
            )
        );
    }
});
var PlayScene = cc.Scene.extend({
    ctor: function (selected_role) {
        this._super();
        this.selectedRole = selected_role;
    },
    onEnter: function () {
        this._super();
        var layer = new PlayLayer(this.selectedRole);
        this.addChild(layer);
    }
});