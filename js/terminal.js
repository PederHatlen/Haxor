let T1El = document.getElementById("terminal1");
let T2El = document.getElementById("terminal2");

// Default terminal colors
let DTC = {
    "default":"#AAAAAA",
    "lStart":"#6AC44B",
    "error":"#C44B4B",
    "spitt":"#617e91"
};

let folderStructure = {"boot":{}, "efi":{}, "etc":{}, "home":{"Fjotrolf":""}, "root":{}}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function spitt(object, cont = false){
    let lines = dataDump.split("\n");
    while (true){
        for(let i = 0; i < lines.length; i++){
            let line = document.createElement("p");
            line.classList.add("line");
            line.style.color = object.colors["spitt"];
            line.innerHTML = lines[i];
            object.el.appendChild(line);
            object.el.scrollTop = object.el.scrollHeight;
            await sleep(40);
        }
        if(!cont) return true;
        object.el.textContent = '';
    }
}

class terminal{
    newLine(){
        let line = document.createElement("p");
        line.classList.add("line");
        line.appendChild(this.lStart);
        this.el.appendChild(line);
        this.el.scrollTop = this.el.scrollHeight;
    }
    command(){
        let command = this.el.lastChild.innerHTML.split("</span>")[1].toLowerCase().trim();
        console.log(command)
        switch (command) {
            case "clear":
                this.el.textContent = '';
                break;
            case "spitt":
                spitt(this, false);
                break;
            case "spitt --cont":
                spitt(this, true);
                break;
            default:
                this.newLine();
                this.el.lastChild.innerHTML = `-bash: ${command}: command not found`;
        }
        this.newLine();
    }
    keyHandler(e){
        const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890,._@*!?=+- ".split("");
        if(keys.includes(e.key)){
            this.el.lastChild.innerHTML += e.key;
            return;
        }
        console.log(e.key)
        switch (e.key) {
            case "Enter":
                this.command();
                break;
            case "Backspace":
                this.el.lastChild.innerHTML = this.el.lastChild.innerHTML.slice(0, -1);
                break;
            default:
                break;
        }
    }
    constructor(el, uName, colors, font, size){
        this.el = el;
        this.uName = uName;
        this.colors = colors;
        this.font = font;

        this.lStart = document.createElement("span");
        this.lStart.innerHTML = `[${uName} ~]$ `;
        this.lStart.style.color = this.colors["lStart"];
        this.lStart.classList.add("lStart");
        console.log(this.colors["lStart"])

        this.el.style.color = colors["default"];
        this.el.style.font = size+"px "+font;
        this.el.style.opacity = "75%";
        this.el.setAttribute('tabindex', '0');
        this.el.addEventListener("focus", ()=>{this.el.style.opacity = 1;});
        this.el.addEventListener("focusout", ()=>{this.el.style.opacity = 0.75;});// = "75%";});

        this.el.addEventListener("keydown", (e)=>{this.keyHandler(e)});
        console.log("Setup terminal")
        this.newLine();
    }
}

new terminal(T1El, "Fjotrolf", DTC, "Inconsolata", 20);
new terminal(T2El, "Fjotrolf", DTC, "Inconsolata", 15);