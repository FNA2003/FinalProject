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

function tabulation() {
    event.preventDefault();
    document.querySelectorAll(".textArea-code").forEach(area => {
        if (window.getComputedStyle(area).getPropertyValue("display") === "block") {
            const index = area.selectionStart;
            const newString = area.value.slice(0, index) + "    " + area.value.slice(index, area.value.length);
    
            
            area.value = newString;
            area.selectionEnd = index + 4;
        }
    });
}

function complete() {
    let check = true;
    let activeArea;
    let index;
    let newString;

    document.querySelectorAll(".textArea-code").forEach(area => {
        if (window.getComputedStyle(area).getPropertyValue("display") === "block") {
            activeArea = area;
        }
    });

    index = activeArea.selectionStart;

    switch(event.key) {
        case "'":
            newString = activeArea.value.slice(0, index) + "'" + activeArea.value.slice(index, activeArea.value.length);
            break;
        case '"':
            newString = activeArea.value.slice(0, index) + '"' + activeArea.value.slice(index, activeArea.value.length);
            break;
        case "(":
            newString = activeArea.value.slice(0, index) + ")" + activeArea.value.slice(index, activeArea.value.length);
            break;
        case "{":
            newString = activeArea.value.slice(0, index) + "}" + activeArea.value.slice(index, activeArea.value.length);
            break;
        case "[":
            newString = activeArea.value.slice(0, index) + "]" + activeArea.value.slice(index, activeArea.value.length);
            break;
        default:
            check = false;
            break;
    }
    if (check === true){
        activeArea.value = newString;
        activeArea.selectionEnd = index;
    }
}


function keys() {
    if (document.activeElement.classList[0] === "textArea-code") {
        if (event.keyCode === 9) {
            tabulation();
        } else if(event.keyCode === 50 || event.keyCode === 222 || event.keyCode === 56 || event.keyCode === 174){
            complete();
        }
    }
}


function save(token, file) {
    let html = document.querySelector("#code-HTML").value;
    let css = document.querySelector("#code-CSS").value;
    let js = document.querySelector("#code-JS").value;

    fetch("/saveFile", {
        method:"UPDATE",
        headers: {
            "X-CSRFToken":token,
            "Content-type":"application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            "fileName":file,
            "js":js,
            "html":html,
            "css":css
        })
    })
        .then(response => response.json())
        .then(data => { console.log(data) })
}


/* MAIN */
document.addEventListener("DOMContentLoaded", () => {
    const csrfToken = document.querySelector("#token > input").value;
    const fileName = document.querySelector("#fileName").innerHTML;


    document.querySelectorAll(".zoom").forEach(button => {
        zoomButtons(button);
    });

    document.querySelectorAll(".window-change").forEach(button => {
        windowButtons(button);
    });

    document.addEventListener("keydown", () => {
        keys();
    });

    document.querySelector("#saveContainer > button").addEventListener("click", () => {
        save(csrfToken, fileName);
    });

    /* Now, 2 things, we need to fix the fullpage view and wen we hit the enter button, on the area, we should keep
    the tabulation of the last line (it would be could if we complete the html tags when <> closing </>)  */
});