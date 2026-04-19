const express = require("express")
const cors = require("cors")

const app = express()

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}

app.use(cors(corsOptions))
app.use(express.json())

app.options("*", cors(corsOptions))

const scripts = new Map()

app.post("/generate", (req, res) => {
  const html = req.body.html || ""
  const mode = req.body.mode || "append"

  const id = Math.random().toString(36).substring(2, 10)

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

  scripts.set(id, js)

  res.json({
    id,
    url: `/scripts/${id}.js`
  })
})

app.get("/scripts/:id.js", (req, res) => {
  const script = scripts.get(req.params.id)

  if (!script) {
    return res.status(404).send("Not found")
  }

  res.setHeader("Content-Type", "application/javascript")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.send(script)
})

module.exports = app
