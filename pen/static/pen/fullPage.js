document.addEventListener("DOMContentLoaded", () => {
    let fileName = document.querySelector("#fileName").innerHTML;
    let author = document.querySelector("#authorName").innerHTML;

    if (document.body.innerHTML.length <= 580) {
        let header = document.createElement("img");
        header.src = "https://dustoffthebible.com/wp-content/uploads/2016/11/Business-cat-meme-blank.png";
        header.style.cssText = `display: block; 
                                margin: auto;
                                height: 94vh;`;

        let memeText = document.createElement("h1");
        memeText.innerHTML = "EMPTY";
        memeText.style.cssText = `position: absolute;
                                  top: 80vh;
                                  left: 0;
                                  width: 100%;
                                  text-align: center;
                                  color: white;
                                  text-shadow: 0 0 2px black;`;
        
        document.body.appendChild(header);
        document.body.appendChild(memeText);


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
    } 


    document.querySelectorAll(".likeButton").forEach(button => {
        button.style.display = "block";
        button.addEventListener("click", () => {


            if (button.classList[1] === "fa-thumbs-up") {
                fetch("/likeFile", {
                    method:"POST",
                    headers:{
                        "Content-type":"application/json; charset=UTF-8"
                    },
                    body: JSON.stringify({
                        "action":"Take off",
                        "author":author,
                        "file":fileName
                    })
                })
                    .then(response => { console.log(response); location.reload(); })
                    .catch(error => { console.log(error); location.reload(); });
            } else {
                fetch("/likeFile", {
                    method:"POST",
                    headers:{
                        "Content-type":"application/json; charset=UTF-8"
                    },
                    body: JSON.stringify({
                        "action":"Put",
                        "author":author,
                        "file":fileName
                    })
                })
                    .then(response => { console.log(response); location.reload(); })
                    .catch(error => { console.log(error); location.reload(); });
            }
        });
    });

    document.querySelector("#likeButtonContainer").style.display = "flex";
    document.querySelector("#HOME-BUTTON a").style.display = "block";
    
});