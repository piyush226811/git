"use strict";

var distance = function(lat1,lat2,lon1,lon2){
var R = 6371e3; // metres
var φ1 = lat1*Math.PI / 180;
var φ2 = lat2*Math.PI / 180;
var Δφ = (lat2-lat1)*Math.PI / 180;
var Δλ = (lon2-lon1)*Math.PI / 180;

var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

var d = R * c;
return d;
};

// const makeSource = require("stream-json");
// let source = makeSource();

const StreamObject = require("stream-json/utils/StreamObject");
const stream = StreamObject.make();
const fs = require('fs');

let count = 0;
/*source.on('startObject', function(chunk){ 
 if(count<=10){
 	console.log(chunk);
 }
 ++count; });

source.on('end', function(){
 console.log("Found ",count," Objects" );
});
*/
stream.output.on("data", function(object){
	let array = object.value.trk.trkseg.trkpt;

    let total_dis = 0;
	let cur_dis = 0;
	let max_speed = 0;
	let aver_speed = 0;
	let cur_speed = 0;
	let ele_gain = 0 ;
	let max_ele = Number(array[0].ele);
	let min_ele = Number(array[0].ele);
	//let Ele_gain = array[array.length-1].ele - array[0].ele;
	let total_time = 0;
	let cur_time = 0;
	let idle_time = 0;
	for (let i = 1; i < array.length; i++) {
		cur_dis = Math.abs(distance(array[i]['-lat'],array[i-1]['-lat'],array[i]['-lon'],array[i-1]['-lon']) );
		total_dis += cur_dis;

		let t2 = new Date(array[i].time);
		let t1 = new Date(array[i-1].time);
		cur_time = t2 - t1;
		if(cur_dis == 0){
			idle_time += cur_time;
		}

		total_time += cur_time;
		cur_speed = cur_dis / cur_time;
		if(cur_speed > max_speed ) max_speed = cur_speed

		let ele_dif = array[i].ele - array[i-1].ele;
		if(ele_dif > 0){ ele_gain += ele_dif; }

	
		if(Number(array[i].ele) < min_ele){
			min_ele = Number(array[i].ele);
		}

		if(Number(array[i].ele) > max_ele){
			max_ele = Number(array[i].ele);
		}

	}
	total_time *= 0.001;
	console.log("Total Distance ",total_dis);
	console.log("Max Speed ", max_speed*1000);
	console.log("Average Speed ", total_dis/total_time);
	console.log("Elevation Gained ",max_ele - min_ele);
	console.log("Moving Time ", total_time - idle_time);
	console.log("Total Time ", total_time);
});

stream.output.on("end",function(){
	console.log("ended");
});
fs.createReadStream("location.json").pipe(stream.input);

