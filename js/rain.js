class rain{
	renderRain(that=this){
		that.ctx.fillStyle = "rgba(0, 0, 0, "+(that.alpha/100)+")";
		that.ctx.fillRect(0, 0, that.el.width, that.el.height);	
	
		for(let i = 0; i < that.drops.length; i++){
			const drop = that.drops[i];
			// console.log(that.colors)
			that.ctx.fillStyle = that.colors[~~(Math.random()*that.colors.length)];
			that.ctx.fillText(drop[1], i*that.size, drop[0]*that.size);
	
			var text = that.chars[~~(Math.random()*that.chars.length)];
			drop[0]++;
			drop[1] = text;
	
			if(that.fColor !== "undefined"){
				that.ctx.fillStyle = that.fColor;
				that.ctx.fillText(text, i*that.size, drop[0]*that.size);
			}
	
			//sending the drop back to the top randomly after it has crossed the screen
			if(drop[0]*that.size > that.el.height && Math.random() > 0.96){drop[0] = 0;}
		}
		setTimeout(that.renderRain, that.timeout, that);
		return true;
	}
	setup(){
		this.el.width = this.el.offsetWidth;
		this.el.height = this.el.offsetHeight;
	
		this.drops = [];
		for (let i = 0; i < ~~(this.el.width/this.charWidth); i++) {
			this.drops.push([~~(Math.random()*this.el.height)/this.size, this.chars[~~(Math.random()*this.chars.length)]]);
		}

		this.ctx.font = this.size+"px "+ this.font;
	}
	reColor(colors){this.colors = colors;}
    constructor(el, chars, alpha, colors, font, size, timeout){
		this.el = el;
		this.chars = chars;
		this.alpha = alpha;
        this.colors = colors["colors"];
		this.fColor = colors["first"];
		this.timeout = timeout;
		this.ctx = el.getContext("2d");
		this.font = font;
		this.size = size;
		this.charWidth = Math.ceil(this.ctx.measureText(this.chars[0])["width"]);

		this.setup();

		new ResizeObserver(()=>{this.setup();}).observe(el);
		
		this.renderRain();
    }
}