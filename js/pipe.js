class pipe{
    constructor(hand, color){
        this.hand = hand;
        this.color = color;
        this.length = ~~(Math.random()*(hand.maxLen-hand.minLen)) + hand.minLen;
        this.pos = [~~(Math.random()*hand.WH[0]), ~~(Math.random()*hand.WH[1])];
        this.curMove = [0, 0, 0];
        this.segments = [];
    }
    render(){
        // Current move has value index 1 = (binary: move along x or y)
        // index 2 = amount to move
        if(this.curMove[2] <= 0){
            let axis = this.curMove[0];
            while(axis == this.curMove[0]) axis = Math.round(Math.random());

            let amount = ~~(Math.random()*this.hand.WH[axis])+1;
            let direction = (Math.random() < 0.5? 0:1);

            this.curMove = [axis, direction, amount];
        }

        let size = this.hand.size;
        let axis = this.curMove[0];
        let dir = this.curMove[1];
        
        this.pos[axis] += dir? 1:-1;

        // If the pipe overflowes in anny direction, overflow to 
        this.pos[axis] %= this.hand.WH[axis];
        if(this.pos[axis] < 0) this.pos[axis] = this.hand.WH[axis];

        // If dir == 1 (positive), then value on axis needs to be displaced by -1*size
        let curSegment = [this.pos[0]*size, this.pos[1]*size, this.hand.pipeWidth, this.hand.pipeWidth];
        curSegment[axis] -= dir*size
        curSegment[2+axis] = size+this.hand.pipeWidth * dir;

        this.segments.unshift(curSegment);
        if(this.segments.length > this.length) this.segments.pop();

        this.curMove[2]--

        this.hand.ctx.fillStyle = this.color;
        for(const i in this.segments) this.hand.ctx.fillRect(...this.segments[i]);
    }
}

class pipeRenderer{
    renderPipes(that = this){
        that.ctx.clearRect(0, 0, that.el.width, that.el.height);
        for(const i in that.pipes) that.pipes[i].render();

        // that.ctx.fillStyle = "#ffffff";
        // for(let x = 0; x < that.WH[0]; x++){
        //     for(let y = 0; y < that.WH[1]; y++){
        //         that.ctx.fillRect(x*that.size, y*that.size, 1, 1);
        //     }
        // }

        setTimeout(that.renderPipes, that.timeout, that);
    }
    setup(){
        this.el.width = this.el.offsetWidth;
		this.el.height = this.el.offsetHeight;

        this.WH = [~~(this.el.width/this.size), ~~(this.el.height/this.size)];
    }
    reColor(palette){
        for(const i in this.pipes){
            this.pipes[i].color = this.palette[~~(Math.random()*this.palette.length)];
        }
    }
    constructor(el, count, size, pipeWidth, maxLen=100, minLen=1, palette=["#fff", "#f00", "#0f0", "#00f"], timeout=40){
        this.el = el;
        this.size = size;
        this.palette = palette;
        this.ctx = el.getContext("2d");
        this.maxLen = maxLen;
        this.minLen = minLen;
        this.timeout = timeout;
        this.pipeWidth = pipeWidth;
        this.offset = (this.size-this.pipeWidth)/2

        this.ctx.imageSmoothingEnabled = false;

        this.setup();

        this.pipes = [];
        for(let i=0; i < count; i++){
            let color = this.palette[~~(Math.random()*this.palette.length)];
            let temp = new pipe(this, color);
            this.pipes.push(temp);
        }

        new ResizeObserver(()=>{this.setup();}).observe(el);
        this.renderPipes();
    }
}