
var Config = Config || {};

Config.winSize = cc.size(720, 1134);
Config.w = Config.winSize.width;
Config.h = Config.winSize.height;
Config.w_2 = Config.w / 2;
Config.h_2 = Config.h / 2;

//是否第一次玩
Config.first = true;

Config.user = {
    sex: 0,
    zhpt_account: '',
    userId: 22,
    name: '',
    avatar: 'http://blog.u.qiniudn.com/uploads/20141127181900.jpg'
};

Config.audioOpen = true;

//玩了多少局
Config.totalFrequency = 0;

Config.host = '/';
Config.urls = {
    rank: Config.host + 'search/rank.do',
    login: Config.host + 'e/zhptload.do',
    register: Config.host + 'e/register.do',
    reset: Config.host + '/e/findPwd.do',
    captcha: Config.host + 'e/captcha.do',
    end: Config.host + 'game/settle.do',
    nb: Config.host + 'getNB.do',
    start: Config.host + 'game/start.do',
    updateNU: Config.host + 'game/update.do',
    share: Config.host + 'send/SinaBlog.do',
    high: Config.host + 'search/highestrank.do',
    day: Config.host + 'search/dayrank.do',
    total: Config.host + 'search/totalrank.do'
};

//人物是否解锁
Config.roleSelect = [true, false, false];
Config.roleLock = [0, 5000, 8000];

//账号流量币数
Config.flowCoin = 0;

Config.score = {
    total: 0,
    high: 0,
    now: 0
};

Config.downURL = ['http://fusion.qq.com/cgi-bin/qzapps/unified_jump?appid=10371868', 'https://itunes.apple.com/cn/app/id826339722?mt=8', 'http://nb.189.cn/'];
Config.regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

Config.isLogin = false;

Config.UserGetCoin = 0;

//奖励: 2000分  是否领取  牛币数
Config.award = [[2000, 0, 1], [8000, 0, 2], [30000, 0, 3], [80000, 0, 4], [200000, 0, 6], [400000, 0, 10]];


//游戏主界面
Config.LINK_COMBO = ['', '', '', 'cool', 'good', 'great', 'perfect'];
Config.BASE_SCORE = 50;//基准分数
Config.PROPERTY_SCORE = 200;//道具分数
Config.ROLE_ARRAY = ['niushi', 'saoshi', 'lashi', 'xiashi'];//角色集合
Config.PUZZLE_ARRAY = [['puzzle-1', 'puzzle-2'], ['puzzle-2', 'puzzle-3'], ['puzzle-3', 'puzzle-4']];//迷惑物
Config.ENCOURAGE_TIME = 5;//奖励5s
Config.PUNISH_TIME = 5;//扣时间值，5s
Config.TOTAL_TIME = 60;//游戏总时间
Config.PROPERTY_ARRAY = ['coin', 'clear', 'bomb'];//道具
Config.MAX_SPEED = 40;//最大速度
Config.MIN_SPEED = 10;//最小速度
Config.CLEAR_NUM = 3;//清屏数
Config.CORRECT_ROLE_GROUP = [
    {
        groupSrc: '#icon_niushi_saoshi.png',
        sign: '#icon_heart.png',
        groupConent: ['niushi', 'saoshi'],
        bg: '/res/main_bg1.png',
        cr: cc.color(239, 82, 82, 255),
        speed: 10,
        score: 50
    },
    {
        groupSrc: '#icon_niushi_xiashi.png',
        sign: '#icon_soap.png',
        groupConent: ['niushi', 'xiashi'],
        bg: '/res/main_bg2.png',
        cr: cc.color(255, 255, 255),
        speed: 13,
        score: 60
    },
    {
        groupSrc: '#icon_niushi_lashi.png',
        sign: '#icon_stone.png',
        groupConent: ['niushi', 'lashi'],
        bg: '/res/main_bg3.png',
        cr: cc.color(197, 89, 46),
        speed: 16,
        score: 80
    }
];
