document.addEventListener("DOMContentLoaded", () => {
    const INTERVAL = 1500;

    const textArea = document.querySelector("textarea");
    const viewArea = document.querySelector("#viewArea");

    const zoomIn = document.querySelector("#zoom-in");
    const zoomOut = document.querySelector("#zoom-out");
    
    mainFile();

    textArea.addEventListener("keyup", () => {

        writeView(event);        

    });

    window.addEventListener("keydown", tabulation);

    document.querySelectorAll(".window-change").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".window-change").forEach(btn => {
                btn.style.background = "#ddd"; 
                btn.style.color = "#000"; 

                btn.dataset.active = "false";
            });

            button.dataset.active = "true";
            button.style.background = "#114b";
            button.style.color = "#fff";

            textArea.placeholder = `Write your ${(button.id).toString().slice(7, 40)} here...`;
        });
    });

    function tabulation() {
        if (textArea === document.activeElement){
            if (event.keyCode === 9) {
                event.preventDefault();
                const index = textArea.selectionStart;
                const newString = textArea.value.slice(0, index) + "    " + textArea.value.slice(index, textArea.value.length);
        
                
                textArea.value = newString;
                textArea.selectionEnd = index + 4;
            }
        }
    }


    zoomIn.addEventListener("click", () => {
        textArea.style.fontSize = (parseFloat(window.getComputedStyle(textArea, null).getPropertyValue("font-size")) + 2) + "px";
    });

    zoomOut.addEventListener("click", () => {
        textArea.style.fontSize = (parseFloat(window.getComputedStyle(textArea, null).getPropertyValue("font-size")) - 2) + "px";
    });
    



    function complete(event) {
        if (event.key === "'" || event.key === '"'){            
            const index = textArea.selectionStart;
            const newString = textArea.value.slice(0, index) + event.key + textArea.value.slice(index, textArea.value.length);
            
            
            textArea.value = newString;
            textArea.selectionEnd = index;
        }
    }

    function checkEmptiness() {
        if (textArea.value.trim().length === 0) {
            viewArea.innerHTML = `<span style="display: block;margin: 20px 40px;">Your changes will be displayed here</span>`;
            return true; 
        }

        return false;
    }

    function writeView(event) {
        complete(event);

        if (checkEmptiness() === true){
            return;
        }

        if ((event.key).includes("Arrow")) {
            return;
        }


        setTimeout(mainFile, INTERVAL);

    }

    function mainFile() {
        const cssFile = new Blob([], {type:"text/css"});
        const jsFile = new Blob([], {type:"text/js"});

        /* Hey! We should make a query to know if we are writing the html or css file */
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
                             textArea.value + 
                             `</body>
                         </html>`;
        
        const file = new Blob([newValue], {type:"text/html"});
        viewArea.innerHTML = `<iframe id="frame-view" src="${window.URL.createObjectURL(file)}"></iframe>`;
    }
});