const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { createHash } = require("crypto");
const cors = require("cors");

const logger = require("./logging");
const log = new logger.Logger();

const app = express();
app.use(cors());
const httpServer = createServer(app);

app.get("/", function (request, response) {
    response.sendFile(__dirname + "/index.html");
});

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

// socket.io
io.on("connect", (socket) => {
    log.info("connect : " + socket.id);
    socket.on("disconnect", () => {
        log.info("disconnect : " + socket.id);
    });

    socket.on("angles", (angles) => {
        // TODO sessionIDで現在のユーザーかどうかを判定する
        io.emit("angles", angles);
    });
    socket.on("shoot", (data) => {
        // TODO sessionIDで現在のユーザーかどうかを判定する
        log.debug("shoot", data);
        io.emit("shoot", data);
    });
});

log.info("=== sever start ===");
httpServer.listen(3000);
