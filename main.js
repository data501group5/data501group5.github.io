

var t = 0;
const backgroundColor = "rgb(50, 50, 45)";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

function resizeCanvas() {
	canvas.width = window.innerWidth * 3 / 4;
	// console.log("resiz");
}

window.onresize = resizeCanvas;
resizeCanvas();

document.getElementById("slider").oninput = function() {
	t = this.value;
}

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

function lerp(p1, p2, alpha) {
	return p1 + alpha * (p2 - p1);
}


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

	let t_int = Math.floor(t);
	let t_float = t - t_int;

	let p1 = {x:dataset.LON[t_int], y:dataset.LAT[t_int]};
	let p2 = {x:dataset.LON[(t_int+1) % size], y:dataset.LAT[(t_int+1) % size]};

	// let x = dataset.LON[t];
	// let y = dataset.LAT[t];

	let x = lerp(p1.x, p2.x, t_float);
	let y = lerp(p1.y, p2.y, t_float);

	x_pixel = width * (x - x_min) / (x_max - x_min);
	y_pixel = height * (y - y_min) / (y_max - y_min);

	if(showPosition.state) {
		drawCircle({x:x_pixel, y:y_pixel, radius:10, color:"white"});
	}

	// console.log(t_int)

	if(showDirection.state && showPosition.state) {
		let dir = 180 * Math.atan2((dataset.LAT[(t_int+1) % size] - y), (dataset.LON[(t_int+1) % size] - x)) / Math.PI;
		drawArrow({x:x_pixel, y:y_pixel, dir:dir, mag:30});
	}

	if(showWind.state) {



		let windDir = (-lerp(dataset.WDIR[t_int], dataset.WDIR[(t_int+1)%size], t_float)) + 90;
		let windMag = lerp(dataset.WSPD[t_int], dataset.WSPD[(t_int+1)%size], t_float) * 10;

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

// 0 to 1
let lerpSpeed = 0.1;

setInterval(function() {


	do {
		t += lerpSpeed;
		if(t > dataset.index.length) {t = 0;}
	} while(dataset.WSPD[t] == 99);


	document.getElementById("slider").value = t;


	drawScene();
}, 100 * lerpSpeed);