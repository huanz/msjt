var $startAudio = Utils.getById('startAudio');
var $gameAudio = Utils.getById('gameAudio');
var openStartAudio = function () {
    Utils.openAudio($startAudio);
};
var pauseStartAudio = function () {
    Utils.pauseAudio($startAudio);
};
var closeStartAudio = function () {
    Utils.closeAudio($startAudio);
};
var openGameAudio = function () {
    Utils.openAudio($gameAudio);
};
var pauseGameAudio = function () {
    Utils.pauseAudio($gameAudio);
};
var closeGameAudio = function () {
    Utils.closeAudio($gameAudio);
};
var switchToStart = function () {
    Utils.switchAudio($gameAudio, $startAudio);
};
var switchToGame = function () {
    Utils.switchAudio($startAudio, $gameAudio);
};

var StartLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        var bakeLayer = new cc.Layer();
        bakeLayer.bake();
        this.addChild(bakeLayer);

        var bgSprite = new BGSprite(res.startBG_png);

        var gear = new cc.Sprite(res.gear_png);
        gear.x = -25;
        gear.y = Config.h_2 + 108;

        var enterBtn = new cc.MenuItemImage(
            '#btn_enter.png',
            '#btn_enter_hover.png',
            this.onEnterGame,
            this
        );
        enterBtn.x = Config.w_2;
        enterBtn.y = Config.h_2 - 204;

        var helpBtn = new cc.MenuItemImage(
            '#btn_help.png',
            '#btn_help_hover.png',
            this.onHelp,
            this
        );
        helpBtn.x = Config.w - 100;
        helpBtn.y = Config.h_2 - 204;

        var rankMode = new cc.MenuItemImage(
            '#btn_rank.png',
            '#btn_rank_hover.png',
            this.onRankMode,
            this
        );
        rankMode.x = Config.w - 120;
        rankMode.y = 90;

        var accountMode = new cc.MenuItemImage(
            '#btn_account.png',
            '#btn_account_hover.png',
            this.onAccountMode,
            this
        );
        accountMode.x = Config.w_2;
        accountMode.y = 90;

        //        var musicOpenSprite = new cc.Sprite('#music_open.png');
        //        var musicOpenHoverSprite = new cc.Sprite('#music_open_hover.png');
        //        var musicCloseSprite = new cc.Sprite('#music_close.png');
        //        var musicCloseHoverSprite = new cc.Sprite('#music_close_hover.png');
        //        var audioArrSprite =  [[musicOpenSprite,musicOpenHoverSprite],[musicCloseSprite,musicCloseHoverSprite]];

        var audioArrSprite = this.audioArrSprite = [
            new cc.Sprite('#music_open.png'),
            new cc.Sprite('#music_close.png'),
            new cc.Sprite('#music_open_hover.png'),
            new cc.Sprite('#music_close_hover.png')
        ];
        var audioMode = this.audioMode = new cc.MenuItemSprite(
            Config.audioOpen == true ? audioArrSprite[0] : audioArrSprite[1],
            Config.audioOpen == true ? audioArrSprite[2] : audioArrSprite[3],
            this.onAudioMode,
            this
        );
        audioMode.x = 100;
        audioMode.y = 90;
        var menu = new cc.Menu(enterBtn, helpBtn, audioMode, rankMode, accountMode);
        menu.x = 0;
        menu.y = 0;

        bakeLayer.addChild(bgSprite);
        bakeLayer.addChild(menu);
        this.addChild(gear);
        gear.runAction(cc.rotateTo(8.0, 720).repeatForever());

        return true;
    },
    onEnterGame: function () {
        openStartAudio();
        cc.director.runScene(new cc.TransitionFade(1.2, new SingleModeScene()));
    },
    onHelp: function () {
        cc.director.runScene(new cc.TransitionFade(1.2, new HelpScene()));
    },
    onAudioMode: function () {
        Config.audioOpen ? this.closeAudio() : this.openAudio();
    },
    openAudio: function () {
        this.audioMode.setNormalImage(this.audioArrSprite[0]);
        this.audioMode.setSelectedImage(this.audioArrSprite[2]);
        Config.audioOpen = true;
        Utils.setCookie("openAudio", 1);
        openStartAudio();
    },
    closeAudio: function () {
        this.audioMode.setNormalImage(this.audioArrSprite[1]);
        this.audioMode.setSelectedImage(this.audioArrSprite[3]);
        closeStartAudio();
        Config.audioOpen = false;
        Utils.setCookie("openAudio", 0);
    },
    onAccountMode: function () {
        cc.director.runScene(new cc.TransitionFade(1.2, new AccountScene()));
    },
    onRankMode: function () {
        // cc.director.runScene(new cc.TransitionFade(1.2, new RankScene()));
        /*var _this = this;
        LoaderScene.ajaxLoad({
            url: Config.urls.high,
            success: function(dat){
                var rankDiv = Config.rankDiv,
                    rankW = parseInt(rankDiv.style.width, 10),
                    rLists = Utils.getById('r-lists'),
                    bgimg = Utils.getByTag('img', rankDiv)[0],
                    str = [],
                    len = dat.length,
                    strLen = rankW<300 ? 4 : 12;

                for(var i=0; i<len; i++){
                    var itm = dat[i],
                        tmp = '<li><span>'+(i+1);

                    tmp += '</span><span><img src="'+itm['headImgUrl']+'"/></span><span class="r-name">';
                    tmp += Utils.cutstr(itm['nickname'], strLen)+'</span><span class="r-score">'+itm['score']+'</span></li>';
                    str.push(tmp);
                    //str += tmp;
                }
                
                Utils.html(rLists, str.join(''));
                Utils.hide(cc.container);
                rDown = Utils.getByClass('r-down', rankDiv)[0];
                if( len < 8){
                    Utils.hide(rDown);
                }
                Utils.show(rankDiv);
                var imgwidth = bgimg.offsetWidth,
                    viewidth = bgimg.offsetLeft,
                    imgheight = bgimg.offsetHeight;

                rLists.style.width = imgwidth * 0.67 + 'px';
                rLists.style.left = (viewidth + 0.17 * imgwidth) + 'px';
                rLists.style.top = imgheight*0.29 + 'px';
                rLists.style.height=imgheight*0.61 + 'px';

            },
            error: function(xhr, status, msg){
                alert(msg);
                cc.director.runScene(new StartScene());
            }
        })*/
    }
});
var StartScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = this.layer = new StartLayer();
        this.addChild(layer);
        openStartAudio();
    }
});

