

var t = 0;
const backgroundColor = "rgb(50, 50, 45)";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

function resizeCanvas() {
	canvas.width = window.innerWidth * 3 / 4;
	console.log("resiz");
}

window.onresize = resizeCanvas;
resizeCanvas();

var showPosition = {state:true};
var showDirection = {state:true};
var showWind = {state:false};
var showTemperature = {state:false};
var showPressure = {state:false};

function bindCheckBox(id, flag) {
	document.getElementById(id).onclick = function() {
		if(flag.state) {
			flag.state = false;
		} else {
			flag.state = true;
		}
	}
}

bindCheckBox("position", showPosition);
bindCheckBox("direction", showDirection);
bindCheckBox("wind", showWind);
bindCheckBox("temperature", showTemperature);
bindCheckBox("pressure", showPressure);

function drawRect({x, y, width, height, color="white"}) {
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
}

function drawCircle({x, y, radius, color="white"}) {
	context.beginPath();
	context.arc(x, y, radius, 0, 2 * Math.PI);
	context.fillStyle = color;
	context.fill();
	context.stroke();
}

function drawArrow({x, y, dir, mag, color="white"}) {

	context.lineWidth = 1;
	context.beginPath();
	context.moveTo(x, y);

	let tip = {
		x: x + mag * Math.cos(dir * Math.PI / 180), 
		y: y + mag * Math.sin(dir * Math.PI / 180)
	}

	context.lineTo(tip.x, tip.y);

	context.lineTo(
		tip.x - (mag / 3) * Math.cos((dir + 30) * Math.PI / 180),
		tip.y - (mag / 3) * Math.sin((dir + 30) * Math.PI / 180),
	)
	context.moveTo(tip.x, tip.y);
	context.lineTo(
		tip.x - (mag / 3) * Math.cos((dir - 30) * Math.PI / 180),
		tip.y - (mag / 3) * Math.sin((dir - 30) * Math.PI / 180),
	)
	context.strokeStyle = color;
	context.stroke();
}

function drawScene() {

	let width = canvas.width;
	let height = canvas.height;
	let size = dataset.index.length;

	// clear screen
	drawRect({x:0, y:0, width:width, height:height, color:backgroundColor});

	let x_min = Math.min(...dataset.LON);
	let x_max = Math.max(...dataset.LON);

	let y_min = Math.min(...dataset.LAT);
	let y_max = Math.max(...dataset.LAT);

	let x = dataset.LON[t];
	let y = dataset.LAT[t];

	x_pixel = width * (x - x_min) / (x_max - x_min);
	y_pixel = height * (y - y_min) / (y_max - y_min);

	if(showPosition.state) {
		drawCircle({x:x_pixel, y:y_pixel, radius:10, color:"white"});
	}


	if(showDirection.state && showPosition.state) {
		let dir = 180 * Math.atan2((dataset.LAT[t+1 % size] - y), (dataset.LON[t+1 % size] - x)) / Math.PI;
		drawArrow({x:x_pixel, y:y_pixel, dir:dir, mag:30});
	}

	if(showWind.state) {

		let windDir = (-dataset.WDIR[t]) + 90;
		let windMag = dataset.WSPD[t] * 10;

		let d_width = width / 10;
		let d_height = height / 10;

		for(let i = d_width; i < width; i += d_width) {
			for(let j = d_height; j < height; j += d_height) {
				drawArrow({x:i, y:j, dir:windDir, mag:windMag, color:"lightblue"});
			}
		}
	}
}

function main() {

	drawScene();

}

main();

setInterval(function() {


	do {
		t++;
		if(t > dataset.index.length) {t = 0;}
	} while(dataset.WSPD[t] == 99);





	drawScene();
}, 100);