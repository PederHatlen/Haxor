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
    async dumpText(lines, dumpWait = this.dumpWait, cont = false){
        this.dumping = true;
        let i = 0;
        while(true){
            if(this.interrupt || (!cont && i == lines.length-1)) break;
            this.newLine("<pre>"+lines[i]+"</pre>", false, this.colors["dump"]);
            i = (i+1)%lines.length;

            await new Promise(resolve => setTimeout(resolve, dumpWait));
        }
        this.interrupt = false;
        this.dumping = false;
        return this.newLine();
    }
    command(data){
        let command = data.toLowerCase().trim().split(" ")
        switch (command[0]) {
            case "clear":
                this.el.textContent = '';
                break;
            case "codedump": 
                this.dumpText(codeDump.split("\n"), this.dumpWait, command.includes("--cont"));
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
            case "tree":
                this.dumpText(treeDump.split("\n"), 10, command.includes("--cont"));
                break;
            case "echo":
                this.newLine(command.slice(1).join(" "), false);
                break;
            case "help":
                this.dumpText([
                    "Current supported commands:",
                    "  help       - You are currently looking at it",
                    "  clear      - Clears the terminal",
                    "  echo       - output to terminal",
                    "  codedump   - Dump some code into the terminal, can be made continuous with --cont",
                    "  tree       - You know what this is, --cont to make continuous",
                    "  fullscreen - Put the page in fullscreen",
                    "  recolor    - New random colors for instance: recolor [object] [color amount]",
                    " ",
                    "All dumping commands can be stopped with ctrl+c"
                ]);
                break;
            case "": break;
            default:
                this.newLine(`-bash: ${command[0]}: command not found, help for commandlist`, false);
        }
        if(!this.dumping) this.newLine();
    }
    keyHandler(e){
        console.log(e.key)
        const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890,._@*!?=+- ".split("");
        if(keys.includes(e.key) && !e.ctrlKey){
            this.el.lastChild.innerHTML += e.key;
            return;
        }
        switch (e.key.toLowerCase()) {
            case "enter":
                this.index = -1;
                this.history.unshift(this.el.lastChild.innerHTML);
                this.command(this.el.lastChild.innerHTML.split("</span>")[1]);
                break;
            case "backspace": 
                this.el.lastChild.innerHTML = this.el.lastChild.innerHTML.slice(0, -1);
                break;
            case "arrowup": 
                if(this.index+1 < this.history.length) this.el.lastChild.innerHTML = this.history[++this.index];
                break;
            case "arrowdown": 
                if(this.index-1 > 0) this.el.lastChild.innerHTML = this.history[--this.index];
                else this.el.lastChild.innerHTML = this.lStart.outerHTML;
                break;
            case "c":
                this.interrupt = true;
                this.newLine("Keyboard interrupt", false);
                break;
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
        this.history = [];
        this.index = -1;

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