function likes(b) {
    b.addEventListener("click", () => {
        const father = b.parentElement.parentElement.parentElement;
        const author = father.children[1].innerHTML;
        const name = father.children[0].children[0].innerHTML;


        fetch("/likeFile", {
            method:"POST",
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                "author":author,
                "file":name
            })
        })
            .catch(error => { console.log(error); })
            .then(response => response.json() )
            .then(data => {
                console.log(data); 

                if (father.parentElement.parentElement.children.length === 1) {
                    location.reload();
                } else {
                    father.parentElement.remove();
                }
                
            })
            

    });
}


document.addEventListener("DOMContentLoaded", () => {
    scroll(0,0)
    let lastID = document.querySelector("#lastID");
    lastID.remove();
    lastID = lastID.innerHTML;
    let lastPosition = 0;


   document.querySelectorAll(".likeButton").forEach(button => {
        likes(button);
        button.dataset["check"] = true;
   });

   let separator = document.querySelector("#projectsContainer > div:nth-child(2)");
   separator.addEventListener("scroll",() => {

    if ((separator.scrollTop + window.innerHeight) >= (separator.scrollHeight - 50)) {

        if ((lastID > 1 || lastID != null) && ((separator.scrollTop - lastPosition) >= 50)) {

            fetch(`/getPostsLikes/${lastID}`, {
                method:"GET",
                headers:{"Content-type":"application/json; charset=UTF-8"}
            })
                .then(response => response.json())
                .then(data => {
                    if (data["array"] != undefined) {
                        let fragment = document.createDocumentFragment();
                        for (i of data["array"]) {
                            let temp = document.createElement("div");
                            temp.className = "projectContainer";
                            temp.innerHTML = `<div><iframe src="/view/${i.projectName}/${i.creator}" scrolling="no" sandbox></iframe></div>
                                            <div>
                                                <h4><strong>${ i.projectName }</strong></h4>
                                                <span>${ i.creator }</span>
                                                <div class="buttonsContainer">
                                                    <span> <i class="fa fa-thumbs-up likeButton" aria-hidden="true"></i> </span>
                                                    <a href="/view/${i.projectName}/${i.creator}"> <i class="fa fa-external-link-square" aria-hidden="true"></i> </a>
                                                </div>
                                            </div>`;
                            lastID = i.id
                            fragment.appendChild(temp);
                        }

                        document.querySelectorAll(".likeButton").forEach(button => {
                            console.log(button)
                        })
                        
                        document.querySelector("#projectsContainer > div:nth-child(2)").append(fragment);
                    } else {
                        console.log(data);
                        lastID = null;
                    }
                });

            lastPosition = separator.scrollTop;
        }
    }
   });
});