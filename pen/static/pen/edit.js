function zoomButtons(element) {    
    /* Add an event for the two zoom buttons */

    element.addEventListener("click", () => {
        // Get all of the text areas
        document.querySelectorAll(".textArea-code").forEach(area => {
            // Read the fontSize of every area
            let value = parseFloat(window.getComputedStyle(area).getPropertyValue("font-size"));
            
            // And analyze if the user wants to zoom in or out
            if (element.id === "zoom-in") {
                area.style.fontSize = `${value + 1}px`
            } else {
                area.style.fontSize = `${value - 1}px`
            }
        });
    });
}

function windowButtons(element) {
    /* windowButtons, add an event listener for the windows buttons */

    element.addEventListener("click", () => {
        // First, we hide all of the text areas
        document.querySelectorAll(".textArea-code").forEach(area => {
            area.style.display = "none";
        });
        // Second one, we put by default the windows buttons
        document.querySelectorAll(".window-change").forEach(button => {
            button.style.cssText = `background: #e9e9ed;
                                    color: black;`;
        });

        // Style the selected button
        element.style.cssText = `background: #114b;
                                color: #fff;`;

        // And style the textArea corresponding to the buttons
        switch (element.id) {
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
    /* This function add a tabulation space when the TAB key is clicked */
    
    // Prevent the tab index switch
    event.preventDefault();
    document.querySelectorAll(".textArea-code").forEach(area => {
        // Loop through all of the text areas and find the one that is displayed
        if (window.getComputedStyle(area).getPropertyValue("display") === "block") {
            // Find the index in the area, slice the value, add the tab and put all back
            const index = area.selectionStart;
            const newString = area.value.slice(0, index) + "    " + area.value.slice(index, area.value.length);
    
            
            area.value = newString;
            area.selectionEnd = index + 4;
        }
    });
}

function complete() {
    /* The complete function tries to find the string that the user is writing
    and complete it, example; " will be press and then it will complete with a: " */

    /* 
        Check = is the string completed?
        activeArea = active text area
        index = selection index inside of the text area
        newString = string modified by the complete
    */
    let check = true;
    let activeArea;
    let index;
    let newString;

    // Find the active code area
    document.querySelectorAll(".textArea-code").forEach(area => {
        if (window.getComputedStyle(area).getPropertyValue("display") === "block") {
            activeArea = area;
        }
    });

    // Find the cursor position
    index = activeArea.selectionStart;

    // If the trigger is any of the following, make a new string
    switch (event.key) {
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

    // And, if there was a modification, we will refresh the value of the area
    if (check === true) {
        activeArea.value = newString;
        activeArea.selectionEnd = index;
    }
}

function rememberTabulation() {
    /* This function remember the number of tabulations when we hit enter */

    document.querySelectorAll(".textArea-code").forEach(area => {
        if (window.getComputedStyle(area).getPropertyValue("display") === "block") {
            // First, we find the area, and prevent any action
            event.preventDefault();

            // Make a string till the Enter
            let upToEnter = area.value.slice(0, area.selectionStart).split("").reverse()
            let spacesCount = 0;

            // Loop through the upToEnter string (reversed so we always will find the enter char)
            for (let i = 0; i < upToEnter.length; i++) {
                // If the current char is a new line
                if (upToEnter[i] === "\n") {
                    // An make a string of the current line (now un-reversed) to find the initial blank space
                    let currentLine = upToEnter.slice(0, i).reverse();
                    for (i of currentLine) {
                        if (i === " ") {
                            spacesCount++;
                        } else {
                            break;
                        }
                    }
                    break;
                }
            }

            // Make a new string with the new line white spaces and previous values and replace it
            let newValue = 
                (area.value.slice(0, area.selectionEnd) + "\n" + (" ".repeat(spacesCount))) + 
                (area.value.slice(area.selectionEnd, area.value.length));
            area.value = newValue;
        }
    })
}

function refreshView() {
    /* Every time we press a key, we will make a new view for the current code */

    // The bellow variables stores the linked textAreas 
    let html = document.querySelector("#code-HTML").value;
    let css = document.querySelector("#code-CSS").value;
    let js = document.querySelector("#code-JS").value;

    // The css and js files
    const cssFile = new Blob([css], { type: "text/css;charset=utf8" });
    const jsFile = new Blob([js], { type: "text/js;charset=utf8" });

    // We add the link
    html += `<link rel='stylesheet' href='${URL.createObjectURL(cssFile)}' /><script src='${URL.createObjectURL(jsFile)}'></script>`;
    if (html.includes("<!DOCTYPE html>") === false) {
        // And the doctype if the html of the user didn't specified it
        html = "<!DOCTYPE html>" + html;
    }
    
    // Finally, we make the html file
    let htmlFile = new Blob([html], { type: "text/html;charset=utf8" });
    // And the html file to the iframe view
    document.querySelector("#viewArea > iframe:first-child").src = URL.createObjectURL(htmlFile);
}

function keys() {
    /* Keys function look if the active element is a text area and call the respective functions */
    if (document.activeElement.classList[0] === "textArea-code") {
        if (event.keyCode === 9) {
            tabulation();
        } else if (event.keyCode === 50 || event.keyCode === 222 || event.keyCode === 56 || event.keyCode === 174) {
            complete();
        } else if (event.keyCode === 13) {
            rememberTabulation();
        }

        // And refresh the iframe view
        refreshView();

    }
}

function save(token, file) {
    /* Save takes the values of all text areas and send them to the API
    with the corresponding headers and body fields */

    let html = document.querySelector("#code-HTML").value;
    let css = document.querySelector("#code-CSS").value;
    let js = document.querySelector("#code-JS").value;

    fetch("/saveFile", {
            method: "UPDATE",
            headers: {
                "X-CSRFToken": token,
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                "fileName": file,
                "js": js,
                "html": html,
                "css": css
            })
        })
        .then(response => response.json())
        .then(data => { console.log(data) })
}


/* MAIN */
document.addEventListener("DOMContentLoaded", () => {
    /* 
        csrfToken = csrf_token
        fileName = name of the edited file
    */
    const csrfToken = document.querySelector("#token > input").value;
    const fileName = document.querySelector("#fileName").innerHTML;

    // First, we always refresh the view... Cause the iframe is given with a src="#"
    refreshView();

    // Add the zoom buttons event
    document.querySelectorAll(".zoom").forEach(button => {
        zoomButtons(button);
    });

    // Add the window change events
    document.querySelectorAll(".window-change").forEach(button => {
        windowButtons(button);
    });

    // Let the js know every time we press a key
    document.addEventListener("keydown", () => {
        keys();
    });

    // Add the save button event
    document.querySelector("#saveContainer > button").addEventListener("click", () => {
        save(csrfToken, fileName);
    });   
});