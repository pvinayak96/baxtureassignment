const cluster = require('cluster');
const cpus = require('os').cpus().length;
require('dotenv').config();
const express = require('express');

if (cluster.isMaster) {
    servers = [];
    for (let i = 0; i < cpus - 1; i++) {
        const port = parseInt(process.env.PORT) + i + 1;
        servers.push(port);
        cluster.fork({ PORT: port })
    }

    //Load balancer
    const app = express();

    app.listen(process.env.PORT, process.env.HOST, () => {
        console.log("Load balancer is listening on " + process.env.HOST + " at " + process.env.PORT + " port")
    });

    let currentServer = -1;

    app.use((req, res, next) => {
        currentServer = (currentServer + 1) % servers.length; //Round robin algorithm
        console.log(`http://${process.env.HOST}:${servers[currentServer]}${req.url}`);
        res.redirect(302, `http://[::1]:${servers[currentServer]}${req.url}`);
    })

}
else {
    startServer(); //Calling to start servers as child process while forking
}

function startServer() {
    const express = require("express");
    const bodyParser = require('body-parser');
    require('dotenv').config();

    const app = express();

    app.listen(process.env.PORT, process.env.HOST, () => {
        console.log("Server is listening on " + process.env.HOST + " at " + process.env.PORT + " port")
    })

    //Middleware to parse JSON requests
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use('/api', require('./routes/users.js'))

    //Handling non-existing endpoints
    app.use((req, res, next) => {
        res.status(404).json({ error: 'Requested resource not found' })
    })

    app.use((err, req, res, next) => {
        console.error(err); //For logging/debugging purposes
        res.status(500).json({ error: 'Internal Server Error' })
    })


}