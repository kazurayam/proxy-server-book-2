// index.js

const express = require("express")
const app = express()
const { createProxyMiddleware } = require("http-proxy-middleware")
require("dotenv").config()
const url = require("url")

app.get("/", (req, res) => {
    res.send(
        "<ul>" +
        "<li><a href='/corona-tracker-world-data'>/corona-tracker-world-data</a></li>" +
        "<li><a href='/weather-data?city=tokyo'>/weather-data?city=tokyo</a></li>" +
        "<li><a href='https://github.com/chimurai/http-proxy-middleware/compare/v2.0.6...v3.0.5#diff-07e6ad10bda0df091b737caed42767657cd0bd74a01246a1a0b7ab59c0f6e977'>GitHub compare v2.0.6...v3.0.5</a></li>" +
        "</ul>"
    )
})

// log the original request and the proxied response
// quoted from https://github.com/chimurai/http-proxy-middleware/discussions/530
const handleProxyReq = (proxyReq, req, res) => {
    console.log(`[on proxyReq] ${req.method} ${req.path} -> ${proxyReq.path}`)
    //https://github.com/chimurai/http-proxy-middleware/issues/368
    /*
    if (proxyReq.path.endsWith('/')) {
        proxyReq.path = proxyReq.path.slice(0, -1);
    }
    */
}
const handleProxyRes = (proxyRes, req, res) => {
    console.log(`[on proxyRes] ${req.method} ${req.path} -> ${proxyRes.req.protocol}//${proxyRes.req.host}${proxyRes.req.path} [${proxyRes.statusCode}]`)
    console.log("proxyRes.headers: " + JSON.stringify(proxyRes.headers, true, 2))
}

app.use(
    '/corona-tracker-world-data',
    (req, res, next) => {
        createProxyMiddleware({
            target: `${process.env.BASE_API_CORONA_WORLD_URL_SCHEME_AUTHORITY}${process.env.BASE_API_CORONA_WORLD_URL_PATH}`,
            changeOrigin: true,
            ignorePath: true,    // https://stackoverflow.com/questions/76682632/trailing-slash-appended-by-http-proxy-middleware-in-requests
            on: {
                proxyReq: handleProxyReq,
                proxyRes: handleProxyRes,
            }
        })(req, res, next)
    }
)

app.use(
    '/weather-data',
    (req, res, next) => {
        const city = url.parse(req.url).query
        createProxyMiddleware({
            target: `${process.env.WEATHERAPI_URL_SCHEME_AUTHORITY}${process.env.WEATHERAPI_URL_PATH}${city}&api=no`,
            changeOrigin: true,
            on: {
                proxyReq: handleProxyReq,
                proxyRes: handleProxyRes,
            }
        })(req, res, next)
    }
)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Listening on localhost port ${port}`)
})

module.exports = app
