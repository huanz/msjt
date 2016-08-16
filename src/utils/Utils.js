var Utils = Utils || {};
Utils.doc = document;
Utils.ArrayProto = Array.prototype;
Utils.ObjProto = Object.prototype;
Utils.hasOwn = Utils.ObjProto.hasOwnProperty;
Utils.toString = Utils.ObjProto.toString;
Utils.nativeForEach = Utils.ArrayProto.forEach;
Utils.slice = Utils.ArrayProto.slice;
Utils.nativeKeys = Object.keys;
Utils.nativeIsArray = Array.isArray;

Utils.h = 'y7clyI1R5LGoM338DsJk6Q';
Utils.k = '34';

Utils.isFunction = function (o) {
    return typeof o == "function" || false;
};

Utils.isObject = function (o) {
    var type = typeof o;
    return type === 'function' || type === 'object' && !!o;
};

Utils.isArray = Utils.nativeIsArray || function (obj) {
    return Utils.toString.call(obj) === '[object Array]';
};

Utils.isString = function (o) {
    return typeof o === 'string';
};

Utils.isNotEmptyString = function (s) {
    return Utils.isString(s) && s !== '';
};

Utils.each = function (o, fn, ctx) {
    if (o == null) return;
    if (Utils.nativeForEach && o.forEach === Utils.nativeForEach) {
        o.forEach(fn, ctx);
    } else if (o.length === +o.length) {
        for (var i = 0, l = o.length; i < l; i++) {
            if (i in o && fn.call(ctx, o[i], i, o) === {}) return;
        }
    } else {
        for (var key in o) {
            if (Utils.hasOwn.call(o, key)) {
                if (fn.call(ctx, o[key], key, o) === {}) return;
            }
        }
    }
};

//1000=>1,000
Utils.numberFmt = function (num) {
    if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(num)) {
        return num;
    }
    var a = RegExp.$1,
        b = RegExp.$2,
        c = RegExp.$3,
        re = new RegExp();
    re.compile("(\\d)(\\d{3})(,|$)");
    while (re.test(b)) b = b.replace(re, "$1,$2$3");
    return a + "" + b + "" + c;
};
//1,000=>1000
Utils.fmtNumber = function (str) {
    if (!Utils.isNotEmptyString(str)) return 0;
    return parseInt(str.replace(/,/g, ''), 10);
};

Utils.defaults = function (obj) {
    Utils.each(Utils.slice.call(arguments, 1), function (o) {
        for (var k in o) {
            if (obj[k] == null) obj[k] = o[k];
        }
    });
    return obj;
};

Utils.keys = function (obj) {
    if (!Utils.isObject(obj)) return [];
    if (Utils.nativeKeys) return Utils.nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (Utils.hasOwn.call(obj, key)) keys.push(key);
    return keys;
};

Utils.values = function (obj) {
    var keys = Utils.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
        values[i] = obj[keys[i]];
    }
    return values;
};

Utils.noop = function () { };

Utils.getById = function (id) {
    return Utils.doc.getElementById(id);
};

Utils.getByClass = function (className, parent) {
    return (parent || Utils.doc).getElementsByClassName(className);
};

Utils.getByTag = function (tagName, parent) {
    return (parent || Utils.doc).getElementsByTagName(tagName);
};

Utils.show = function (el) {
    el.style.display = '';
};

Utils.hide = function (el) {
    if (el.length) {
        Utils.each(el, function (ele) {
            ele.style.display = 'none';
        });
    } else {
        el.style.display = 'none';
    }

};

Utils.addClass = function (el, className) {
    el.classList ? el.classList.add(className) : el.className += ' ' + className;
};

Utils.removeClass = function (el, className) {
    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
};

Utils.html = function (el, html) {
    if (html) {
        el.innerHTML = html;
    } else {
        return el.innerHTML;
    }
    return el;
};
Utils.empty = function (el) {
    if (el.length) {
        Utils.each(el, function (ele) {
            ele.innerHTML = '';
        });
    } else {
        el.innerHTML = '';
    }
    return el;
}

Utils.cutstr = function (str, len) {
    var temp,
        icount = 0,
        patrn = /[^\x00-\xff]/,
        strre = "";
    for (var i = 0; i < str.length; i++) {
        if (icount < len - 1) {
            temp = str.substr(i, 1);
            if (patrn.exec(temp) == null) {
                icount = icount + 1;
            } else {
                icount = icount + 2;
            }
            strre += temp
        } else {
            break;
        }
    }
    if (str == strre) {
        return strre;
    } else {
        return strre + "...";
    }
};

Utils.clamp = function (n, min, max) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
};

Utils.Progress = {};

