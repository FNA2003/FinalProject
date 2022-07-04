function deleteFile(token, button) {
    /*
        The deleteFile function fetch to the api making a request
       of DELETE directed to the selected code object
    */

    // The id of the code object
    const id = button.parentElement.parentElement.children[3].value;
    
    // We ensure that the user want to delete the object
    let a = prompt("Are you sure that you want to delete this file? (Y / N)");
    if (a.toUpperCase() == "Y") {
        /* If it want to do it, we proceed */
        fetch("/editFile", {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "X-CSRFToken": token
                },
                body: JSON.stringify({
                    "fileID": id
                }),
                method: "DELETE"
            })
            .then(response => response.json())
            .then(data => {
                /* When we receive a response, we show it on the console and remove the object on
                html, if this is the last object, we reload the page to get the empty page */
                console.log(data);
                button.parentElement.parentElement.parentElement.remove()

                if (document.querySelector("#projectsContainer > div:nth-child(2)").children.length == 0) {
                    location.reload();
                }
            })
    }
}

function hideFile(token, button, status) {
    /*
        The hideFile function make a project public or not, depending on the "status" (0 or 1) argument
       This also receive a token (csrf_token) and button (element)
    */

    // The id is the id of the code object
    const id = button.parentElement.parentElement.children[3].value;

    /* We fetch the api and console.log the response */
    fetch("/editFile", {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "X-CSRFToken": token                    
            }, 
            body: JSON.stringify({
                "value": status,
                "fileID": id
            }),
            method: "UPDATE"
        })
        .then(response => response.json())
        .then(data => { 
            console.log(data); 
            location.reload(); 
        });
}

function showForm() {
    /* The showForm function hide or unhide the form of the files page */

    // The arrow of the button
    let arrow = document.querySelector("#showForm i");

    // If the arrow points down, we will unhide the form
    if (arrow.classList[1] === "fa-arrow-down") {
        arrow.className = "fa fa-arrow-up"
        document.querySelector("#formContainer").style.display = "block";
    } else {
        // Otherwise, we will hide the form
        arrow.className = "fa fa-arrow-down"
        document.querySelector("#formContainer").style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    /*
        csrf = csrf_token
        lastId = last post id
        lastPosition = the last position of the screen
    */
    const csrf = document.querySelector("#csrfHolder").children[0].value;
    let lastId = document.querySelector("#lastId").innerHTML;
    let lastPosition = 0;

    /* The action of hide/ unhide the form */
    document.getElementById("showForm").addEventListener("click", () => {
        showForm();
    });

    /* Select all of the trash icons, and add them an event and a dataset (that help us know if the element has the event) */
    document.querySelectorAll(".fa-trash-o").forEach(button => {

        button.addEventListener("click", () => {
            deleteFile(csrf, button);                         
        });
        button.dataset["check"] = true;

    });

    /* Select all of the hide icons, and add them an event and a dataset (that help us know if the element has the event) */
    document.querySelectorAll(".fa-eye-slash").forEach(button => {

        button.addEventListener("click", () => {
            hideFile(csrf, button, 1);
        });
        button.dataset["check"] = true;

    })

    /* Select all of the unHide icons, and add them an event and a dataset (that help us know if the element has the event) */
    document.querySelectorAll(".fa-eye").forEach(button => {

        button.addEventListener("click", () => {
            hideFile(csrf, button, 0);
        });
        button.dataset["check"] = true;

    });

    // Cap = scroll area, where you can see the posts
    let cap = document.querySelector("#projectsContainer > div:nth-child(2)");
    cap.addEventListener("scroll", () => {
        /* If we reach the end of the posts container */
        if ((cap.scrollTop + window.innerHeight) >= (cap.scrollHeight - 50)) {
            /* And we the last request didn't gave us an error and the lastPosition is not the here */
            if (((lastId != null) || (lastId > 1)) && ((cap.scrollTop - lastPosition) > 50)) {

                /* We request new posts */
                fetch(`getPostsFiles/${lastId}`, {
                        method: "GET",
                        headers: { "Content-type": "application/json; charset=UTF-8" }
                    })
                    .then(response => response.json())
                    .then(data => {
                        /* If we have an error, we show it and disable the lastId.
                        But if we didn't had an error we load the posts */

                        if (data["ERR"] != undefined) {
                            console.log(data)
                            lastId = null;
                        } else {
                            // A fragment so we don't refresh the DOM every post
                            let fragment = document.createDocumentFragment();

                            for (i of data["array"]) {
                                // View its a string that stores whether the file is hidden or not
                                let view;
                                if (i.isPublic) {
                                    view = '<i class="fa fa-eye" aria-hidden="true"></i>'
                                } else {
                                    view = '<i class="fa fa-eye-slash" aria-hidden="true"></i>'
                                }

                                // A container for the post, as the template, and the content on it
                                let temp = document.createElement("div");
                                temp.className = "projectContainer";
                                temp.innerHTML = `
                                <div><iframe src="/view/${i.projectName}/${i.creator}" scrolling="no" sandbox></iframe></div>
                                <div>
                                    <h4><strong>${i.projectName}</strong></h4>
                                    <span>${i.creator}</span>
                                    <div class="buttonsContainer">
                                        <a href="/view/${i.projectName}/${i.creator}"><i class="fa fa-external-link" aria-hidden="true"></i></a>
                                        <a href="/edit/${i.projectName}"><i class="fa fa-pencil" aria-hidden="true"></i></a>
                                        <i class="fa fa-trash-o" aria-hidden="true"></i>
                                        ${view}
                                    </div>
                                    <input type="hidden" value="${i.id}" />
                                </div>`;

                                // We append the container to the fragment and refresh the lastId
                                fragment.appendChild(temp)
                                lastId = i.id
                            }

                            // Then, we add the fragment to the page
                            document.querySelector("#projectsContainer > div:nth-child(2)").appendChild(
                                fragment);

                            /* And we add the trash eventListener */
                            document.querySelectorAll(".fa-trash-o").forEach(button => {
                                if (button.dataset["check"] != true) {
                                    button.addEventListener("click", () => {
                                        deleteFile(csrf, button);                         
                                    });

                                    button.dataset["check"] = true;
                                }
                            });

                            /* And we add the unHide eventListener */
                            document.querySelectorAll(".fa-eye-slash").forEach(button => {
                                if (button.dataset["check"] != true) {
                                    button.addEventListener("click", () => {
                                        hideFile(csrf, button, 1);
                                    });

                                    button.dataset["check"] = true;
                                }
                            });
                        
                            /* And we add the hide eventListener */
                            document.querySelectorAll(".fa-eye").forEach(button => {
                                if (button.dataset["check"] != true) {
                                    button.addEventListener("click", () => {
                                        hideFile(csrf, button, 0);
                                    });

                                    button.dataset["check"] = true;
                                }
                            });
                        }

                    });

                // Finally, we store the lastPosition (before that the fetch finish)
                lastPosition = cap.scrollTop;
            }
        }
    });
});