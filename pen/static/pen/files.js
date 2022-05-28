document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#newFile-Holder button").addEventListener("click", () => {
        
        let formHolder = document.querySelector("#formHolder");
        formHolder.style.animationName = "none";
        
        if (window.getComputedStyle(formHolder).display === "none") {
            formHolder.style.display = "flex";
            document.querySelector("#newFile-Holder button").innerHTML = "Close Tab";
            formHolder.style.animationName = "appearForm";
        } else {
            document.querySelector("#newFile-Holder button").innerHTML = "New File";
            formHolder.style.animationName = "none";
            formHolder.style.display = "none";            
        }


    });


    document.querySelectorAll(".fa-pencil").forEach(button => {

        button.addEventListener("click", () => {
            /* TODO: THIS */
        });


    });

    document.querySelectorAll(".fa-trash-o").forEach(button => {

        button.addEventListener("click", () => {
            /* TODO: THIS */
        });

    });
});