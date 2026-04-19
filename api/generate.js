export default function handler(req, res) {
  try {
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

    return res.status(200).json({
      id,
      url: `/scripts/${id}.js`,
      script: js
    })

  } catch (err) {
    return res.status(500).json({
      error: "server crashed",
      details: err.message
    })
  }
}
