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

let sessionID = "";

// socket.io
io.on("connect", (socket) => {
    log.info("connect : " + socket.id);
    socket.on("disconnect", () => {
        log.info("disconnect : " + socket.id);
    });

    socket.on("init", (data) => {
        log.info("init : " + socket.id);
        sessionID = data.sessionID;
        log.debug("sessionID : " + sessionID);
        io.emit("init", data);
    });

    socket.on("start", (data) => {
        if (data.sessionID !== sessionID) {
            log.error("sessionID is not match");
            return;
        }
        log.info("start : " + socket.id);
        io.emit("start", data);
    });

    socket.on("angles", (angles) => {
        if (sessionID === "") {
            log.error("sessionID is empty");
            return;
        }
        if (angles.sessionID !== sessionID) {
            log.error("sessionID is not match");
            return;
        }
        io.volatile.emit("angles", angles);
    });
    socket.on("shoot", (data) => {
        if (sessionID === "") {
            log.error("sessionID is empty");
            return;
        }
        if (angles.sessionID !== sessionID) {
            log.error("sessionID is not match");
            return;
        }
        io.emit("shoot", data);
        log.debug("shoot", data);
    });
    socket.on("hit", (data) => {
        io.emit("hit", data);
        log.debug("hit", data);
    });
    socket.on("score_update", (data) => {
        io.emit("score_update", data);
        log.debug("score_update", data);
    });
});

log.info("=== sever start ===");
httpServer.listen(3000);
