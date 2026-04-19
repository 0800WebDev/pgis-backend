const express=require("express")
const cors=require("cors")
const fs=require("fs")
const path=require("path")

const app=express()

app.use(cors())
app.use(express.json())

const scriptsDir=path.join(__dirname,"scripts")

if(!fs.existsSync(scriptsDir)){
fs.mkdirSync(scriptsDir)
}

app.post("/generate",(req,res)=>{

const html=req.body.html
const mode=req.body.mode

const id=Math.random().toString(36).substring(2)

const js=`
(function(){

const mode="${mode}"
const html=\`${html}\`

if(mode==="replace"){
document.open()
document.write(html)
document.close()
}else{
document.body.insertAdjacentHTML("beforeend",html)
}

})();
`

fs.writeFileSync(path.join(scriptsDir,id+".js"),js)

res.json({
url:"https://pgis-backend.vercel.app/scripts/"+id+".js"
})

})

app.use("/scripts",express.static(scriptsDir))

const PORT = process.env.PORT || 3000
app.listen(PORT)
