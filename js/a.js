var fs = require('fs');
var respath = 'result.txt';
fs.readFile('data/basin_realtime_2017082857600.bin', function (err, byteRead) {
    if (err) throw err;
    // var buff = new Buffer(byteRead);
    // var time = byteRead.splic
    //var code1 = byteRead.isEncoding('utf8');
	var feaNum = byteRead.readUInt32LE(16);
	var start = 20;
	var result = '';
	fs.writeFile(respath,"",'utf8');
	for(var i=0;i<feaNum;i++){
		var end = start+16;
		var code = byteRead.toString('utf8',start,end);
		var rain = byteRead.readFloatLE(end);
		start = end+4;
		result+=code+","+rain+"\r\n";
	}
	fs.appendFile(respath,result,'utf8',function(err){
		if(err){
			console.log(err)
		}
	});
	
})