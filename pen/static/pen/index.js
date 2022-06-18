document.addEventListener("DOMContentLoaded", () => {
    let lastScroll = null;
    scroll(0,0);

    document.querySelector("#goUp").style.display = "none";

    document.querySelectorAll(".fullScreenSelector").forEach(container => {
        container.addEventListener("click", () => {
            let parent = container.parentElement;

            if (container.children[0].classList[1] === "fa-arrows-alt") {
                lastScroll = window.scrollY;

                container.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';

                document.querySelector("html").style.overflowY= "hidden";
                document.querySelector("#goUp").style.display = "none";

                parent.children[1].children[0].scrolling = "yes"
                
                scroll(0,0);

                parent.style.animationName = "fullScreen";
                parent.style.animationPlayState  = "running";
            } else {
                scroll(0, lastScroll);

                container.innerHTML = '<i class="fa fa-arrows-alt" aria-hidden="true"></i>';

                document.querySelector("html").style.overflowY= "auto";
                parent.children[1].children[0].scrolling = "no";
                
                parent.style.animationName = "none";
            }
            
        });
    });

    document.querySelectorAll(".likeButton").forEach(button => {
        button.addEventListener("click", () => {
            
            let name = button.parentElement.parentElement.children[2].children[1].children[0].innerHTML;
            let author = button.parentElement.parentElement.children[2].children[2].children[0].innerHTML

            if(button.classList[1] === "fa-thumbs-up") {
                fetch("/likeFile", {
                    method:"POST",
                    headers:{
                        "Content-type":"application/json; charset=UTF-8"
                    },
                    body: JSON.stringify({
                        "action":"Take off",
                        "author":author,
                        "file":name
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
                        "file":name
                    })
                })
                    .then(response => { console.log(response); location.reload(); })
                    .catch(error => { console.log(error); location.reload(); });

            }
        });
    });
});

document.addEventListener("scroll", () => {
    if (scrollY >= 150) {
        document.querySelector("#goUp").style.display = "flex";
    } else {
        document.querySelector("#goUp").style.display = "none";
    }


    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 100)) {
        
        /*

        WE REACHED THE END OF THE PAGE, WE SHOULD BE ABLE TO REQUEST MORE POSTS
        
        */




    }
});