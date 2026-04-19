import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
})

export default async function handler(req, res) {
  const { id } = req.query

  const js = await redis.get(id)

  if (!js) {
    return res.status(404).send("Not found")
  }

  res.setHeader("Content-Type", "application/javascript")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.send(js)
}
