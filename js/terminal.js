class terminal{
    newLine(text = "", usr=true, color=this.colors["default"]){
        let line = document.createElement("p");
        line.classList.add("line");
        line.style.color = color;
        if(usr) line.appendChild(this.lStart);
        line.innerHTML += text;
        this.el.appendChild(line);
        this.el.scrollTop = this.el.scrollHeight;

        if(this.el.childElementCount >= 100) this.el.firstChild.remove();

        return true;
    }
    async dumpText(lines, cont = false){
        this.dumping = true;
        let i = 0;
        while(true){
            this.newLine("<pre>"+lines[i]+"</pre>", false, this.colors["dump"]);
            if(this.interrupt || (!cont && i == lines.length-1)) break;
            i = (i+1)%lines.length;

            await new Promise(resolve => setTimeout(resolve, this.dumpWait));
        }
        this.interrupt = false;
        this.dumping = false;
        return this.newLine();
    }
    command(){
        let command = this.el.lastChild.innerHTML.split("</span>")[1].toLowerCase().trim().split(" ");
        switch (command[0]) {
            case "clear":
                this.el.textContent = '';
                break;
            case "codedump": 
                this.dumpText(dataDump.split("\n"), command.includes("--cont"));
                break;
            case "fullscreen":
                document.body.requestFullscreen();
                this.newLine("Press esc to quit fullscreen", false);
                break;
            case "recolor":
                if(command[1] == undefined || !Object.keys(colorInstances).includes(command[1])){
                    this.newLine(`Did not find '${command[1]}', available objects are: `, false);
                    this.dumpText(Object.keys(colorInstances));
                }
                else if(command[2] == undefined || isNaN(command[2])){
                    this.newLine(`Did not find a way to use '${command[2]}' as a number`, false);
                }else if(command[2] > 100){
                    this.newLine(`No values over 100 is allowed, '${command[2]}' is too large`, false);
                }else{
                    let colors = randomColors(Number(command[2]))
                    colorInstances[command[1]].reColor(colors);
                    this.newLine(`Success! new colors are:`, false);
                    this.dumpText(colors);
                }
                break;
                break;
            case "help":
                this.dumpText([
                    "Current supported commands:",
                    "  help       - You are currently looking at it",
                    "  clear      - Clears the terminal",
                    "  codedump   - Dump some code into the terminal, can be made continuous with --cont",
                    "  fullscreen - Putt the page in fullscreen",
                    "  recolor    - Re color an instance: recolor [object] [color amount] (randomly selected)"
                ]);
                break;
            default:
                this.newLine();
                this.el.lastChild.innerHTML = `-bash: ${command.split(" ")[0]}: command not found`;
        }
        if(!this.dumping) this.newLine();
    }
    keyHandler(e){
        const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890,._@*!?=+- ".split("");
        if(keys.includes(e.key)){
            this.el.lastChild.innerHTML += e.key;
            return;
        }
        switch (e.key) {
            case "Enter": this.command(); break;
            case "Backspace": this.el.lastChild.innerHTML = this.el.lastChild.innerHTML.slice(0, -1); break;
            default: break;
        }
    }
    constructor(el, uName, colors, font, size = 20, dumpWait = 40){
        this.el = el;
        this.uName = uName;
        this.colors = colors;
        this.font = font;
        this.dumpWait = dumpWait;
        this.interrupt = false;

        this.lStart = document.createElement("span");
        this.lStart.innerHTML = `[${uName} ~]$ `;
        this.lStart.style.color = this.colors["lStart"];
        this.lStart.classList.add("lStart");

        this.el.style.color = colors["default"];
        this.el.style.font = size+"px "+font;
        this.el.style.opacity = "75%";
        this.el.setAttribute('tabindex', '0');
        this.el.addEventListener("focus", ()=>{this.el.style.opacity = 1;});
        this.el.addEventListener("focusout", ()=>{this.el.style.opacity = 0.75;});// = "75%";});

        this.el.addEventListener("keydown", (e)=>{this.keyHandler(e)});
        this.newLine();
    }
}