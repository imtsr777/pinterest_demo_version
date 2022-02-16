let mainImages = document.querySelector(".main-images")
let localUser = JSON.parse(localStorage.getItem("username"))
let myId = JSON.parse(localStorage.getItem("myid"))
let navbar = document.querySelector(".navbar")

if(!localUser || !myId){
    window.location = "/register"
}


async function getPosts(){
    const api = "/category_api"
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
    mainImages.innerHTML = null
    for(let post of lst){
        [card,img,div,title] = createElement(["div","img","div","h1"])
        card.classList.add("card","cat-card")
        img.src = post.name
        div.classList = "title-image"
        title.classList.add("img-content-padding","headers") 
        title.textContent = post.title
        div.append(title)
        card.append(img,div)
        mainImages.append(card)
        card.addEventListener('click',async()=>{
            let response = await fetch(`/category/${post.route}`)
            response = await response.json()
            render_posts(response)
            let a = document.createElement("a")
            a.textContent = "Category"
            a.setAttribute("href","/category")
            navbar.append(a)
        })
    }
}

function render_posts(lst){
    mainImages.innerHTML = null
    if(lst.length==0) return
    for(let post of lst){
        [card,imgCont,photo,
        titImage,title,iconDiv,heart,
        coment,dataDiv,time,data] = createElement(["div","div","img",
                                                "div","h4","div","img",
                                                "img","div","p","p"])
                                        
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