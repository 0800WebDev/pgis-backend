import { Redis } from "@upstash/redis"

export default async function handler(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    if (req.method === "OPTIONS") {
      return res.status(200).end()
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Use POST" })
    }

    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error("Missing Redis env vars")
    }

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    })

    const { html = "", mode = "append" } = req.body || {}

    const id = Math.floor(Math.random() * 1e9).toString()

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

    res.status(200).json({
      url: `https://pgis-backend.vercel.app/api/script?id=${id}`
    })

  } catch (err) {
    console.error(err)

    res.status(500).json({
      error: "Server crashed",
      message: err.message
    })
  }
}
