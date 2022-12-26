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
    "error":"#C44B4B",
    "spitt":"#617e91"
};

new rain(matrixEl, matrixChars, 6, {"first":"#ffffff","colors":["#00d17d"]}, "matrix_code_nfiregular", 20, 40);
new rain(rainEl, rainChars, 33, {"colors":["#008bd1", "#00abd1"]}, "Inconsolata", 20, 20);
let p = new pipeRenderer(pipesEl, 10, 10, 3, 250, 50, randomColors(10))//, ["#FF0000", "#EE0044", "#663388"]);
new terminal(T1El, "Fjotrolf", DTC, "Inconsolata", 20);
new terminal(T2El, "SSH@Server", DTC, "Inconsolata", 15);