var StreamObject = require("stream-json/utils/StreamObject");
var stream = StreamObject.make();
var fs = require("fs");
var geolib = require("geolib");
var distance=0;
var totaltime=0;
var movingtime=0;
var maxspeed=0;
var maxe=0;
var mine=0;
stream.output.on("data", function(object){
  	var obj = object.value.trk.trkseg.trkpt;
	totaltime = new Date(obj[0]['time']);
	maxe=obj[0]['ele'];
	mine=obj[0]['ele'];
	for(var i=1;i<obj.length;i++){
		maxe=Math.max(maxe,obj[i]['ele']);
		mine=Math.min(mine,obj[i]['ele']);
		var dis=geolib.getDistance(
    							{latitude: obj[i]['-lat'] , longitude: obj[i]['-lon']},
    							{latitude: obj[i-1]['-lat'], longitude: obj[i-1]['-lon']}
							);
		distance=distance+dis;
		var time =new Date(obj[i]['time']) - new Date(obj[i-1]['time']);
		maxspeed= Math.max(maxspeed,dis/time);
		if(time > 0) movingtime=movingtime+time;
	}
	totaltime = new Date(obj[obj.length-1]['time'])-totaltime;
	

});
stream.output.on("end", function(){
  console.log("distance = ", distance/1000);
  console.log("Average speed = ", distance/(totaltime/1000));
  console.log("max speed = ", maxspeed*1000);
  console.log("travel time = ", totaltime/1000);
  console.log("moving time = ", movingtime/1000);
  console.log("Total ele = ", maxe-mine);
});
fs.createReadStream('location.json').pipe(stream.input);
