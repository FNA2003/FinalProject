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
                .then(response => { 
                    console.log(response); 

                    if (father.parentElement.parentElement.children.length === 1) {
                        location.reload();
                    } else {
                        father.parentElement.remove();
                    }
                })
                .catch(error => { console.log(error); });

        });
    });
});