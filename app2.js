const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const WsServer = require("ws").Server;
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

const wss = new WsServer({ noServer: true });
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

httpServer.removeAllListeners("upgrade");
httpServer.on("upgrade", (request, socket, head) => {
    log.info("httpServer upgrade");
    wss.handleUpgrade(request, socket, head, (ws) => {
        log.info(`connected`);

        ws.on("message", (message) => {
            console.log(`WebSocket received: ${message}`);
        });

        ws.on("close", () => {
            log.info(`disconnected`);
        });
    });
});

function webSocketBroadcast(data) {
    const sendMsg = JSON.stringify(data);
    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(sendMsg);
        }
    });
}

// socket.io
io.on("connect", (socket) => {
    log.info("connect : " + socket.id);
    socket.on("disconnect", () => {
        log.info("disconnect : " + socket.id);
    });

    socket.on("angles", (angles) => {
        // TODO sessionIDで現在のユーザーかどうかを判定する
        webSocketBroadcast({ event_name: "angles", x: angles.x, y: angles.y, z: angles.z });
        io.emit("angles", angles);
        log.debug("angles", data);
    });
    socket.on("shoot", (data) => {
        // TODO sessionIDで現在のユーザーかどうかを判定する
        log.debug("shoot", data);
        webSocketBroadcast({ event_name: "shoot", x: data.x, y: data.y, z: data.z });
        io.emit("shoot", data);
    });
});

log.info("=== sever start ===");
httpServer.listen(5000);
