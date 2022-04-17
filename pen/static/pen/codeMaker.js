document.addEventListener("DOMContentLoaded", () => {
    const INTERVAL = 1500;

    let activeWindow = "code-HTML";

    const viewArea = document.querySelector("#viewArea");

    const zoomIn = document.querySelector("#zoom-in");
    const zoomOut = document.querySelector("#zoom-out");
    
    mainFile();

    document.querySelector("#code-HTML").addEventListener("keyup", () => { writeView(event); });
    document.querySelector("#code-CSS").addEventListener("keyup", () => { writeView(event); });
    document.querySelector("#code-JS").addEventListener("keyup", () => { writeView(event); });

    window.addEventListener("keydown", tabulation);

    document.querySelectorAll(".window-change").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".window-change").forEach(btn => {
                btn.style.background = "#ddd"; 
                btn.style.color = "#000"; 
            });

            button.style.background = "#114b";
            button.style.color = "#fff";

            switch(button.id) {
                case "window-CSS":
                    document.querySelector("#code-HTML").style.display = "none";
                    document.querySelector("#code-CSS").style.display = "block";
                    document.querySelector("#code-JS").style.display = "none";

                    activeWindow = "code-CSS";
                    break;
                    
                case "window-HTML":
                    document.querySelector("#code-HTML").style.display = "block";
                    document.querySelector("#code-CSS").style.display = "none";
                    document.querySelector("#code-JS").style.display = "none";

                    activeWindow = "code-HTML";
                    break;

                case "window-JAVASCRIPT":
                    document.querySelector("#code-HTML").style.display = "none";
                    document.querySelector("#code-CSS").style.display = "none";
                    document.querySelector("#code-JS").style.display = "block";

                    activeWindow = "code-JS";
                    break;

                default:

                    activeWindow = null;
                    break;
            }
        });
    });

    function tabulation() {
        let codeArea = document.querySelector("#" + activeWindow);

        if (codeArea === document.activeElement){
            if (event.keyCode === 9) {
                event.preventDefault();
                const index = codeArea.selectionStart;
                const newString = codeArea.value.slice(0, index) + "    " + codeArea.value.slice(index, codeArea.value.length);
        
                
                codeArea.value = newString;
                codeArea.selectionEnd = index + 4;
            }
        }
    }


    zoomIn.addEventListener("click", () => {
        let textArea = document.querySelector("#" + activeWindow);

        textArea.style.fontSize = (parseFloat(window.getComputedStyle(textArea, null).getPropertyValue("font-size")) + 2) + "px";
    });

    zoomOut.addEventListener("click", () => {
        let textArea = document.querySelector("#" + activeWindow);

        textArea.style.fontSize = (parseFloat(window.getComputedStyle(textArea, null).getPropertyValue("font-size")) - 2) + "px";
    });
    



    function complete(event) {
        if (event.key === "'" || event.key === '"'){      
            let textArea = document.querySelector("#" + activeWindow);

            const index = textArea.selectionStart;
            const newString = textArea.value.slice(0, index) + event.key + textArea.value.slice(index, textArea.value.length);
            
            
            textArea.value = newString;
            textArea.selectionEnd = index;
        }
    }

    function checkEmptiness() {
        let nodeList = document.querySelectorAll("textarea");

        for (let x of nodeList) {
            if (x.value.length > 0) {
                return false;
            }
        }            
        
        return true;
    }

    function writeView(event) {
        complete(event);

        if (checkEmptiness() === true){
            viewArea.innerHTML = `<span style="display:block; margin: 20px 40px;">Your changes will be displayed here</span>`;
            return;
        }

        if ((event.key).includes("Arrow")) {
            return;
        }


        setTimeout(mainFile, INTERVAL);

    }

    function mainFile() {
        let codeCSS = document.querySelector("#code-CSS").value;
        let codeJS = document.querySelector("#code-JS").value;

        const cssFile = new Blob([codeCSS], {type:"text/css"});
        const jsFile = new Blob([codeJS], {type:"text/js"});


        const newValue =`<!DOCTYPE html>
                         <html lang="en">
                             <head>
                                 <meta charset="UTF-8">
                                 <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                 <link rel="stylesheet" href="${window.URL.createObjectURL(cssFile)}">
                                 <script src="${window.URL.createObjectURL(jsFile)}"></script> 
                                 <title>Document</title>
                             </head>
                             <body>` + 
                             document.querySelector("#code-HTML").value + 
                             `</body>
                         </html>`;
        
        const file = new Blob([newValue], {type:"text/html"});

        viewArea.innerHTML = `<iframe id="frame-view" src="${window.URL.createObjectURL(file)}"></iframe>`;

        console.clear();
    }
});