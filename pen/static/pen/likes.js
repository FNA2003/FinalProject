document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".likeButton").forEach(button => {
        button.addEventListener("click", () => {
            const father = button.parentElement.parentElement.parentElement;
            const author = father.children[1].innerHTML;
            const name = father.children[0].children[0].innerHTML;

    
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
                .then(response => response.json() )
                .then(data => {
                    console.log(data); 

                    if (father.parentElement.parentElement.children.length === 1) {
                        location.reload();
                    } else {
                        father.parentElement.remove();
                    }
                    
                })
                

        });
    });
});