Utils.Progress.settings = {
    minimum: 0.1,
    trickle: true,
    trickleRate: 0.3,
    trickleSpeed: 100
};

Utils.Progress.status = null;

Utils.Progress.set = function (n) {
    var progress = Utils.Progress;
    n = Utils.clamp(n, progress.settings.minimum, 1);
    progress.status = n;
    progress.cb(progress.status);
    return this;
};

Utils.Progress.inc = function (amount) {
    var progress = Utils.Progress,
        n = progress.status;
    if (!n) {
        return progress.start();
    } else {
        amount = (1 - n) * Utils.clamp(Math.random() * n, 0.1, 0.95);
        n = Utils.clamp(n + amount, 0, 0.994);
        return progress.set(n);
    }
};

Utils.Progress.trickle = function () {
    var progress = Utils.Progress;
    return progress.inc(Math.random() * progress.settings.trickleRate);
};

Utils.Progress.start = function (cb) {
    var progress = Utils.Progress;
    progress.cb = cb || Utils.noop;
    if (!progress.status) progress.set(0);

    var timer = function () {
        if (progress.status === 1) {
            clearTimeout(timer);
            timer = null;
            return;
        }
        progress.trickle();
        work();
    };

    var work = function () {
        setTimeout(timer, progress.settings.trickleSpeed);
    };
    if (progress.settings.trickle) work();
    return this;
};

Utils.Progress.done = function () {
    var progress = Utils.Progress;
    return progress.inc(0.3 + 0.5 * Math.random()).set(1);
};

Utils.decode = decodeURIComponent;
Utils.encode = encodeURIComponent;

Utils.formData = function (o) {
    var kvps = [], regEx = /%20/g;
    for (var k in o) kvps.push(Utils.encode(k).replace(regEx, "+") + "=" + Utils.encode(o[k].toString()).replace(regEx, "+"));
    return kvps.join('&');
};

Utils.ajax = function (o) {
    var xhr = cc.loader.getXMLHttpRequest();
    o = Utils.defaults(o, { type: "GET", data: null, dataType: 'json', progress: null, contentType: "application/x-www-form-urlencoded" });
    if (o.progress) Utils.Progress.start(o.progress);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status < 300) {
                var res;
                if (o.dataType == 'json') {
                    res = window.JSON ? window.JSON.parse(xhr.responseText) : eval(xhr.responseText);
                } else {
                    res = xhr.responseText;
                }
                if (!!res) o.success(res);
                if (o.progress) Utils.Progress.done();
            } else {
                if (o.error) o.error(xhr, xhr.status, xhr.statusText);
            }
        }
    };
    //if("withCredentials" in xhr) xhr.withCredentials = true;
    var url = o.url, data = null;
    var isPost = o.type == "POST" || o.type == "PUT";
    if (o.data && typeof o.data == 'object') {
        data = Utils.formData(o.data);
    }
    if (!isPost && data) {
        url += "?" + data;
        data = null;
    }
    xhr.open(o.type, url, true);
    if (isPost) {
        xhr.setRequestHeader("Content-Type", o.contentType);
    }
    xhr.send(data);
    return xhr;
};

Utils.get = function (url, data, success) {
    if (Utils.isFunction(data)) {
        success = data;
        data = null;
    }
    Utils.ajax({ url: url, type: "GET", data: data, success: success });
};

Utils.post = function (url, data, success) {
    if (Utils.isFunction(data)) {
        success = data;
        data = null;
    }
    Utils.ajax({ url: url, type: "POST", data: data, success: success });
};

Utils.encrypt = function (key, word) {
    var word = word + '';
    var salt = CryptoJS['enc']['Hex']['parse']('4acfedc7dc72a9003a0dd721d7642bde');
    var iv = CryptoJS['enc']['Hex']['parse']('69135769514102d0eded589ff874cacd');
    var gkey = CryptoJS['PBKDF2'](key, salt, { 'keySize': 128 / 32, 'iterations': 100 });
    var encrypted = CryptoJS['AES']['encrypt'](word, gkey, { 'iv': iv, 'mode': CryptoJS['mode']['CBC'], 'padding': CryptoJS['pad']['Pkcs7'] });
    return encrypted.toString();
};

Utils.decrypt = function (key, encrypted) {
    var salt = CryptoJS['enc']['Hex']['parse']('4acfedc7dc72a9003a0dd721d7642bde');
    var iv = CryptoJS['enc']['Hex']['parse']('69135769514102d0eded589ff874cacd');
    var key = CryptoJS['PBKDF2'](key, salt, { 'keySize': 128 / 32, 'iterations': 100 });
    var decrypt = CryptoJS['AES']['decrypt'](encrypted, key, { 'iv': iv, 'mode': CryptoJS['mode']['CBC'], 'padding': CryptoJS['pad']['Pkcs7'] });
    return decrypt.toString(CryptoJS['enc']['Utf8']);
};

