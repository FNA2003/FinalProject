document.addEventListener("DOMContentLoaded", () => {    
    let state = false;
    scroll(0,0);

    document.querySelector("#goUp").style.display = "none";

    document.querySelectorAll(".fullScreenSelector").forEach(container => {
        container.addEventListener("click", () => {
            let parent = container.parentElement;

            if (container.children[0].classList[1] === "fa-arrows-alt") {
                document.querySelector("#goUp").style.display = "none";

                container.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';

                document.querySelector("html").style.overflowY= "hidden";

                parent.style.cssText = `position: absolute;
                                        top: calc(4vh + ${scrollY}px);
                                        width: 75vw;
                                        height: 90vh;
                                        z-index: 10;`;

                parent.children[1].style.cssText = `height: 75%;`;
                parent.children[1].children[0].style.cssText = `width: 96%;
                                                                height: 100%;
                                                                margin: auto;`;

                parent.children[1].children[0].scrolling = "yes"

                parent.children[2].style.cssText = `width: 97.5%;
                                                    height: 17%;
                                                    border: 1px solid gray;`;
            } else {

                container.innerHTML = '<i class="fa fa-arrows-alt" aria-hidden="true"></i>';

                document.querySelector("html").style.overflowY= "auto";

                parent.children[1].children[0].scrolling = "no"

                parent.style.cssText = `position: static;`;

                /* We need to leave the element as it was */
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