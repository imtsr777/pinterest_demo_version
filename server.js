const fs = require('fs')
const express = require('express')
const myModules = require('./public/js/js_files.js')
const fileUpload = require('express-fileupload')
const app = express()
const PORT = process.env.PORT || 3021
const path = require('path')



app.use(fileUpload())
app.use(express.static(path.join(__dirname,"public")))
app.use(express.static(path.join(__dirname,"images")))
app.use(express.json())

app.get("/register",(req,res)=>{
    res.sendFile(path.join(__dirname,"html_files","register.html"))
})

app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"html_files","login.html"))
})

app.get("/posts",(req,res)=>{
    res.sendFile(path.join(__dirname,"html_files","main.html"))
})

app.get("/posts_api",(req,res)=>{
    let posts = fs.readFileSync(path.join(__dirname,"database","images.json"),'utf-8')
    posts = JSON.parse(posts)
    res.json(posts)
})

app.get("/category_api",(req,res)=>{
    let posts = fs.readFileSync(path.join(__dirname,"database","category.json"),'utf-8')
    posts = JSON.parse(posts)
    res.json(posts)
})

app.get("/category/:name",(req,res)=>{
    let posts = fs.readFileSync(path.join(__dirname,"database","images.json"),'utf-8')
    posts = JSON.parse(posts)
    let filtered = posts.filter(el=>{
        if(req.params.name == el.category){
            return el
        }
    })

    res.json(filtered)
})

app.put("/posts/:id",(req,res)=>{
    let posts = fs.readFileSync(path.join(__dirname,"database","images.json"),'utf-8')
    posts = JSON.parse(posts)
    let mesId = req.params.id
    let clicked

    for(let j of posts){
        if(j.imageId == mesId){
            if(j.reactedUsers.includes(req.body.userId)){
                let newReacted = j.reactedUsers.filter(el=>{
                    if(el != req.body.userId){
                        return el
                    }
                })
                
                j.reactedUsers = newReacted
                clicked = false
            }
            else{
                j.reactedUsers.push(req.body.userId)
                clicked = true
            }
            break
        }
    }
    posts = JSON.stringify(posts,null,4)
    fs.writeFileSync(path.join(__dirname,"database","images.json"),posts)
    res.json(JSON.stringify({clicked}))
})

app.post("/register",async (req,res)=>{
    let info = req.body

    let users = fs.readFileSync(path.join(__dirname,"database","users.json"),'utf-8')
    users = JSON.parse(users || "[]")
    
    for(let j of users){
        if(j.userName == info.userName){
            return res.json({message:"This username have",user:false})
        }
        
        else if(j.email == info.email){
            return res.json({message:"This email is already exists",user:false})
        }
    }
    
    if(info.password.length != 8){
        return res.json({message:"Password length must be 8 "})
    }

    if(info.userName.length > 20){
        return res.json({message:"Username length longer 10",user:false})
    }
    let newId = myModules.randomId()
    info.userId = newId
    users.push(info)
    users = JSON.stringify(users,null,4)    
    fs.writeFileSync(path.join(__dirname,"database","users.json"),users)
    res.json({message:"Saved",user:true,id:newId})
})

app.post("/login",(req,res)=>{
    let info = req.body

    let users = fs.readFileSync(path.join(__dirname,"database","users.json"),'utf-8')
    users = JSON.parse(users || "[]")

    users.filter(el=>{
        if(el.userName == info.userName){
            if(el.password == info.password){
                return res.json({userName:el.userName,userId:el.userId,logged:true})
            }
            else{
                return res.json({logged:false,message:"Password no correct"})
            }
        }
    })

    return res.json({logged:false,message:"No login like this"})
})


app.get("/category",(req,res)=>{
    res.sendFile(path.join(__dirname,"html_files","category.html"))
})

app.get("/upload_image",(req,res)=>{
    res.sendFile(path.join(__dirname,"html_files","upload_image.html"))
})

app.post("/upload_image",(req,res)=>{
    const {file} = req.files
    let title = req.body.title
    let userId = parseInt(req.body.userId)
    let imageId = parseInt(myModules.randomId())
    let imageName = req.files.file.name
    let username = req.body.username
    let data = myModules.createData()
    let time = myModules.createTime()
    let category = req.body.category
    let cheking = imageName.split(".")
    let types = ['png','jpg','svg','jpeg']
    let count = 0
    
    for(let j of types){
        if(j==cheking[cheking.length-1]){
            count=1
        }
    }

    if(!count){
        return res.json({upload:false,message:"Only image please"})
    }

    let newObj = {userId,username,imageId,imageName,reactedUsers:[],title,time,data,category,comments:[]}

    let posts = fs.readFileSync(path.join(__dirname,"database","images.json"),'utf-8')
    posts = JSON.parse(posts)
    posts.push(newObj)
    
    file.mv(path.join(__dirname,"images",imageName))
    posts = JSON.stringify(posts,null,4)
    fs.writeFileSync(path.join(__dirname,"database","images.json"),posts)

    res.json({upload:true,message:"OK"})

})

app.get("/top_liked",(req,res)=>{
    let posts = fs.readFileSync(path.join(__dirname,"database","images.json"),'utf-8')
    posts = JSON.parse(posts)
    let maxObj = posts[0]
    let max = posts[0].reactedUsers.length
    for(let j=0;j< posts.length;j++){
        if(posts[j].reactedUsers.length>max){
            maxObj = posts[j]
        }
    }
    
    maxObj = [maxObj]
    res.json(maxObj)
})
app.get("/top",(req,res)=>{
    res.sendFile(path.join(__dirname,"html_files","top_liked.html"))
})

app.listen(PORT,()=>{console.log("Server is running...")})