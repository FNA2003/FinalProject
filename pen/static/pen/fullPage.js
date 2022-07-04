function likeButton(button, token, author, fileName) {
    /*
        The likeButton function post to the API a state,
       the api will decide if the state will be like/ dislike.

       This function takes 4 arguments; button (the element), token (csrf token), 
       author (creator of the page) and fileName (name of the current file)
    */

    fetch("/likeFile", {
            method: "POST",
            headers: {
                "X-CSRFToken": token,
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                "author": author,
                "file": fileName
            })
        })
        .catch(error => { console.log(error); })
        .then(response => response.json())
        .then(data => {
            // We always display the response
            console.log(data); 
            
            // But if we ant received an error
            if (data["OK"] !== undefined) {
                // We change the className (icon) to the corresponding one
                switch (button.classList[1]) {
                    case "fa-thumbs-up":
                        button.className = `fa fa-thumbs-o-up likeButton`;
                        break;
                    case "fa-thumbs-o-up":
                        button.className = `fa fa-thumbs-up likeButton`;
                        break;
                    default:
                        console.error("Something is missing!");
                        setTimeout(() => { location.reload(); }, 200);
                }
            
            }
        });
}

document.addEventListener("DOMContentLoaded", () => {
    // The csrf token, name and author of the current file (you can find them in the html)
    const token = document.querySelector("#token").children[0].value;
    const name = document.querySelector("#fileName").innerHTML;
    const author = document.querySelector("#authorName").innerHTML;

    /* 'Check', is a boolean that works like this; in the template corresponding to this .js ("fullPage.html")
    there is a container that can be displayed (or not) in the page when there is content or not */
    let check = document.querySelector("#empty") === null;
    
    if (check === false) {
        // We will change the view of the home button
        let anchor = document.querySelector("#HOME-BUTTON a");
        
        anchor.style.cssText = `position: absolute;
                                width: 95%;
                                text-align: center;
                                top: 5vh;`
        anchor.innerHTML = '<i class="fa fa-home" aria-hidden="true"></i>'

        // A kind of "meme" background
        document.querySelector("body > div").style.cssText = "margin-top: 0;";
        document.body.style.cssText = ` background: rgb(201,64,137);
                                        background: radial-gradient(circle, rgba(201,64,137,1) 0%, rgba(95,47,208,1) 55%, 
                                        rgba(16,90,185,1) 75%); `;

        // Then we display, and hide, all of the needed buttons
        try {
            document.querySelector("#likeButtonContainer").style.display = "none"
        }
        catch(error) {
            /* pass */
        }
        document.querySelector("#empty").style.display = "block";
        document.querySelector("#HOME-BUTTON").style.cssText = `display: block;
                                                                background: transparent;`;
    } else {
        // If there is content on the page, we will display normal all of the buttons
        document.querySelector("#HOME-BUTTON").style.display = "block";
        document.querySelector("#editButton").style.display = "block";
    }

    // We select all of the buttons, add a click event and display them
    document.querySelectorAll(".likeButton").forEach(button => {
        button.style.display = "block";
        button.addEventListener("click", () => {
            
            likeButton(button, token, author, name);
                
        });
    });

    // Finally, we display the container (this container will be if the requester is not the creator)
    try {
        document.querySelector("#likeButtonContainer").style.display = "flex";    
    }
    catch (error) {
        /* pass */
    }
});

