var fs = require('fs');
var basePath = "E:\\project\\2017\\21水科院减灾中心\\客户提供测试数据\\降雨数据\\";
var name = 'basin_realtime_2017082861200';
var file_suf = '.bin';
var filepath = basePath + name + file_suf;
var res_suf = '.json';
var respath = basePath + name + res_suf;

fs.readFile(filepath, function (err, byteRead) {
	if (err) throw err;
	// var buff = new Buffer(byteRead);
	// var time = byteRead.splic
	//var code1 = byteRead.isEncoding('utf8');
	var feaNum = byteRead.readUInt32LE(16);
	var start = 20;
	var result = [];
	fs.writeFile(respath, "", 'utf8');
	for (var i = 0; i < feaNum; i++) {
		var end = start + 16;
		var code = byteRead.toString('utf8', start, end);
		var rain = byteRead.readFloatLE(end);
		start = end + 4;
		var res = {
			wscd: code,
			rain: rain
		};
		result.push(res);
	}
	result = JSON.stringify(result);
	fs.appendFile(respath, result, 'utf8', function (err) {
		if (err) {
			console.log(err)
		} else {
			console.log('完成');
		}

	});

})