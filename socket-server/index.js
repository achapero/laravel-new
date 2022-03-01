require("dotenv").config();
const app = require("express")();
const fs = require("file-system");
if (process.env.APP_ENV == "local") {
    const http_server = require("http").createServer(app);
    const io_http = require("socket.io")(http_server);
    io_http.on("connection", socket => {
        socket.on("message", ({ message }) => {
            console.log("message", message);
            io_http.emit("message", message);
        });
        socket.on("connect_error", err => {
            console.log(`connect_error due to ${err.message}`);
        });
        socket.on("connection", connection => {
            console.log("connection");
        });
    });
    http_server.listen(4001, function() {
        console.log("listening on port 4001");
    });
} else {
    const https_server = require("https").createServer(
        {
            key: fs.readFileSync(
                "/home/promise/public_html/new/socket-server/keys/privkey.pem"
            ),
            cert: fs.readFileSync(
                "/home/promise/public_html/new/socket-server/keys/fullchain.pem"
            )
        },
        app
    );
    const io_https = require("socket.io")(https_server);
    io_https.on("connection", socket => {
        socket.on("message", ({ message }) => {
            io_https.emit("message", message);
        });
    });
    https_server.listen(4001, function() {
        console.log("listening on port 4001");
    });
}
