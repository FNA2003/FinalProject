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
});

document.addEventListener("scroll", () => {
    if (scrollY >= 150) {
        document.querySelector("#goUp").style.display = "flex";
    } else {
        document.querySelector("#goUp").style.display = "none";
    }
});