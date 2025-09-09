// index.js

const express = require("express")
const app = express()
const { createProxyMiddleware } = require("http-proxy-middleware")

app.get("/", (req, res) => {
    res.send("This is my proxy server")
})

app.use("/corona-tracker-world-data", (req, res, next) => {
    createProxyMiddleware({
        target: "https://monotein-books.vercel.app/api/corona-tracker/summary",
        changeOrigin: true,
        pathRewrite: {
            [`^/corona-tracker-world-data`]: "",
        },
    })(req, res, next)
})

const port = process.env.PORT || 5050

app.listen(port, () => {
    console.log("Listening on localhost port 5050")
})

