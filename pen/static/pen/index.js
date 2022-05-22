document.addEventListener("DOMContentLoaded", () => {    
    scroll(0,0);

    document.querySelector("#goUp").style.display = "none";
});

document.addEventListener("scroll", () => {
    if (scrollY >= 150) {
        document.querySelector("#goUp").style.display = "flex";
    } else {
        document.querySelector("#goUp").style.display = "none";
    }
});