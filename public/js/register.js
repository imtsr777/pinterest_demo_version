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

    let postApi = "http://192.168.0.70:3020/register"
    let res = await fetch(postApi,{
        method:"POST",
        headers:{'content-type':'application/json'},
        body:JSON.stringify({
            userName:username.value,
            password:password.value,
            email:email.value
        })
    })
    res = await res.json()

    if(!res.user){
        alert(res.message)
    }

    else{
        localStorage.setItem("username",JSON.stringify(username.value))
        localStorage.setItem("myid",JSON.stringify(res.id))
        window.location = '/posts'
    }
})