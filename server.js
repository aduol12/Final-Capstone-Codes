const http = require("http")
const fs = require("fs")
const path = require("path")

const PORT = process.env.PORT || 5173

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`)

  // Handle root path
  const filePath = req.url === "/" ? path.join(__dirname, "index.html") : path.join(__dirname, req.url)

  const extname = path.extname(filePath)
  const contentType = MIME_TYPES[extname] || "application/octet-stream"

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Page not found
        fs.readFile(path.join(__dirname, "404.html"), (err, content) => {
          if (err) {
            // If 404.html is not found, send a simple error message
            res.writeHead(404, { "Content-Type": "text/html" })
            res.end("<h1>404 Not Found</h1>", "utf-8")
          } else {
            res.writeHead(404, { "Content-Type": "text/html" })
            res.end(content, "utf-8")
          }
        })
      } else {
        // Server error
        res.writeHead(500)
        res.end(`Server Error: ${err.code}`)
      }
    } else {
      // Success
      res.writeHead(200, { "Content-Type": contentType })
      res.end(content, "utf-8")
    }
  })
})

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`)
})

