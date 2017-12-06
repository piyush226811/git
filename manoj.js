var ReadJSONStream =require('read-json-stream').default;
//var math = require('Math');
var rad = 6371e3;
var dis = function(plat,plon,palt,flat,flon,falt){
	let x2 = Math.PI/180.0;
	palt=rad;falt=rad;
	let x1=palt*Math.cos(plat*x2)*Math.sin(plon*x2);
	let y1=palt*Math.sin(plat*x2);
	let z1=palt*Math.cos(plat*x2)*Math.cos(plon*x2);
	let x3=falt*Math.cos(flat*x2)*Math.sin(flon*x2);
	let y2=falt*Math.sin(flat*x2);
	let z2=falt*Math.cos(flat*x2)*Math.cos(flon*x2);
	return Math.sqrt((x3-x1)**2+(y2-y1)**2+(z2-z1)**2);
}
var tot_d=0;
var max_s=0;
var avg_s=0;
var ele_g=0;
var mov_t=0;
var tot_t=0;
var tot_s=0;
ReadJSONStream('input.json').done((err,data) => {
	if(err){
		console.log('there is an error');
	}
	else{
		let array = data.gpx.trk.trkseg.trkpt;
		let plat=array[0]['-lat'];
		let plon=array[0]['-lon'];
		let palt=array[0].ele;
		let ptime=array[0].time;
		let max_e=Number(palt);
		let min_e=Number(palt);
		for(var i=1;i<array.length;i++){
			let flat=array[i]['-lat'];
			let flon=array[i]['-lon'];
			let falt=array[i].ele;
			max_e=Math.max(max_e,falt);
			min_e=Math.min(min_e,falt);
			let ftime=array[i].time;
			let dis_m=dis(plat,plon,palt,flat,flon,falt);
			tot_d+=dis_m;
			let tim_e=(new Date(ftime)-new Date(ptime))/1000;
			tot_t+=tim_e;
			if(dis_m!==0){
				mov_t+=tim_e;
			}
			let speed=dis_m/tim_e;
			max_s=Math.max(speed,max_s);
			tot_s+=speed*tim_e;
			plat=flat;plon=flon;palt=falt;ptime=ftime;
		}
		console.log(max_e+" "+min_e);
		console.log("total distance : "+tot_d);
		console.log("maximum speed : "+max_s);
		console.log("average speed : "+tot_s/tot_t);
		console.log("gain in elevation : "+(max_e-min_e));
		console.log("moving time : "+mov_t);
		console.log("total time : "+tot_t);
		console.log("p_ended");
	}
})

