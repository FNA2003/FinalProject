document.addEventListener("DOMContentLoaded", () => {

    const csrf = document.querySelector("#csrfHolder").children[0].value;


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


    document.querySelectorAll(".fa-trash-o").forEach(button => {

        button.addEventListener("click", () => {
            const id = button.parentElement.parentElement.children[1].value;

            let a = prompt("Are you sure that you want to delete this file? (Y / N)");
            if (a.toUpperCase() == "Y"){
                fetch("/editFile", {
                    headers: {
                        "Content-type":"application/json; charset=UTF-8",
                        "X-CSRFToken":csrf
                    },
                    body:JSON.stringify({
                        "fileID":id
                    }),
                    method:"DELETE"
                })
                    .then(response => { console.log(response); location.reload() })
                    .catch(error => { console.log(error); });
            }                          
        });

    });

    document.querySelectorAll(".fa-eye-slash").forEach(button => {
        button.addEventListener("click", () => {
            const id =  button.parentElement.parentElement.children[1].value;

            fetch("/editFile", {
                headers: {
                    "Content-type":"application/json; charset=UTF-8",
                    "X-CSRFToken":csrf                    
                }, 
                body: JSON.stringify({
                    "value": 1,
                    "fileID": id
                }),
                method:"UPDATE"
            })
                .then(response => { console.log(response); location.reload(); })
                .catch(error => { console.log(error); });
        });
    })

    document.querySelectorAll(".fa-eye").forEach(button => {
        button.addEventListener("click", () => {
            const id =  button.parentElement.parentElement.children[1].value;

            fetch("/editFile", {
                headers: {
                    "Content-type":"application/json; charset=UTF-8",
                    "X-CSRFToken":csrf                    
                }, 
                body: JSON.stringify({
                    "value": 0,
                    "fileID": id
                }),
                method:"UPDATE"
            })
                .then(response => { console.log(response); location.reload(); })
                .catch(error => { console.log(error); });
        });
    });
});