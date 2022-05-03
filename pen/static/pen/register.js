document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".warning").innerHTML.trim() === "") {
        document.querySelector(".warning").remove();
    }
});