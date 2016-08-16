/**
 * 将plist合并成一个加载
 */
cc._pkgJsonLoader = {
    KEY: {
        frames: 0,
        rect: 0, size: 1, offset: 2, rotated: 3, aliases: 4,
        meta: 1,
        image: 0
    },
    _parse: function (data) {
        var KEY = this.KEY;
        var frames = {}, meta = data[KEY.meta] ? { image: data[KEY.meta][KEY.image] } : {};
        var tempFrames = data[KEY.frames];
        for (var frameName in tempFrames) {
            var f = tempFrames[frameName];
            var rect = f[KEY.rect];
            var size = f[KEY.size];
            var offset = f[KEY.offset];
            frames[frameName] = {
                rect: { x: rect[0], y: rect[1], width: rect[2], height: rect[3] },
                size: { width: size[0], height: size[1] },
                offset: { x: offset[0], y: offset[1] },
                rotated: f[KEY.rotated],
                aliases: f[KEY.aliases]
            }
        }
        return { _inited: true, frames: frames, meta: meta };
    },
    load: function (realUrl, url, res, cb) {
        var self = this, locLoader = cc.loader, cache = locLoader.cache;
        locLoader.loadJson(realUrl, function (err, pkg) {
            if (err) return cb(err);
            var dir = cc.path.dirname(url);
            for (var key in pkg) {
                var filePath = cc.path.join(dir, key);
                cache[filePath] = self._parse(pkg[key]);
            }
            cb(null, true);
        });
    }
};
cc.loader.register(["pkgJson"], cc._pkgJsonLoader);