document.addEventListener("DOMContentLoaded", () => {
    console.log(document.body.innerHTML.length);
    if (document.body.innerHTML.length <= 184) {
        let header = document.createElement("img");
        header.src = "https://dustoffthebible.com/wp-content/uploads/2016/11/Business-cat-meme-blank.png";
        header.style.cssText = `display: block; 
                                margin: auto;
                                height: 94vh;`;

        let memeText = document.createElement("h1");
        memeText.innerHTML = "EMPTY";
        memeText.style.cssText = `position: absolute;
                                  top: 80vh;
                                  left: 0;
                                  display: block;
                                  width: 100%;
                                  text-align: center;
                                  color: white;
                                  text-shadow: 0 0 2px black;`;
        
        document.body.appendChild(header);
        document.body.appendChild(memeText);

        let anchor = document.querySelector("#HOME-BUTTON a");
        anchor.style.cssText = `position: absolute;
                                display: block;
                                width: 95%;
                                text-align: center;
                                top: 5vh;`
        anchor.innerHTML = '<i class="fa fa-home" aria-hidden="true"></i>'
    }
});