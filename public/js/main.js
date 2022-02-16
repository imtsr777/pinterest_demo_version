let mainImages = document.querySelector(".main-images")

let localUser = JSON.parse(localStorage.getItem("username"))
let myId = JSON.parse(localStorage.getItem("myid"))

if(!localUser || !myId){
    window.location = "/register"
}

async function getPosts(){
    const api = "/posts_api"
    let info = await fetch(api)
    info = await info.json()
    render(info)
}

function createElement(elements){
    let newEl = []
    for(let j of elements){
        let el = document.createElement(j)
        newEl.push(el)
    }
    return newEl
}

function render(lst){
    for(let post of lst){
        [card,imgCont,photo,
        titImage,title,iconDiv,
        coment,dataDiv,time,data] = createElement(["div","div","img",
                                                "div","h4","div",
                                                "img","div","p","p"])
        
        let heart = document.createElement("img")
        dataDiv.classList = "data-time"
        time.textContent = post.time
        data.textContent = post.data
        dataDiv.append(time,data)
        if(post.reactedUsers.includes(myId)){
            heart.src = "green-love.png"
        }
        else{
            heart.src = "heart.png"
        }
        heart.classList = "heart-icon"
        coment.src = "comment.png"
        coment.classList = "heart-icon"
        iconDiv.append(heart,coment,dataDiv)
        iconDiv.classList.add("data-time-heart","img-content-padding")
        title.classList = "img-content-padding"
        title.textContent = post.title
        titImage.append(title)
        titImage.classList = "title-image"
        imgCont.classList = "image-container"
        photo.src = post.imageName
        imgCont.append(photo)
        card.append(imgCont,titImage,iconDiv)
        card.classList = "card"
        mainImages.append(card)

        heart.addEventListener('click',async ()=>{
            let api = `/posts/${post.imageId}`
            let response = await fetch(api,{
                method:"PUT",
                headers:{'content-type':'application/json'},
                body:JSON.stringify({userId:myId})
            })
            response = await response.json()
            response = JSON.parse(response)
            if(response.clicked){heart.src = "green-love.png"}
            else{heart.src = "heart.png"}
        })
    }
}


getPosts()