Utils.now = Date.now || function () {
    return new Date().getTime();
};

Utils.same = function (s) {
    return s;
};

Utils.parseCookieString = function (text) {
    var cookies = {};

    if (Utils.isString(text) && text.length > 0) {
        var cookieParts = text.split(/;\s/g);
        var cookieName;
        var cookieValue;
        var cookieNameValue;

        for (var i = 0, len = cookieParts.length; i < len; i++) {

            // Check for normally-formatted cookie (name-value)
            cookieNameValue = cookieParts[i].match(/([^=]+)=/i);
            if (cookieNameValue instanceof Array) {
                try {
                    cookieName = Utils.decode(cookieNameValue[1]);
                    cookieValue = cookieParts[i].substring(cookieNameValue[1].length + 1);
                } catch (ex) {
                    // Intentionally ignore the cookie -
                    // the encoding is wrong
                }
            } else {
                // Means the cookie does not have an =", so treat it as
                // a boolean flag
                cookieName = Utils.decode(cookieParts[i]);
                cookieValue = '';
            }

            if (cookieName) {
                cookies[cookieName] = cookieValue;
            }
        }

    }

    return cookies;
}

Utils.getCookie = function (name) {
    if (!Utils.isNotEmptyString(name)) {
        throw new TypeError('Cookie name must be a non-empty string');
    }
    var cookies = Utils.parseCookieString(document.cookie);
    return cookies[name];
};

Utils.setCookie = function (name, value, options) {
    if (!Utils.isNotEmptyString(name)) {
        throw new TypeError('Cookie name must be a non-empty string');
    }
    options = options || {};
    var expires = options['expires'];
    var domain = options['domain'];
    var path = options['path'];

    if (!options['raw']) {
        value = Utils.encode(String(value));
    }

    var text = name + '=' + value;

    // expires
    var date = expires;
    if (typeof date === 'number') {
        date = new Date();
        date.setDate(date.getDate() + expires);
    }
    if (date instanceof Date) {
        text += '; expires=' + date.toUTCString();
    }

    // domain
    if (Utils.isNotEmptyString(domain)) {
        text += '; domain=' + domain;
    }

    // path
    if (Utils.isNotEmptyString(path)) {
        text += '; path=' + path;
    }

    // secure
    if (options['secure']) {
        text += '; secure';
    }

    document.cookie = text;
    return text;
};

Utils.removeCookie = function (name, options) {
    options = options || {};
    options['expires'] = new Date(0);
    return Utils.setCookie(name, '', options);
};

Utils.openAudio = function ($el) {
    if (Config.audioOpen) {
        try {
            $el.play();
        } catch (e) { }
    }
};

Utils.closeAudio = function ($el) {
    if (Config.audioOpen) {
        try {
            $el.currentTime = 0;
            $el.pause();
        } catch (e) { }
    }
};

Utils.pauseAudio = function ($el) {
    if (Config.audioOpen) {
        try {
            $el.pause();
        } catch (e) { }
    }
};

Utils.switchAudio = function ($close, $open) {
    if (Config.audioOpen) {
        try {
            $close.pause();
            $open.play();
        } catch (e) { }
    }
};

/*Utils.randNum = function(s, e){
    return Math.round(Math.random()*(e-s+1)+s);
};

Utils.shareRank = function(){
    var preTime = Utils.getCookie('preTime'),
        preScore = Utils.getCookie('preScore'),
        preRank = Utils.getCookie('preRank'),
        nowScore = Config.score.now,
        nowRank = 0,
        now = Utils.now();

    if(preScore) preScore = parseInt(preScore, 10);
    if(preRank) preRank = parseInt(preRank, 10);

    if(preRank && preTime && (now-preTime)<60000){
        nowRank = preRank+Utils.randNum(0, 10);
        Utils.setCookie('preTime', now);
        Utils.setCookie('preRank', nowRank);
        return nowRank;
    }

    if(nowScore){
        nowRank = preRank ? (nowScore > preScore) ? Utils.randNum(preRank-1000, preRank+5000) : Utils.randNum(preRank-5000, preRank+1000) : Utils.randNum(5000, 50000);
    }else{
        nowRank = preRank ? Utils.randNum(preRank, preRank+2000): Utils.randNum(2000, 8000);
    }
    nowRank = Math.abs(nowRank);
    Utils.setCookie('preTime', now);
    Utils.setCookie('preRank', nowRank);
    return nowRank;
};*/
