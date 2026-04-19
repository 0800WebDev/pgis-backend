const express = require("express")
const cors = require("cors")
const { Redis } = require("@upstash/redis")

const app = express()

app.use(cors())
app.use(express.json())

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
})

app.post("/generate", async (req, res) => {
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

  await redis.set(id, js)

  res.json({
    id,
    url: `/scripts/${id}.js`
  })
})

app.get("/scripts/:id.js", async (req, res) => {
  const js = await redis.get(req.params.id)

  if (!js) {
    return res.status(404).send("Not found")
  }

  res.setHeader("Content-Type", "application/javascript")
  res.send(js)
})

module.exports = app
