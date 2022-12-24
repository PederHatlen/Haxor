let matrixEl = document.getElementById("matrix");
let rainEl = document.getElementById("rain");

let matrixChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789#$%^&*()*&^%+-/~{[|`]}".split("");
let rainChars = "::;'|||    ".split("");

function randomCharacter(chars){return chars[Math.floor(Math.random()*chars.length)];}

function renderRain(subject){
	subject.ctx.fillStyle = "rgba(0, 0, 0, "+(subject.alpha/100)+")";
	subject.ctx.fillRect(0, 0, subject.el.width, subject.el.height);	

	for(let i = 0; i < subject.drops.length; i++){
		const drop = subject.drops[i];
		subject.ctx.fillStyle = subject.color;
		subject.ctx.fillText(drop[1], i*subject.size, drop[0]*subject.size);

		var text = randomCharacter(subject.chars);
		drop[0]++;
		drop[1] = text;

		subject.ctx.fillStyle = subject.fColor;
		subject.ctx.fillText(text, i*subject.size, drop[0]*subject.size);

		//sending the drop back to the top randomly after it has crossed the screen
		if(drop[0]*subject.size > subject.el.height && Math.random() > 0.96){drop[0] = 0;}
	}
	setTimeout(renderRain, subject.speed, subject);
	return true;
}

class rain{
	setup(){
		this.el.width = this.el.offsetWidth;
		this.el.height = this.el.offsetHeight;
	
		this.drops = [];
		for (let i = 0; i < Math.floor(this.el.width/this.charWidth); i++) {
			this.drops.push([Math.floor(Math.random()*this.el.height)/this.size, randomCharacter(this.chars)]);
		}

		this.ctx.font = this.size+"px "+ this.font;
	}
    constructor(el, chars, alpha, color, fColor, font, size, speed){
		this.el = el;
		this.chars = chars;
		this.alpha = alpha;
        this.color = color;
		this.fColor = fColor;
		this.speed = speed;
		this.ctx = el.getContext("2d");
		this.font = font;
		this.size = size;
		this.charWidth = Math.ceil(this.ctx.measureText(this.chars[0])["width"]);

		this.setup();

		new ResizeObserver(()=>{this.setup();}).observe(el);
		
		renderRain(this);
    }
}

new rain(matrixEl, matrixChars, 6, "#00d17d", "#ffffff", "matrix_code_nfiregular", 20, 40);
new rain(rainEl, rainChars, 33, "#00abd1", "#008bd1", "Arial", 20, 20);