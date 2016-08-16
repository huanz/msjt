var PauseLayer = cc.LayerColor.extend({
    ctor: function (color, selectedRole) {
        this._super(color);
        pauseGameAudio();
        this.selectedRole = selectedRole;
        var backBtnItem = new cc.MenuItemImage(
            '#btn_backgame.png',
            '#btn_backgame_hover.png',
            this.onBackGame,
            this
        );
        var exitBtnItem = new cc.MenuItemImage(
            '#btn_exit.png',
            '#btn_exit_hover.png',
            this.onExitGame,
            this
        );
        var restartBtnItem = new cc.MenuItemImage(
            '#btn_restart_lg.png',
            '#btn_restart_lg_hover.png',
            this.onReStartGame,
            this
        );
        var menu = new cc.Menu(backBtnItem, restartBtnItem, exitBtnItem);
        menu.alignItemsVerticallyWithPadding(20);
        menu.x = Config.w_2;
        menu.y = Config.h_2;
        this.addChild(menu);
    },
    onBackGame: function () {
        this.runAction(cc.sequence(cc.fadeOut(0.4), cc.callFunc(function () {
            openGameAudio();
            cc.eventManager.resumeTarget(this.parent, true);
            this.parent.resume();
            this.removeFromParent(true);
        }, this)));

    },
    onReStartGame: function () {
        openGameAudio();
        cc.director.runScene(new cc.TransitionFade(1.2, new PlayScene(this.selectedRole)));
    },
    onExitGame: function () {
        closeGameAudio();
        cc.director.runScene(new cc.TransitionFade(1.2, new StartScene()));
    }
});