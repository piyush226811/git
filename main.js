// var fs = require('fs');
 
// // fs.readFileSync('input.txt', 'utf8', function(err, contents) {
// //            console.log(contents);

// // });
// console.log(new Date());

// console.log(fs.readFileSync('location.json','utf8'));

// console.log(new Date());

// console.log('after calling readFile');
// var fs = require('fs');
// console.log(new Date()); 
// fs.readFile('location.json', 'utf8', function(err, contents) {
//     console.log(contents);
// });
//  console.log(new Date());
// console.log('after calling readFile');
var fs = require('fs');
var obj;
var a;
fs.readFile('location.json', 'utf8', function (err, data) {
  if (err) throw err;
  else obj = JSON.parse(data);

  a=obj.gpx.trk.trkseg.trkpt;
  console.log(a[0]);
  function distance(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }

var p0=a[0]['-lat'];
var q0=a[0]['-lon'];
var minele=a[0].ele;
var maxele=a[0].ele;
var d=0;
var maxspeed=0;
var avgspeed=0;
var timeelp=0;
var t0= new Date(a[0].time);
var movtime=0;

for (var i =0;i<a.length-1;i++) {
var t1= new Date(a[i+1].time);
var p1=a[i+1]['-lat'];
var q1=a[i+1]['-lon'];
var di=distance(p0,q0,p1,q1);
d=d + di;
if()
var ti=(t1-t0)/1000;
speed=di/ti;
timeelp=timeelp+ti;

if(di!=0)movtime=movtime+ti;
else ti=ti;  
if(speed>maxspeed) maxspeed=speed;
else maxspeed=maxspeed;
var p0=p1;
var q0=q1;
var t0=t1;
}
avgspeed=d/timeelp;
console.log('total distance in km='+d);
console.log('maxspeed='+maxspeed);
console.log('time elapsed='+timeelp);
console.log('avgspeed='+avgspeed);
console.log('movtime='+movtime);

});

