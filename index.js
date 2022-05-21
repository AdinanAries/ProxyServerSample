//https://www.twilio.com/blog/node-js-proxy-server

//server framework import and server creation
const express = require('express');
const app = express();
//loggin module
const morgan = require('morgan');
app.use(morgan('dev'));

//proxy middleware
const { createProxyMiddleware } = require('http-proxy-middleware');

//configuration
const PORT = process.env.PORT || 4005;
const HOST = 'localhost';
const API_SERVICE_URL = 'https://jsonplaceholder.typicode.com';

//for getting server information
app.get('/info', (req, res)=>{
    res.send("This is a proxy service which proxies to Billing and Account APIs.");
});

//for authorization/permission handling middleware
app.use('', (req, res, next)=>{
    if(req.headers.authorization){
        next();
    }else{
        res.sendStatus(403);
    }
});

//proxy endpoint
app.use('/json_placeholder', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        ['^/json_placeholder']: ''
    }
}));
//proxy maps localhost:3000/json_placeholder/posts/1 to <API_SERVICE_URL>/posts/1 
//(in this case: https://jsonplaceholder.typicode.com/posts/1), 
//thus removing /json_placeholder which the API doesn’t need.

//start the proxy
app.listen(PORT, HOST, ()=>{
    console.log(`Starting Proxy on ${HOST}:${PORT}`);
});