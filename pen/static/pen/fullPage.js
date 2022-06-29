document.addEventListener("DOMContentLoaded", () => {
    let name = document.querySelector("#fileName").innerHTML;
    let author = document.querySelector("#authorName").innerHTML;

    let check = document.querySelector("#empty") === null;
    
    if (check === false) {
        let anchor = document.querySelector("#HOME-BUTTON a");
        
        anchor.style.cssText = `position: absolute;
                                width: 95%;
                                text-align: center;
                                top: 5vh;`
        anchor.innerHTML = '<i class="fa fa-home" aria-hidden="true"></i>'

        document.querySelector("body > div").style.cssText = "margin-top: 0;";
        document.body.style.cssText = ` background: rgb(201,64,137);
                                        background: radial-gradient(circle, rgba(201,64,137,1) 0%, rgba(95,47,208,1) 55%, 
                                        rgba(16,90,185,1) 75%); `;

        document.querySelector("#likeButtonContainer").style.display = "none";
        document.querySelector("#empty").style.display = "block";
    }


    document.querySelectorAll(".likeButton").forEach(button => {
        button.style.display = "block";
        button.addEventListener("click", () => {
            
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
                .then(response => response.json())
                .then(data => {
                    console.log(data); 
                    
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
                
        });
    });


    try {
        document.querySelector("#likeButtonContainer").style.display = "flex";
    }
    catch (error) {
        /* pass */
    }    
    
    document.querySelector("#HOME-BUTTON a").style.display = "block";
    console.clear();
});

