/* The lastScroll will help us go back to the previous position when we fullScreen a project
The lastPosition stores an int that will let the js fetch only once by time */
let lastScroll = null;
let lastPosition = 0;

function fullScreen(button) {
    /* fullScreen zoom in (or out) the current post object */

    // Main container
    let parent = button.parentElement;

    // If the user wants to fullscreen
    if (button.children[0].classList[1] === "fa-arrows-alt") {
        // We save the first position
        lastScroll = window.scrollY;

        // Modify the button style
        button.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';

        // Lock the scroll of the home page
        document.querySelector("html").style.overflowY = "hidden";
        document.querySelector("#goUp").style.display = "none";

        // Enable the scroll of the iframe
        parent.children[1].children[0].scrolling = "yes"
        
        // And move up
        scroll(0, 0);

        parent.style.animationName = "fullScreen";
        parent.style.animationPlayState = "running";
    } else {
        /* But, if the user wants to zoom out */

        // We should go to the position where the user press the button
        scroll(0, lastScroll);

        // Change the style of the button
        button.innerHTML = '<i class="fa fa-arrows-alt" aria-hidden="true"></i>';

        // Enable the scroll of the home page, and, disable the scroll of the iframe
        document.querySelector("html").style.overflowY = "auto";
        parent.children[1].children[0].scrolling = "no";
        
        parent.style.animationName = "none";
    }
}

function likes(button, token) {
    /* The likes function fetch the api so we can like/unlike a file */

    /*
        name = projectName
        author = name of the author
    */
    let name = button.parentElement.parentElement.children[2].children[1].children[0].innerHTML;
    let author = button.parentElement.parentElement.children[2].children[2].children[0].innerHTML;

    fetch("/likeFile", {
            method: "POST",
            headers: {
                "X-CSRFToken": token,
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                "author": author,
                "file": name
            })
        })
        .then(response => response.json())
        .then(data => {   
            /* If there is an error, we display it,
            otherwise, we will change the style of the like button */  
            if (data["ERR"] !== undefined) {
                console.log(data["ERR"]);
            } else {
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
    /*
        token = csrf_token
        lastId = last post id
        userNAME = user name
    */
    const token = document.querySelector("#info > span:nth-child(3)").children[0].value;
    let lastId = document.querySelector("#lastId").children[0].innerHTML;
    let userNAME = undefined;

    // If the user is logged in, we store the name
    if (document.querySelector("#info > span:first-child").innerHTML === "True") {
        userNAME = document.querySelector("#info > span:nth-child(2)").innerHTML;
    }

    // Displaying the page as it should be in the begging
    document.querySelector("#goUp").style.display = "none";
    scroll(0, 0);


    /* Put the event listener to the first 6 fullScreen buttons */
    document.querySelectorAll(".fullScreenSelector").forEach(container => {

        container.addEventListener("click", () => {
            fullScreen(container);
        });
        container.dataset["hasEvent"] = true;

    });

    /* Put the event listener to the first 6 like buttons */
    document.querySelectorAll(".likeButton").forEach(button => {
        
        button.addEventListener("click", () => {  
            likes(button, token);
        });
        button.dataset["hasEvent"] = true;

    });


    document.addEventListener("scroll", () => {
        /* If we are lower than the navBar we might be able to go up instantly */
        if (scrollY >= 150) {
            document.querySelector("#goUp").style.display = "flex";
        } else {
            document.querySelector("#goUp").style.display = "none";
        }
    
        /* If we are at the bottom of the page */
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 50)) {
            
            /* Or if there is no lock down on the actions */
            if ((lastId > 1 || lastId === null) && ((window.scrollY - lastPosition) >= 50)) {

                // We fetch to the api for more posts
                fetch(`/getPosts/${lastId}`, {
                        method: "GET",
                        headers: { "Content-type": "application/json; charset=UTF-8" }
                    })
                    .then(response => response.json())
                    .then(data => { 
                        if (data["array"] === undefined) { 
                            console.log(data); 
                            lastId = null;
                        } else {
                            // First, we make a fragment so we don't refresh the DOM every post
                            const fragment = document.createDocumentFragment();
                            
                            for (i of data["array"]) {
                                // We make the like or edit container
                                const added = document.createElement("div");
                                
                                // If the username is not the creator and it is logged in
                                if (userNAME != undefined && userNAME != i.creator) {
                                    // The container should be a like container
                                    added.className = "likeContainer";
                                    if (i.liked === true) {
                                        added.innerHTML = 
                                            '<i class="fa fa-thumbs-up likeButton" aria-hidden="true"></i>';
                                    } else {
                                        added.innerHTML = 
                                            '<i class="fa fa-thumbs-o-up likeButton" aria-hidden="true"></i>';
                                    }
                                } else if (userNAME == i.creator) {
                                    // But, if the user is the creator, the container should be an edit container
                                    added.className = "editContainer";
                                    added.innerHTML = 
                                        `<a href="/edit/${i.projectName}"><i class="fa fa-pencil" aria-hidden="true"></i></a>`;
                                }

                                // The project container, as the html template
                                const full = document.createElement("div");
                                full.className = "projectHolder";
                                full.innerHTML = `<div class="fullScreenSelector">
                                                    <i class="fa fa-arrows-alt" aria-hidden="true"></i>
                                                </div>
                                                <div>
                                                    <iframe scrolling="no" src="/view/${i.projectName}/${i.creator}" sandbox></iframe>
                                                </div>
                                                <div class="projectHolder__Info">
                                                    <span><a href="/view/${i.projectName}/${i.creator}">Here</a> you can see the full page!</span>
                                                    <div>
                                                        <h3>${i.projectName}</h3>
                                                    </div>
                                                    <div>
                                                        <h4>${i.creator}</h4>
                                                    </div>
                                                </div>`;
                                full.appendChild(added);
                                
                                // Store the lastId and add the container to the fragment
                                lastId = i.id;
                                fragment.appendChild(full);
                                
                            }

                            // So we can add the fragment to the html
                            document.querySelector("#projectsHolder > div > div").append(fragment);

                            /* Add an event listener for all of the newest like buttons */
                            document.querySelectorAll(".likeButton").forEach(b => {
                                if (b.dataset["hasEvent"] === undefined) {
                                    b.addEventListener("click", () => {
                                        likes(b, token);                                    
                                    });
                                    b.dataset["hasEvent"] = true;
                                }
                            });

                            /* Add an event listener for all of the newest fullScreen buttons */
                            document.querySelectorAll(".fullScreenSelector").forEach(b => {
                                if (b.dataset["hasEvent"] === undefined) {
                                    b.addEventListener("click", () => {
                                        fullScreen(b);
                                    });
                                    b.dataset["hasEvent"] = true;
                                }
                            });
                        }
                    });

                // And save the position, even before that the fetch end
                lastPosition = window.scrollY;
            }
            
        }
    });

});