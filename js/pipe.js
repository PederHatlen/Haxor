let pipesEl = document.getElementById("pipes");

function randomColors(amount = 1){
    let data = []
    for(let i = 0; i < amount; i++) data.push("#"+(Math.random()*0xFFFFFF<<0).toString(16));
    return data;
}

function renderPipes(object){
    object.ctx.clearRect(0, 0, object.el.width, object.el.height);
    for(let i = 0; i < object.pipes.length; i++){
        object.pipes[i].render()
    };
    setTimeout(renderPipes, 40, object);
}

class pipe{
    constructor(hand, color){
        this.hand = hand;
        this.ctx = this.hand.ctx;
        this.color = color;
        this.length = Math.floor(Math.random()*100);
        this.pos = [[Math.floor(Math.random()*hand.WH[0]), Math.floor(Math.random()*hand.WH[1])]];
        this.curMove = [0, 0];
    }
    render(){
        // Current move has value index 1 = (binary: move along x or y)
        // index 2 = amount to move
        if(this.curMove[1] == 0 || this.curMove[1] == NaN){
            let axis = Math.round(Math.random());
            let amount = Math.floor(((Math.random()*2)-1) * this.hand.WH[axis]);
            this.curMove = [axis, amount];
        }

        let size = this.hand.size;
        let axis = this.curMove[0]
        
        let newPos = [...this.pos[0]];
        newPos[axis] += (this.curMove[1] > 0? -1:1);
        if(newPos[axis] < 0) newPos[axis] = this.hand.WH[axis];
        else if(newPos[axis] >= this.hand.WH[axis]) newPos[axis] = 0;
        this.pos.unshift(newPos);

        if(this.pos.length > this.length) this.pos.pop()

        this.curMove[1] += this.curMove[1] > 0? -1:1;

        this.ctx.fillStyle = this.color;
        for(let i = 0; i < this.pos.length; i++){
            this.ctx.fillRect(this.pos[i][0]*size, this.pos[i][1]*size, size, size);
        }
    }
}

class pipeRenderer{
    setup(){
        this.el.width = this.el.offsetWidth;
		this.el.height = this.el.offsetHeight;

        this.WH = [Math.floor(this.el.width/this.size), Math.floor(this.el.height/this.size)];
    }
    constructor(el, count, size, palette = randomColors(10)){
        this.el = el;
        this.size = size;
        this.palette = palette;
        this.ctx = el.getContext("2d");

        this.ctx.imageSmoothingEnabled = false;

        this.setup();

        this.pipes = [];
        for(let i=0; i < count; i++){
            let color = this.palette[Math.floor(Math.random()*this.palette.length)]
            let temp = new pipe(this, color);
            this.pipes.push(temp);
        }

        new ResizeObserver(()=>{this.setup();}).observe(el);
        renderPipes(this);
    }
}

new pipeRenderer(pipesEl, 25, 5)//, ["#FF0000", "#EE0044", "#663388"]);