let pipesEl = document.getElementById("pipes");
let matrixEl = document.getElementById("matrix");
let rainEl = document.getElementById("rain");
let T1El = document.getElementById("terminal1");
let T2El = document.getElementById("terminal2");

let matrixChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789#$%^&*()*&^%+-/~{[|`]}".split("");
let rainChars = "::;'|||    ".split("");

function randomColors(amount = 1){return Array(amount).fill("0").map(x=>{return "#"+(Math.random()*0xFFFFFF<<0).toString(16)});}

// Default terminal colors
let DTC = {
    "default":"#AAAAAA",
    "lStart":"#6AC44B",
    "dump":"#617e91"
};

let matrix1 = new rain(matrixEl, matrixChars, 6, {"first":"#ffffff","colors":["#00d17d"]}, "matrix_code_nfiregular", 20, 40);
let rain1 = new rain(rainEl, rainChars, 33, {"colors":["#008bd1", "#00abd1"]}, "Inconsolata", 20, 20);
let pipe1 = new pipeRenderer(pipesEl, 10, 10, 3, 250, 50, randomColors(10))//, ["#FF0000", "#EE0044", "#663388"]);
let terminal1 = new terminal(T1El, "Fjotrolf", DTC, "Inconsolata", 20);
let terminal2 = new terminal(T2El, "SSH@Server", DTC, "Inconsolata", 15);

let colorInstances = {
	"matrix1":matrix1,
	"rain1":rain1,
	"pipe1":pipe1,
	// "terminal1":terminal1,
	// "terminal2":terminal2
};

if(navigator.userAgent.includes("Mobile")){
	terminal1.command("codedump --cont");
	terminal2.command("tree --cont");
}