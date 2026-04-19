export default function handler(req, res) {
  // Handle CORS manually
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" })
  }

  const { html = "", mode = "append" } = req.body || {}

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

  res.status(200).json({
    id,
    url: `/scripts/${id}.js`,
    script: js
  })
}
