document.addEventListener("DOMContentLoaded", () => {
    /* 
        I should use more functions, right?
    */

    const textArea = document.querySelector("textarea");
    const viewArea = document.querySelector("#viewArea");

    const zoomIn = document.querySelector("#zoom-in");
    const zoomOut = document.querySelector("#zoom-out");

    textArea.addEventListener("keyup", () => {
        /*
            We should make a timer here, so we don't refresh the file
           every single moment... I love u P4nuch0 

           -P4NUCH0
        */




        if (event.key === "Enter") {

           // Add a new line count and a remember for the TAB

        } else if (event.key === "'" || event.key === '"'){            
            const index = textArea.selectionStart;
            const newString = textArea.value.slice(0, index) + event.key + textArea.value.slice(index, textArea.value.length);
            
            
            textArea.value = newString;
            textArea.selectionEnd = index;
        }

        if (textArea.value.trim().length === 0) {
            viewArea.innerHTML = `<span style="display: block;margin: 20px 40px;">Your changes will be displayed here</span>`;
            return;
        }

        const newValue =`<!DOCTYPE html>
                        <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>Document</title>
                            </head>
                            <body>` + 
                            textArea.value + 
                            `</body>
                        </html>`;

        /* Wait, we are going in a good direction, we should make work the JS and CSS views */
        
        const file = new Blob([newValue], {type:"text/html"});
        viewArea.innerHTML = `<iframe id="frame-view" src="${window.URL.createObjectURL(file)}"></iframe>`;
    });

    window.addEventListener("keydown", () => {
        if (textArea === document.activeElement){
            if (event.keyCode === 9) {
                event.preventDefault();
                const index = textArea.selectionStart;
                const newString = textArea.value.slice(0, index) + "    " + textArea.value.slice(index, textArea.value.length);
           
                
                textArea.value = newString;
                textArea.selectionEnd = index + 4;
            }
        }
    });

    document.querySelectorAll(".window-change").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".window-change").forEach(btn => {
                btn.style.background = "#ddd"; 
                btn.style.color = "#000"; 
            });

            button.style.background = "#114b";
            button.style.color = "#fff"

            /* We should make this work... Not only visual */
            textArea.placeholder = `Write your ${(button.id).toString().slice(7, 40)} here...`
        });
    });


    zoomIn.addEventListener("click", () => {
        textArea.style.fontSize = (parseFloat(window.getComputedStyle(textArea, null).getPropertyValue("font-size")) + 2) + "px";
    });

    zoomOut.addEventListener("click", () => {
        textArea.style.fontSize = (parseFloat(window.getComputedStyle(textArea, null).getPropertyValue("font-size")) - 2) + "px";
    });
});