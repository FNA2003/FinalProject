document.addEventListener("DOMContentLoaded", () => {    
    let state = false;
    scroll(0,0);

    document.querySelector("#goUp").style.display = "none";

    document.querySelectorAll(".projectHolder").forEach(holder => {
        holder.addEventListener("click", () => {
            let popUp = document.querySelector("#window");

            if (state === false){
                popUp.style.cssText = `display:block;
                                    position: absolute;
                                    top:  calc(9vh + ${window.scrollY}px);
                                    left: 25vw;
                                    width: 50vw;
                                    height: 90vh;
                                    background: red;`;

                state = true;
            } else {
                popUp.style.cssText = `display: none;`;
                state = false;
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