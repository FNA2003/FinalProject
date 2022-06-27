function zoomButtons(element) {    
    element.addEventListener("click", () => {
        document.querySelectorAll(".textArea-code").forEach(area => {
            let value = parseFloat(window.getComputedStyle(area).getPropertyValue("font-size"));
            
            if (element.id === "zoom-in") {
                area.style.fontSize = `${value + 1}px`
            } else {
                area.style.fontSize = `${value - 1}px`
            }
        });
    });
}

function windowButtons(element) {
    element.addEventListener("click", () => {
        document.querySelectorAll(".textArea-code").forEach(area => {
            area.style.display = "none";
        });
        document.querySelectorAll(".window-change").forEach(button => {
            button.style.cssText = `background: #e9e9ed;
                                    color: black;`;
        });

        element.style.cssText = `background: #114b;
                                color: #fff;`;

        switch(element.id) {
            case "window-HTML":
                document.querySelector("#code-HTML").style.display = "block";
                break;
            case "window-CSS":
                document.querySelector("#code-CSS").style.display = "block";
                break;
            case "window-JAVASCRIPT":
                document.querySelector("#code-JS").style.display = "block";
                break;
            default:
                break;
        }
    });
}


document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".zoom").forEach(button => {
        zoomButtons(button);
    });

    document.querySelectorAll(".window-change").forEach(button => {
        windowButtons(button);
    });

    /* Now, 2 things, we need to use the save button and have a tabulation help... or like that  */
});