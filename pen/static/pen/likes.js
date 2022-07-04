function likes(b, token) {
    /*
        The likes function let an element fetch to the api so it can give an event to the 
       backend, the backend will know if we are liking or disliking something
    */

    // The bellow variables help us locate the current code object
    const father = b.parentElement.parentElement.parentElement;
    const author = father.children[1].innerHTML;
    const name = father.children[0].children[0].innerHTML;
    
    // We tell the api to change the state of the code object
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
        .then(() => {
            /* In the likes page, when you like a codeObj, you always unlike it (i don't know if i am very clare)
            so when you unlike it, you actually remove it from the html... So if there is no more posts, we reload, so
            we can get the empty template */
            if (father.parentElement.parentElement.children.length === 1) {
                location.reload();
            } else {
                father.parentElement.remove();
            }
            
        })
}


document.addEventListener("DOMContentLoaded", () => {
    // token = csrf_token
    const token = document.querySelector("#token").children[0].value;
    // lastPosition = the last position on screen (help us to load only once the fetch posts)
    let lastPosition = 0;
    // lastId = last post id
    let lastID = document.querySelector("#lastID");
    
    // We configure the page as the initial state
    scroll(0, 0)
    lastID.remove();
    lastID = lastID.innerHTML;

    /* We search for all of the likes and add them a event (also a dataset, so we know that the event is added) */
    document.querySelectorAll(".likeButton").forEach(button => {
        button.addEventListener("click", () => {
            likes(button, token);
        });        
        button.dataset["check"] = true;
    });

    // Separator = the scroll part of the doc (where we found the posts)
    let separator = document.querySelector("#projectsContainer > div:nth-child(2)");
    separator.addEventListener("scroll", () => {
        
        /* If we reach almost the bottom of the page */
        if ((separator.scrollTop + window.innerHeight) >= (separator.scrollHeight - 50)) {
            /* And we ain't reach the end yet (or the last position is less than 50px) */
            if ((lastID > 1 || lastID != null) && ((separator.scrollTop - lastPosition) >= 50)) {
                
                // We will fetch the api for more posts
                fetch(`/getPostsLikes/${lastID}`, {
                        method: "GET",
                        headers: { "Content-type": "application/json; charset=UTF-8" }
                    })
                    .then(response => response.json())
                    .then(data => {
                        /* If there is an error */
                        if (data["array"] === undefined) {
                            // It can mean that the api told us that there is no more posts (we disable the lastId and show the data on the console)
                            console.log(data);
                            lastID = null;
                        } else {
                            // A fragment so we don't refresh the DOM every post
                            let fragment = document.createDocumentFragment();

                            for (i of data["array"]) {
                                /* This could look complex but ,it is not, we make a container where we 
                                store the project as it was on the template */
                                let temp = document.createElement("div");
                                temp.className = "projectContainer";
                                temp.innerHTML = `<div><iframe src="/view/${i.projectName}/${i.creator}" scrolling="no" sandbox></iframe></div>
                                <div>
                                    <h4><strong>${i.projectName}</strong></h4>
                                    <span>${i.creator}</span>
                                    <div class="buttonsContainer">
                                        <span> <i class="fa fa-thumbs-up likeButton" aria-hidden="true"></i> </span>
                                        <a href="/view/${i.projectName}/${i.creator}"> <i class="fa fa-external-link-square" aria-hidden="true"></i> </a>
                                    </div>
                                </div>`;

                                // Refresh the id and we add the container to the fragment
                                lastID = i.id
                                fragment.appendChild(temp);
                            }
                            // Finally, we append the fragment to the html
                            document.querySelector("#projectsContainer > div:nth-child(2)").append(fragment);
                        }

                        // Always when we get new posts, we add them an event listener (in this case, to the like buttons)
                        document.querySelectorAll(".likeButton").forEach(button => {
                            /* If the button doesn't has a dataset, we should add an event */
                            if (button.dataset["check"] === undefined) {
                                button.addEventListener("click", () => {
                                    likes(button, token);
                                });
                                button.dataset["check"] = true;
                            }
                        });
                    });
                    
                // And, always (even if we didn't finish the fetch) save the lastPosition
                lastPosition = separator.scrollTop;
            }
        }
    });
});