const fs = require('fs');
var obj;
fs.readFile('location.json', 'utf8', function(err, data){
    if(err) throw err;
    obj = JSON.parse(data);


    obj = obj.gpx.trk.trkseg.trkpt;

    let totdist=0;
    let elegain=0;
    let maxspeed=0;
    let movtime=0;
    let maxgain=0;
    let mingain=10000000;
for(let i=0; i<obj.length-1; i++){
    let dis= distance(Number(obj[i]['-lat']), Number(obj[i]['-lon']), Number(obj[i+1]['-lat']), Number(obj[i+1]['-lon']))
    totdist+=dis; 
    // if(i===0){ console.log(Number(obj[i]['-lat']));}
    if(mingain>Number(obj[i]['ele'])){
        mingain=Number(obj[i]['ele']);
    }
        if(maxgain<Number(obj[i]['ele'])){
        maxgain=Number(obj[i]['ele']);
    }

    var d1 = new Date(obj[i]['time']),
    d2 = new Date(obj[i+1]['time']);
    var diff = d2 - d1;
    let timediff = Math.floor(diff / 1e3);
    let speed = dis / timediff;
    if(speed>maxspeed){
        maxspeed=speed;
    }
    if(dis > 0){
        movtime += timediff;
    }
}

if(mingain>Number(obj[obj.length-1]['ele'])){
        mingain=Number(obj[obj.length-1]['ele']);
    }
        if(maxgain<Number(obj[obj.length-1]['ele'])){
        maxgain=Number(obj[obj.length-1]['ele']);
    }

    elegain=maxgain-mingain;
    

var dd1 = new Date(obj[0]['time']),
    dd2 = new Date(obj[obj.length-1]['time']);
    var totaldiff = dd2 - dd1;
    let totaltimediff = Math.floor(totaldiff / 1e3);


let averagespeed = totdist / totaltimediff;

function distance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344 *1000;
    return dist;
}
console.log('Total Distance in metres: ' + totdist);
console.log("Max speed in m/s: " + maxspeed);
console.log("Average speed in m/s: " + averagespeed);
console.log("Elevation gained in metres: "+elegain);
console.log("Moving time in seconds: "+movtime);
console.log("Total time in sec: "+totaltimediff);
    });