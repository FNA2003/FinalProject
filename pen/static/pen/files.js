function deleteFile(token, button) {
    const id = button.parentElement.parentElement.children[3].value;

    let a = prompt("Are you sure that you want to delete this file? (Y / N)");
    if (a.toUpperCase() == "Y"){
        fetch("/editFile", {
            headers: {
                "Content-type":"application/json; charset=UTF-8",
                "X-CSRFToken":token
            },
            body:JSON.stringify({
                "fileID":id
            }),
            method:"DELETE"
        })
            .then(response => response.json() )
            .then(data => {
                console.log(data);
                button.parentElement.parentElement.parentElement.remove()

                if (document.querySelector("#projectsContainer > div:nth-child(2)").children.length == 0){
                    location.reload();
                }
            })
    }
}

function hideFile(token, button) {
    const id = button.parentElement.parentElement.children[3].value;

    fetch("/editFile", {
        headers: {
            "Content-type":"application/json; charset=UTF-8",
            "X-CSRFToken":token                    
        }, 
        body: JSON.stringify({
            "value": 1,
            "fileID": id
        }),
        method:"UPDATE"
    })
        .then(response => { console.log(response); location.reload(); })
        .catch(error => { console.log(error); });
}

function unHideFile(token, button) {
    const id = button.parentElement.parentElement.children[3].value;

    fetch("/editFile", {
        headers: {
            "Content-type":"application/json; charset=UTF-8",
            "X-CSRFToken":token                    
        }, 
        body: JSON.stringify({
            "value": 0,
            "fileID": id
        }),
        method:"UPDATE"
    })
        .then(response => { console.log(response); location.reload(); })
        .catch(error => { console.log(error); });
}


document.addEventListener("DOMContentLoaded", () => {
    const csrf = document.querySelector("#csrfHolder").children[0].value;
    let lastId = document.querySelector("#lastId").innerHTML;
    let lastPosition = 0;


    document.getElementById("showForm").addEventListener("click", () => {
        let arrow = document.querySelector("#showForm i");

        if (arrow.classList[1] === "fa-arrow-down") {
            arrow.className = "fa fa-arrow-up"
            document.querySelector("#formContainer").style.display = "block";
        } else {
            arrow.className = "fa fa-arrow-down"
            document.querySelector("#formContainer").style.display = "none";
        }
    });


    document.querySelectorAll(".fa-trash-o").forEach(button => {

        button.addEventListener("click", () => {
                deleteFile(csrf, button);                         
        });

        button.dataset["check"] = true;

    });

    document.querySelectorAll(".fa-eye-slash").forEach(button => {
        button.addEventListener("click", () => {
            hideFile(csrf, button);
        });

        button.dataset["check"] = true;
    })

    document.querySelectorAll(".fa-eye").forEach(button => {
        button.addEventListener("click", () => {
            unHideFile(csrf, button);
        });

        button.dataset["check"] = true;
    });

    let cap = document.querySelector("#projectsContainer > div:nth-child(2)");
    cap.addEventListener("scroll", () => {
        if ((cap.scrollTop + window.innerHeight) >= (cap.scrollHeight - 50)) {
            if (((lastId != null) || (lastId > 1)) && ((cap.scrollTop - lastPosition) > 50)) {

                fetch(`getPostsFiles/${lastId}`, {
                    method:"GET",
                    headers: {"Content-type":"application/json; charset=UTF-8"}
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data["ERR"] != undefined) {
                            console.log(data)
                            lastId = null;
                        } else {
                            let fragment = document.createDocumentFragment();

                            for (i of data["array"]) {
                                let view;
                                if (i.isPublic) {
                                    view = '<i class="fa fa-eye" aria-hidden="true"></i>'
                                } else {
                                    view = '<i class="fa fa-eye-slash" aria-hidden="true"></i>'
                                }

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

                                fragment.appendChild(temp)
                                lastId = i.id
                            }

                            document.querySelector("#projectsContainer > div:nth-child(2)").appendChild(fragment);

                            document.querySelectorAll(".fa-trash-o").forEach(button => {
                                if (button.dataset["check"] != true){
                                    button.addEventListener("click", () => {
                                            deleteFile(csrf, button);                         
                                    });

                                    button.dataset["check"] = true;
                                }
                            });
                        
                            document.querySelectorAll(".fa-eye-slash").forEach(button => {
                                if (button.dataset["check"] != true){
                                    button.addEventListener("click", () => {
                                        hideFile(csrf, button);
                                    });

                                    button.dataset["check"] = true;
                                }
                            })
                        
                            document.querySelectorAll(".fa-eye").forEach(button => {
                                if (button.dataset["check"] != true){
                                    button.addEventListener("click", () => {
                                        unHideFile(csrf, button);
                                    });

                                    button.dataset["check"] = true;
                                }
                            });
                        }

                    });

                lastPosition = cap.scrollTop;
            }
        }
    });
});