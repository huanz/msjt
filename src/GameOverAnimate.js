var GameOverLayer = cc.LayerColor.extend({
    ctor: function (color, score, selectedRole) {
        this._super(color);
        this.score = score;
        this.selectedRole = selectedRole;
        this.y = -Config.h;
    },
    playAni: function () {
        switch (this.selectedRole) {
            case 0: this.playAnimate1(); break;
            case 1: this.playAnimate2(); break;
            case 2: this.playAnimate3(); break;
            default: break;
        }
        this.playCommonAni();
    },
    initGameOverLayer: function () {
        //前景
        var fgImage = new cc.Sprite('#gameover_fg.png');
        fgImage.x = Config.w_2;
        fgImage.y = Config.h_2;
        //齿轮
        var gearImage = this.gearImage = new cc.Sprite('#gameover_gear.png');
        gearImage.x = Config.w_2 + 90;
        gearImage.y = Config.h - 220;

        //烟雾1
        var smoke1Image = this.smoke1Image = new cc.Sprite('#gameover_smoke1.png');
        smoke1Image.x = Config.w - 70;
        smoke1Image.y = Config.h - 120;

        //烟雾2
        var smoke2Image = this.smoke2Image = new cc.Sprite('#gameover_smoke2.png');
        smoke2Image.x = Config.w - 120;
        smoke2Image.y = Config.h - 180;

        //烟雾3
        var smoke3Image = this.smoke3Image = new cc.Sprite('#gameover_smoke3.png');
        smoke3Image.x = 90;
        smoke3Image.y = Config.h_2 + 300;
        smoke3Image.opacity = 0;


        this.addChild(gearImage);
        this.addChild(fgImage);
        this.addChild(smoke1Image);
        this.addChild(smoke2Image);
        this.addChild(smoke3Image);
    },
    playCommonAni: function () {
        this.gearImage.runAction(cc.rotateTo(8.0, 720).repeatForever());

        this.smoke1Image.runAction(cc.moveTo(1.5, cc.p(this.smoke1Image.x + 10, this.smoke1Image.y + 30)).repeatForever());
        this.smoke1Image.runAction(
            cc.sequence(
                cc.fadeIn(1.5).easing(cc.easeSineOut()),
                cc.fadeOut(2).easing(cc.easeSineOut()),
                cc.moveTo(1.5, cc.p(this.smoke1Image.x, this.smoke1Image.y))
            ).repeatForever()
        );

        this.smoke2Image.runAction(cc.moveTo(1.5, cc.p(this.smoke2Image.x - 20, this.smoke2Image.y + 20)).repeatForever());
        this.smoke2Image.runAction(
            cc.sequence(
                cc.fadeIn(1.5).easing(cc.easeSineOut()),
                cc.fadeOut(2).easing(cc.easeSineOut()),
                cc.moveTo(1.5, cc.p(this.smoke2Image.x, this.smoke2Image.y))
            ).repeatForever()
        );

        this.smoke3Image.runAction(cc.moveTo(1, cc.p(this.smoke3Image.x - 10, this.smoke3Image.y + 50)).repeatForever());
        this.smoke3Image.runAction(
            cc.sequence(
                cc.fadeIn(1).easing(cc.easeSineOut()),
                cc.fadeOut(1.5).easing(cc.easeSineOut()),
                cc.moveTo(1, cc.p(this.smoke3Image.x, this.smoke3Image.y))
            ).repeatForever()
        );
    },
    playAnimate2: function () {
        var soapImage = new cc.Sprite('#gameover_soap.png');
        soapImage.x = Config.w_2 + 15;
        soapImage.y = Config.h + 40;
        soapImage.runAction(cc.sequence(
            cc.spawn(
                cc.rotateTo(0.5, -180),
                cc.moveTo(0.5, cc.p(soapImage.x - 20, 262))
            ),
            cc.delayTime(0.5),
            cc.moveTo(0.5, cc.p(soapImage.x - 20, 90))
        ));
        this.addChild(soapImage);
        this.play2Layer();
    },
    play2Layer: function () {
        var xiashisLayer = new cc.Layer();
        xiashisLayer.width = 200;
        xiashisLayer.height = 300;
        xiashisLayer.x = Config.w_2 - 210;
        xiashisLayer.y = 60;
        var niushiLayer = new cc.Layer();
        niushiLayer.width = 200;
        niushiLayer.height = 200;
        niushiLayer.x = Config.w_2 + 20;
        niushiLayer.y = 120;
        //吓屎
        var xiashi_part1 = new cc.Sprite('#xiashi_part1.png');
        var xiashi_part2 = new cc.Sprite('#xiashi_part2.png');
        var xiashi_part2_c = new cc.Sprite('#xiashi_part2.png');
        var xiashi_part3 = new cc.Sprite('#xiashi_part3.png');
        var xiashi_part4 = new cc.Sprite('#xiashi_part4.png');
        var xiashi_part5 = new cc.Sprite('#xiashi_part5.png');
        //身体
        xiashi_part1.x = xiashisLayer.width / 2;
        xiashi_part1.y = xiashisLayer.height / 2 + 15;
        //左眼睛
        xiashi_part2.x = xiashisLayer.width / 2 - 15;
        xiashi_part2.y = xiashisLayer.height - 20;
        xiashi_part2.rotation = -60;
        //右眼睛
        xiashi_part2_c.x = xiashisLayer.width / 2 + 20;
        xiashi_part2_c.y = xiashisLayer.height - 15;
        xiashi_part2_c.rotation = -60;
        //泡沫
        xiashi_part3.x = xiashisLayer.width;
        xiashi_part3.y = 90;
        xiashi_part3.opacity = 0;
        //流汗
        xiashi_part4.x = 60;
        xiashi_part4.y = xiashisLayer.height - 40;
        xiashi_part4.opacity = 0;
        //问号
        xiashi_part5.x = xiashisLayer.width / 2 - 10;
        xiashi_part5.y = xiashisLayer.height + 60;
        xiashi_part5.opacity = 0;

        xiashisLayer.addChild(xiashi_part1);
        xiashisLayer.addChild(xiashi_part2);
        xiashisLayer.addChild(xiashi_part2_c);
        xiashisLayer.addChild(xiashi_part3);
        xiashisLayer.addChild(xiashi_part4);
        xiashisLayer.addChild(xiashi_part5);
        xiashi_part2.runAction(cc.rotateTo(1, 0));
        xiashi_part2_c.runAction(cc.rotateTo(1, 0));
        xiashi_part2.runAction(cc.sequence(cc.delayTime(1), cc.rotateTo(1.5, 40)));
        xiashi_part2_c.runAction(cc.sequence(cc.delayTime(1), cc.rotateTo(1.5, 40)));
        xiashi_part3.runAction(cc.sequence(cc.delayTime(2), cc.fadeIn(0.8)));
        xiashi_part4.runAction(cc.sequence(cc.delayTime(1.5), cc.fadeIn(0.8)));
        xiashi_part4.runAction(cc.sequence(cc.delayTime(2.3), cc.fadeOut(0.8)));
        xiashi_part4.runAction(cc.sequence(cc.delayTime(1.5), cc.moveTo(1.8, cc.p(xiashi_part4.x, xiashi_part4.y - 30))));
        xiashi_part5.runAction(cc.sequence(cc.delayTime(2.5), cc.fadeIn(0.8), cc.delayTime(1),
            cc.callFunc(this.animateEnd, this)
        ));
        //牛屎
        var niushi_part1 = new cc.Sprite('#niushi3_part1.png');
        var niushi_part2 = new cc.Sprite('#niushi3_part2.png');
        var niushi_part3 = new cc.Sprite('#niushi3_part3.png');
        //身体
        niushi_part1.x = niushiLayer.width / 2;
        niushi_part1.y = niushiLayer.height / 2 - 15;
        //眼睛
        niushi_part2.x = niushiLayer.width / 2 - 40;
        niushi_part2.y = niushiLayer.height / 2 + 55;
        niushi_part2.rotation = 80;
        //左手
        niushi_part3.x = -18;
        niushi_part3.y = niushiLayer.height / 2 - 10;
        niushi_part3.rotation = -60;
        niushiLayer.addChild(niushi_part3);
        niushiLayer.addChild(niushi_part1);
        niushiLayer.addChild(niushi_part2);
        niushi_part2.runAction(cc.sequence(cc.rotateTo(0.5, 0), cc.delayTime(0.5), cc.rotateTo(0.5, -60)));
        niushi_part3.runAction(cc.rotateTo(0.5, 0));
        niushi_part3.runAction(
            cc.sequence(
                cc.moveTo(0.5, cc.p(niushi_part3.x, niushi_part3.y + 10)),
                cc.delayTime(0.5),
                cc.spawn(
                    cc.rotateTo(0.2, -60),
                    cc.moveTo(0.2, cc.p(niushi_part3.x, niushi_part3.y - 5))
                )
            )
        );
        this.addChild(niushiLayer);
        this.addChild(xiashisLayer);
    },
    playAnimate3: function () {
        var stoneImage = new cc.Sprite('#gameover_stone.png');
        stoneImage.x = Config.w_2 + 15;
        stoneImage.y = Config.h + 40;
        stoneImage.runAction(
            cc.spawn(
                cc.sequence(cc.rotateTo(0.5, -280), cc.rotateTo(0.2, -260)),
                cc.sequence(
                    cc.moveTo(0.5, cc.p(stoneImage.x, 260)).easing(cc.easeSineIn()),
                    cc.moveTo(0.2, cc.p(stoneImage.x - 10, 250)),
                    cc.moveTo(0.2, cc.p(stoneImage.x + 10, 240))
                )
            )
        );
        this.play3Layer();
        this.addChild(stoneImage);

    },
    play3Layer: function () {
        var lashiLayer = new cc.Layer();
        var niushiLayer = new cc.Layer();
        lashiLayer.width = 200;
        lashiLayer.height = 200;
        lashiLayer.x = Config.w / 2 - 220;
        lashiLayer.y = 80;
        niushiLayer.width = 200;
        niushiLayer.height = 200;
        niushiLayer.x = Config.w / 2 + 40;
        niushiLayer.y = 60;
        //拉屎
        var lashi_part1 = new cc.Sprite('#lashi_part1.png');
        var lashi_part2 = new cc.Sprite('#lashi_part2.png');
        var lashi_part3 = new cc.Sprite('#lashi_part3.png');
        var lashi_part4 = new cc.Sprite('#lashi_part4.png');
        var lashi_part5 = new cc.Sprite('#lashi_part5.png');
        //身体
        lashi_part1.x = lashiLayer.width / 2;
        lashi_part1.y = lashiLayer.height / 2 - 15;
        //右手
        lashi_part2.x = lashiLayer.width - 18;
        lashi_part2.y = lashiLayer.height / 2 + 20;
        //左眼
        lashi_part3.x = lashiLayer.width / 2 - 10;
        lashi_part3.y = lashiLayer.height / 2 + 40;
        lashi_part3.rotation = -60;
        //右眼
        lashi_part4.x = lashiLayer.width / 2 + 40;
        lashi_part4.y = lashiLayer.height / 2 + 40;
        lashi_part4.rotation = -60;
        //碎石
        lashi_part5.x = lashiLayer.width + 100;
        lashi_part5.y = lashiLayer.height / 2 + 50;
        lashi_part5.opacity = 0;

        var lashiArr = [lashi_part2, lashi_part1, lashi_part3, lashi_part4, lashi_part5];
        for (var i = 0; i < lashiArr.length; i++) {
            lashiLayer.addChild(lashiArr[i]);
        }
        lashi_part2.runAction(cc.sequence(cc.delayTime(0.5), cc.rotateTo(0.2, -10), cc.rotateTo(0.2, 20)));
        lashi_part3.runAction(cc.rotateTo(0.8, 0));
        lashi_part4.runAction(cc.rotateTo(0.8, 0));
        lashi_part5.runAction(cc.sequence(cc.delayTime(1), cc.fadeIn(0.8), cc.delayTime(1),
            cc.callFunc(this.animateEnd, this)
        ));
        //眨眼
        lashi_part3.runAction(cc.sequence(cc.delayTime(2.5), cc.fadeOut(0.1), cc.fadeIn(0.1)).repeatForever());
        lashi_part4.runAction(cc.sequence(cc.delayTime(2.5), cc.fadeOut(0.1), cc.fadeIn(0.1)).repeatForever());
        //牛屎
        var niushi_part1 = new cc.Sprite('#niushi2_part1.png');
        var niushi_part2 = new cc.Sprite('#niushi2_part2.png');
        var niushi_part3 = new cc.Sprite('#niushi2_part3.png');
        var niushi_part4 = new cc.Sprite('#niushi2_part4.png');
        var niushi_part5 = new cc.Sprite('#niushi2_part5.png');
        var niushi_part8 = new cc.Sprite('#niushi1_part8.png');
        //身体
        niushi_part1.x = niushiLayer.width / 2;
        niushi_part1.y = niushiLayer.height / 2 - 15;
        //笑嘴
        niushi_part2.x = niushiLayer.width / 2;
        niushi_part2.y = niushiLayer.height / 2 - 15;
        //不开心
        niushi_part3.x = niushiLayer.width / 2;
        niushi_part3.y = niushiLayer.height / 2 - 15;
        niushi_part3.opacity = 0;
        //哭眼睛
        niushi_part4.x = niushiLayer.width / 2 - 10;
        niushi_part4.y = niushiLayer.height / 2 + 40;
        niushi_part4.opacity = 0;
        //生气
        niushi_part5.x = niushiLayer.width / 2 + 30;
        niushi_part5.y = niushiLayer.height / 2 + 40;
        niushi_part5.opacity = 0;
        //眼睛
        niushi_part8.x = niushiLayer.width / 2 - 10;
        niushi_part8.y = niushiLayer.height / 2 + 40;
        niushi_part8.rotation = 50;

        var niushiArr = [niushi_part1, niushi_part2, niushi_part3, niushi_part4, niushi_part5, niushi_part8];
        for (var i = 0; i < niushiArr.length; i++) {
            niushiLayer.addChild(niushiArr[i]);
        }
        niushi_part2.runAction(cc.sequence(cc.delayTime(1), cc.fadeOut(0.8)));
        niushi_part3.runAction(cc.sequence(cc.delayTime(1), cc.fadeIn(0.8)));
        niushi_part4.runAction(cc.sequence(cc.rotateTo(0.5, 0), cc.delayTime(0.5), cc.fadeIn(0.8)));
        niushi_part5.runAction(cc.sequence(cc.delayTime(1), cc.fadeIn(0.8)));
        niushi_part8.runAction(cc.sequence(cc.rotateTo(0.5, 0), cc.delayTime(0.5), cc.fadeOut(0.8)));
        this.addChild(niushiLayer);
        this.addChild(lashiLayer);

    },
    playAnimate1: function () {
        var heartImage = new cc.Sprite('#gameover_heart.png');
        heartImage.y = Config.h + 50;
        heartImage.x = Config.w_2;
        this.play1Layer();
        this.addChild(heartImage);
        heartImage.runAction(
            cc.sequence(
                cc.moveTo(0.5, cc.p(heartImage.x, 170)).easing(cc.easeSineIn()),
                cc.rotateTo(0.5, -15)
            )
        );
    },
    play1Layer: function () {
        var saoshiLayer = new cc.Layer();
        saoshiLayer.width = 200;
        saoshiLayer.height = 200;
        saoshiLayer.x = Config.w_2 - 230;
        saoshiLayer.y = 80;
        var niushiLayer = new cc.Layer();
        niushiLayer.width = 200;
        niushiLayer.height = 200;
        niushiLayer.x = Config.w_2 + 40;
        niushiLayer.y = 60;
        var saoshi_part1 = new cc.Sprite('#saoshi_part1.png');
        var saoshi_part2 = new cc.Sprite('#saoshi_part2.png');
        var saoshi_part4 = new cc.Sprite('#saoshi_part4.png');
        var saoshi_part4_c = new cc.Sprite('#saoshi_part4.png');
        var saoshi_part7 = new cc.Sprite('#saoshi_part7.png');
        var saoshi_part8 = new cc.Sprite('#saoshi_part8.png');
        var saoshi_part9 = new cc.Sprite('#saoshi_part9.png');
        var saoshi_part10 = new cc.Sprite('#saoshi_part10.png');
        //身体
        saoshi_part1.x = saoshiLayer.width / 2;
        saoshi_part1.y = saoshiLayer.height / 2 - 15;
        //眼睛
        saoshi_part2.x = saoshiLayer.width / 2 - 10;
        saoshi_part2.y = saoshiLayer.height / 2 + 10;
        saoshi_part2.rotation = -120;
        //右手
        saoshi_part4.x = saoshiLayer.width - 25;
        saoshi_part4.y = saoshiLayer.height / 2;
        saoshi_part4_c.x = saoshiLayer.width - 25;
        saoshi_part4_c.y = saoshiLayer.height / 2 + 5;
        saoshi_part4_c.opacity = 0;
        //左手
        saoshi_part7.x = 20;
        saoshi_part7.y = saoshiLayer.height / 2 - 30;
        saoshi_part7.rotation = -60;
        //眯眼
        saoshi_part8.x = saoshiLayer.width / 2 - 10;
        saoshi_part8.y = saoshiLayer.height / 2 + 10;
        saoshi_part8.opacity = 0;
        //心
        saoshi_part9.x = saoshiLayer.width;
        saoshi_part9.y = saoshiLayer.height / 2 + 80;
        saoshi_part9.opacity = 0;
        //害羞
        saoshi_part10.x = saoshiLayer.width / 2 - 3;
        saoshi_part10.y = saoshiLayer.height / 2 - 18;
        saoshi_part10.opacity = 0;
        var saoshiArr = [saoshi_part7, saoshi_part1, saoshi_part2, saoshi_part4, saoshi_part4_c, saoshi_part8, saoshi_part9, saoshi_part10];
        for (var i = 0; i < saoshiArr.length; i++) {
            saoshiLayer.addChild(saoshiArr[i]);
        }
        saoshi_part2.runAction(cc.rotateTo(1, 0));
        saoshi_part4.runAction(cc.sequence(cc.delayTime(1), cc.fadeOut(0.5)));
        saoshi_part4_c.runAction(cc.sequence(cc.delayTime(1), cc.fadeIn(0.5)));
        saoshi_part7.runAction(
            cc.sequence(
                cc.delayTime(1),
                cc.spawn(
                    cc.rotateTo(0.5, 0),
                    cc.moveTo(0.5, cc.p(saoshi_part7.x - 10, saoshi_part7.y + 10))
                ),
                cc.delayTime(1),
                cc.callFunc(this.animateEnd, this)
            )
        );
        saoshi_part8.runAction(cc.sequence(cc.delayTime(1), cc.fadeIn(0.2)));
        saoshi_part9.runAction(cc.sequence(cc.delayTime(1), cc.fadeIn(2)));
        saoshi_part10.runAction(cc.sequence(cc.delayTime(1), cc.fadeIn(1)));
        this.addChild(niushiLayer);
        this.addChild(saoshiLayer);


        var niushi_part1 = new cc.Sprite('#niushi1_part1.png');
        var niushi_part2 = new cc.Sprite('#niushi1_part2.png');
        var niushi_part4 = new cc.Sprite('#niushi1_part4.png');
        var niushi_part7 = new cc.Sprite('#niushi1_part7.png');
        var niushi_part8 = new cc.Sprite('#niushi1_part8.png');
        //身体
        niushi_part1.x = niushiLayer.width / 2;
        niushi_part1.y = niushiLayer.height / 2 - 20;
        //色色
        niushi_part2.x = niushiLayer.width / 2 - 25;
        niushi_part2.y = niushiLayer.height / 2 + 55;
        niushi_part2.opacity = 0;
        //右手
        niushi_part4.x = niushiLayer.width / 2 + 50;
        niushi_part4.y = niushiLayer.height / 2 - 30;
        niushi_part4.rotation = -20;
        //左手
        niushi_part7.x = -15;
        niushi_part7.y = niushiLayer.height / 2 - 15;
        niushi_part7.rotation = -20;
        //眼睛
        niushi_part8.x = niushiLayer.width / 2 - 25;
        niushi_part8.y = niushiLayer.height / 2 + 55;
        niushi_part8.rotation = 30;
        niushi_part2.runAction(cc.fadeIn(0.5));
        niushi_part4.runAction(cc.rotateTo(0.5, 0));
        niushi_part4.runAction(cc.moveTo(0.5, cc.p(niushi_part4.x - 10, niushi_part4.y + 10)));
        niushi_part7.runAction(cc.spawn(
            cc.rotateTo(0.5, 60),
            cc.moveTo(0.5, cc.p(niushi_part7.x, niushi_part7.y + 15))
        ));
        var niushiArr = [niushi_part7, niushi_part1, niushi_part4, niushi_part8, niushi_part2];
        for (var i = 0; i < niushiArr.length; i++) {
            niushiLayer.addChild(niushiArr[i]);
        }

    },
    animateEnd: function () {
        var _this = this,
            postData = {};
        if (this.score) postData['score'] = Utils.encrypt(Utils.k, this.score);
        /**
         * @desc bukas 2016-08-11
         */
        Utils.setCookie('preScore', _this.score);
        Config.score.now = _this.score;
        Config.totalFrequency++;
        cc.director.runScene(new SingleEndScene(_this.score, _this.selectedRole));
        // LoaderScene.ajaxLoad({
        //     url: Config.urls.end,
        //     data: postData,
        //     success: function(data){
        //         if(data['msg']){
        //             alert(data['msg']);
        //             cc.director.runScene(new SingleModeScene());
        //             return ;
        //         }
        //         Utils.setCookie('preScore', _this.score);
        //         Config.score.now = _this.score;
        //         Config.totalFrequency++;
        //         cc.director.runScene(new SingleEndScene(_this.score, _this.selectedRole));
        //     },
        //     error: function(xhr, status, msg){
        //         alert(msg);
        //         cc.director.runScene(new SingleModeScene());
        //     }
        // });
    }
});