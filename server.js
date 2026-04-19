const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

const scripts = new Map()

app.post("/generate", (req, res) => {
  const html = req.body.html || ""
  const mode = req.body.mode || "append"

  const js = `
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

  res.json({
    url: `data:application/javascript;base64,${Buffer.from(js).toString("base64")}`
  })
})

app.get("/scripts/:id.js", (req, res) => {
  const script = scripts.get(req.params.id)

  if (!script) {
    return res.status(404).send("Not found")
  }

  res.setHeader("Content-Type", "application/javascript")
  res.send(script)
})

module.exports = app
