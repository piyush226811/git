var StreamObject = require("stream-json/utils/StreamObject");
const path = require('path');
const fs = require('fs');
var stream = StreamObject.make();
 
stream.output.on("data", function(object){
  var obj= object.value.trk.trkseg.trkpt;
  var distance = 0;
  var h = 0;
  var j = obj[0]['ele'];
  var k = obj[0]['ele'];
  var time=0;
   for(var i=1;i< obj.length;i++){
    var a = obj[i-1]['-lat'];
    var b = obj[i-1]['-lon'];
    var c = obj[i]['-lat'];
    var d = obj[i]['-lon'];
    var e = getDistanceFromLatLonInKm(a,b,c,d);
    var f = (new Date(obj[i]['time'])-new Date(obj[i-1]['time']))*0.001;
    var g = (e*1000)/f;
    h = Math.max(h,g);
    j = Math.min(j,obj[i]['ele']);
    k= Math.max(k,obj[i]['ele']);
    distance += e;
    if(e !== 0){
        time+=f;
    }
  }
  var Max_speed = h;
  var Total_time = (new Date(obj[obj.length -1]['time'])-new Date(obj[0]['time']))*0.001;
  var Average_speed = 1000*(distance/Total_time);
  var Elevation_max = k-j;
  console.log("Total Distance = ",distance);
  console.log("Max Speed = ",Max_speed);
  console.log("Average Speed = ",Average_speed);
  console.log("Elevation Gained = ",Elevation_max);
  console.log("Moving time = ",time);
  console.log("Total Time = ",Total_time);
});
stream.output.on("end", function(){
  console.log("done");
});
 
let filename = path.join(__dirname, 'location.json');
fs.createReadStream(filename).pipe(stream.input);

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371;
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}