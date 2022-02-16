let select = document.getElementById("cat-select");
let form = document.getElementById("form")
let file = document.getElementById("file")
let title = document.getElementById("title")
let formData = new FormData()

let localUser = JSON.parse(localStorage.getItem("username"))
let myId = JSON.parse(localStorage.getItem("myid"))

if(!localUser || !myId){
    window.location = "/register"
}

let catFetch=async()=>{
    let response = await fetch("/category_api")
    response =await response.json()
    for(let j of response){
        let opt = document.createElement("option")
        opt.value = j.route
        opt.textContent = j.title
        select.append(opt)
    }
}

catFetch()

form.addEventListener("submit",async(event)=>{
    event.preventDefault()

    formData.append("file",file.files[0])
    formData.append("title",title.value)
    formData.append("userId",myId)
    formData.append("category",select.value)
    formData.append("username",localUser)


    let res = await fetch("/upload_image",{
        method:"POST",
        body:formData
    })

    res = await res.json()
    // res = JSON.parse(res)
    console.log(res)
    if(!res.upload){
        alert(res.message)
    }

    else{
        window.location = "/posts"
    }

})