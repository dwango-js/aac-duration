"use strict";
var fs = require("fs");

var sampleList = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, undefined, undefined, undefined, undefined];

function getSample(adts) {
	var a = ("000" + parseInt(adts[4], 16).toString(2)).slice(-4);
	var b = ("000" + parseInt(adts[5], 16).toString(2)).slice(-4);
	return sampleList[parseInt((a[2] + a[3] + b[0] + b[1]), 2)];
}

module.exports = function (file) {
	var d = fs.readFileSync(file);
	var ds = "";
	for(var i = 0; i < d.length; i++) {
		ds += d[i].toString(16);
	};
	var id = ds.substr(0, 4);
	if (id != "fff9" && id != "fff1") {
		throw new Error("not aac");
	}
	var list = ds.split(ds.substr(0, 7));

	var adts = ds.substr(0, 48);

	var sample = getSample(adts);
	if (!sample) {
		throw new Error("error sampling late");
	}

	return 1000 / sample * 1024 * list.length / 1000;
};
