let lastScroll = null;
let lastPosition = 0;

function fullScreen(button) {
    let parent = button.parentElement;

    if (button.children[0].classList[1] === "fa-arrows-alt") {
        lastScroll = window.scrollY;

        button.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';

        document.querySelector("html").style.overflowY= "hidden";
        document.querySelector("#goUp").style.display = "none";

        parent.children[1].children[0].scrolling = "yes"
        
        scroll(0,0);

        parent.style.animationName = "fullScreen";
        parent.style.animationPlayState  = "running";
    } else {
        scroll(0, lastScroll);

        button.innerHTML = '<i class="fa fa-arrows-alt" aria-hidden="true"></i>';

        document.querySelector("html").style.overflowY= "auto";
        parent.children[1].children[0].scrolling = "no";
        
        parent.style.animationName = "none";
    }
}

function likes(button, token) {
    let name = button.parentElement.parentElement.children[2].children[1].children[0].innerHTML;
    let author = button.parentElement.parentElement.children[2].children[2].children[0].innerHTML;

    fetch("/likeFile", {
        method:"POST",
        headers:{
            "X-CSRFToken":token,
            "Content-type":"application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            "author":author,
            "file":name
        })
    })
        .catch(error => { console.log(error); })
        .then(response => response.json())
        .then(data => {            
            switch(button.classList[1]){
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
        });      
}



document.addEventListener("DOMContentLoaded", () => {
    let userNAME = undefined;
    const token = document.querySelector("#info > span:nth-child(3)").children[0].value;
    let lastId = document.querySelector("#lastId").children[0].innerHTML;
    lastId = parseInt(lastId);

    if (document.querySelector("#info > span:first-child").innerHTML === "True") {
        userNAME = document.querySelector("#info > span:nth-child(2)").innerHTML;
    }


    scroll(0,0);
    document.querySelector("#goUp").style.display = "none";


    /* Full Screen First 10 Buttons */
    document.querySelectorAll(".fullScreenSelector").forEach(container => {
        container.addEventListener("click", () => {

            fullScreen(container);

        });
        container.dataset["hasEvent"] = true;
    });

    /* First 10 likes Buttons */
    document.querySelectorAll(".likeButton").forEach(button => {
        
        button.addEventListener("click", () => {   

            likes(button, token);

        });
        button.dataset["hasEvent"] = true;
    });


    document.addEventListener("scroll", () => {
        if (scrollY >= 150) {
            document.querySelector("#goUp").style.display = "flex";
        } else {
            document.querySelector("#goUp").style.display = "none";
        }
    
    
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 50)) {
            
            if (lastId > 1 && ((window.scrollY - lastPosition) >= 50)){
                fetch(`/getPosts/${lastId}`, {
                    method:"GET",
                    headers:{ "Content-type":"application/json; charset=UTF-8" }
                })
                    .catch(error => { console.log(error); })
                    .then(response =>  response.json() )
                    .then(data => { 
                        if (data["array"] == undefined){ 
                            console.log(data); 
                        } else {
                            const father = document.querySelector("#projectsHolder > div > div");
                            const fragment = document.createDocumentFragment();
                            
                            for(i of data["array"]) {   
                                const added = document.createElement("div");

                                if (userNAME != undefined && userNAME != i.creator) {
                                    added.className = "likeContainer";
                                    if(i.liked === true) {
                                        added.innerHTML = '<i class="fa fa-thumbs-up likeButton" aria-hidden="true"></i>';
                                    } else {
                                        added.innerHTML = '<i class="fa fa-thumbs-o-up likeButton" aria-hidden="true"></i>';
                                    }
                                } else if (userNAME == i.creator){
                                    added.className = "editContainer";
                                    added.innerHTML = `<a href="/edit/${i.projectName}"><i class="fa fa-pencil" aria-hidden="true"></i></a>`;
                                }

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
                                
                                lastId = i.id;
                                fragment.appendChild(full);
                            }

                            father.append(fragment);

                            document.querySelectorAll(".likeButton").forEach(b => {
                                if (b.dataset["hasEvent"] === undefined) {
                                    b.addEventListener("click", () => {
                                        likes(b, token);                                    
                                    });
                                    b.dataset["hasEvent"] = true;
                                }
                            });

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

                    lastPosition = window.scrollY;
            }
            
        }
    });

});


