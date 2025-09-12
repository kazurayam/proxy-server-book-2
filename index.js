// index.js

const express = require("express")
const app = express()
const { createProxyMiddleware  } = require("http-proxy-middleware")
const rateLimit = require("express-rate-limit")
require("dotenv").config()
const url = require("url")

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
})

app.get("/", (req, res) => {
    const params = url.parse(req.url).query
    console.log(params)
    res.send("This is my proxy server")
})

app.use(limiter, (req, res, next) => {
    createProxyMiddleware({
        target: process.env.BASE_API_CORONA_WORLD_URL_SCHEME_AUTHORITY,
        changeOrigin: true,
        pathRewrite: {
            [`^/corona-tracker-world-data`]: process.env.BASE_API_CORONA_WORLD_URL_PATH,
        },
    })(req, res, next)
})

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Listening on localhost port ${port}`)
})

