var t = 0;
const backgroundColor = "rgb(50, 50, 45)";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

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

function drawScene() {

	let width = canvas.width;
	let height = canvas.height;

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

	console.log(x_max, x_min)
	console.log(x_pixel, y_pixel)

	drawCircle({x:x_pixel, y:y_pixel, radius:10, color:"white"});
}

function main() {
	// console.log("Hello World");

	

	drawScene();

}

main();

setInterval(function() {
	t++;

	if(t > dataset.index.length) {t = 0;}

	drawScene();
}, 100);