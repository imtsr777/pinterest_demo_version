const form = document.querySelector('.form')
const username = document.getElementById('username')
const password = document.getElementById('password')
const email = document.getElementById('email')

let localUser = localStorage.getItem("username")
let myId = localStorage.getItem("myid")

if(localUser || myId){
    window.location = "/posts"
}


form.addEventListener('submit',async (event)=>{
    event.preventDefault()

    let res = await fetch("/login",{
        method:"POST",
        headers:{'content-type':'application/json'},
        body:JSON.stringify({
            userName:username.value,
            password:password.value,
        })
    })
    console.log(res)
   res = await res.json()
    
    if(!res.logged){
        alert(res.message)
    }

    else{
        localStorage.setItem("username",JSON.stringify(res.userName))
        localStorage.setItem("myid",JSON.stringify(res.userId))
        window.location = '/posts'
    }
})