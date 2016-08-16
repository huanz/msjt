/**
 * A brief explanation for "project.json":
 * Here is the content of project.json file, this is the global configuration for your game, you can modify it to customize some behavior.
 * The detail of each field is under it.
 {
    "project_type": "javascript",
    // "project_type" indicate the program language of your project, you can ignore this field

    "debugMode"     : 1,
    // "debugMode" possible values :
    //      0 - No message will be printed.
    //      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
    //      2 - cc.error, cc.assert, cc.warn will print in console.
    //      3 - cc.error, cc.assert will print in console.
    //      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
    //      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
    //      6 - cc.error, cc.assert will print on canvas, available only on web.

    "showFPS"       : true,
    // Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.

    "frameRate"     : 60,
    // "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.

    "id"            : "gameCanvas",
    // "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.

    "renderMode"    : 0,
    // "renderMode" sets the renderer type, only useful on web :
    //      0 - Automatically chosen by engine
    //      1 - Forced to use canvas renderer
    //      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers

    "engineDir"     : "frameworks/cocos2d-html5/",
    // In debug mode, if you use the whole engine to develop your game, you should specify its relative path with "engineDir",
    // but if you are using a single engine file, you can ignore it.

    "modules"       : ["cocos2d"],
    // "modules" defines which modules you will need in your game, it's useful only on web,
    // using this can greatly reduce your game's resource size, and the cocos console tool can package your game with only the modules you set.
    // For details about modules definitions, you can refer to "../../frameworks/cocos2d-html5/modulesConfig.json".

    "jsList"        : [
    ]
    // "jsList" sets the list of js files in your game.
 }
 *
 */
(function (win) {
    var gameRunning = false;
    var initGameConf = function (cnf) {
        //if(!Utils.isNotEmptyString(cnf)) return;
        //var argCnf = JSON.parse(Utils.decrypt('msjt', cnf));
        if (!cnf) return;
        var argCnf = cnf;
        Config.flowCoin = argCnf['nBnum'];
        Config.score.total = argCnf['totalScore'];
        Config.score.high = argCnf['topScore'];
        Config.user.userId = argCnf['userid'];
        Config.user.avatar = argCnf['headURL'] || res.default_png;
        Config.user.zhpt_account = argCnf['zhpt_account'];
        Config.user.name = argCnf['nickName'];
        Config.user.sex = argCnf['sex'] || 0;
        Config.first = argCnf['isNewUser'];
        Config.roleSelect = argCnf['peoplelocks'];
        if (Config.user.zhpt_account != 0) {
            Config.isLogin = true;
        }
        Config.award = [];
        Config.audioOpen = Utils.getCookie('openAudio') == 0 ? false : true;
        var owned = 0;
        for (var i = 0; i < argCnf['prase'].length; i++) {
            Config.award[i] = [];
            Config.award[i][0] = argCnf['prase'][i];
            if (i > argCnf['gameprogress'] - 1) {
                Config.award[i][1] = false;
            } else {
                Config.award[i][1] = true;
                owned += argCnf['rewared'][i];
            }
            Config.award[i][2] = argCnf['rewared'][i];
        }
        Config.owned = owned;
        Config.totalFrequency = argCnf['totalFrequency'];
    };

    var initDom = function () {
        //rankDom
        //dom

        /*var rankDiv = Config.rankDiv = Utils.getById('rank');
        rankDiv.style.cssText += cc.container.style.cssText;
        //rank back
        Utils.getByClass('r-back', rankDiv)[0].addEventListener('click', function(){
            Utils.hide(rankDiv);
            Utils.show(cc.container);
            cc.director.runScene(new cc.TransitionFade(0.5, new StartScene()));
        }, false);
        var rankDown = Utils.getByClass('r-down', rankDiv)[0];
        Utils.getById('r-lists').addEventListener('scroll', function(e){
            var target = e.target;
            if((target.scrollTop+target.clientHeight+5) >= target.scrollHeight){
                Utils.hide(rankDown);
            }else{
                Utils.show(rankDown);
            }            
        }, false);*/
        var cntW = parseInt(cc.container.style.width, 10),
            cntH = parseInt(cc.container.style.height, 10);

        var rankDiv = Config.rankDiv = Utils.getById('rank');
        rankDiv.style.cssText += 'width:' + (cntW * 0.68) + 'px;height:' + (cntH * 0.615) + 'px;top:' + (cntH * 0.29) + 'px;margin:' + cc.container.style.margin + ';margin-left:' + (-cntW * 0.68 / 2) + 'px;';
        var rankDown = Utils.getByClass('r-down', rankDiv)[0];
        var rankLists = Config.rankLists = Utils.getByClass('r-lists', rankDiv);
        Utils.each(rankLists, function (oLi) {
            oLi.addEventListener('scroll', function (e) {
                var target = e.target;
                if ((target.scrollTop + target.clientHeight + 5) >= target.scrollHeight) {
                    Utils.hide(rankDown);
                } else {
                    Utils.show(rankDown);
                }
            }, false);
        });
        Config.rankLen = Math.floor(parseInt(rankDiv.style.width, 10) / 11) - 12;

        // Utils.doc.addEventListener('touchstart',function(){
        //     $startAudio.load();
        // },false);
    };

    var startGame = function (args) {
        if (gameRunning) return;
        cc.game.onStart = function () {
            cc.view.adjustViewPort(true);
            cc.view.setDesignResolutionSize(720, 1134, cc.ResolutionPolicy.SHOW_ALL);
            cc.view.resizeWithBrowserSize(true);
            initGameConf(args);
            if (!Config.isLogin) {
                g_resources.push(res.btnEx_png);
            }
            if (Config.first) {
                g_resources.push(res.startShow_png);
            }
            //load MP3
            //cc.loader.load([res.happyRockEnd_audio,res.startMusic_audio], function(){},function(){});
            //load resources
            LoaderScene.preload(g_resources, function () {
                var spriteFrameCache = cc.spriteFrameCache;
                spriteFrameCache.addSpriteFrames(res.btns_plist, res.btns_png);
                spriteFrameCache.addSpriteFrames(res.icon_main_plist, res.icon_main_png);
                spriteFrameCache.addSpriteFrames(res.role_plist, res.role_png);
                spriteFrameCache.addSpriteFrames(res.gameover_plist, res.gameover_png);
                cc.director.runScene(new AniScene());
                //spriteFrameCache.addSpriteFrames(res.login_plist, res.login_png);
                //Config.UserGetCoin = 10;
                //cc.director.runScene(new LoginScene());
                ///cc.director.runScene(new SingleEndScene(300000, 0));
                //cc.director.runScene(new RankScene());
                initDom();
            }, this);
        };
        cc.game.run();
        gameRunning = true;
    };

    win['startGame'] = startGame;

})(window);