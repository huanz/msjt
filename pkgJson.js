/**
 * Created by yhz on 2014/12/08.
 */

var fs = require('fs');
var plist = require('plist');
var pkgJson = {};

//var src = "res/*.plist";
//node pkgJson
fs.readdir('./res', function (err, files) {
    if (err) {
        throw err;
    }
    for (var i = files.length - 1; i >= 0; i--) {
		var file = files[i],
			ext = file.split('.')[1];
		if (ext === 'plist') {
			pkgJson[file] = [];
			pkgJson[file][0] = {};
			var data = fs.readFileSync('./res/' + file, 'UTF-8');
			var frames = plist.parse(data.toString()).frames;
			var fileName = Object.keys(frames);
			for (var j = 0; j < fileName.length; j++) {
				var dat = pkgJson[file][0][fileName[j]] = [];
				var frame = frames[fileName[j]];
				dat[0] = frame.frame.replace(/{|}/g, '').split(',');
				dat[1] = frame.sourceSize.replace(/{|}/g, '').split(',');
				dat[2] = frame.offset.replace(/{|}/g, '').split(',');
                if (frame.rotated) dat[3] = 1;
			}
		}
    };
    fs.writeFile('./res/plists.pkgJson', JSON.stringify(pkgJson), function (err) {
		if (err) throw err;
		console.log('done!');
	});
});