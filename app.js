const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { createHash } = require("crypto");
const cors = require("cors");

const app = express();
const httpServer = createServer(app);

app.use(cors());

// ユーザー管理
let Games = {
    Game1: {
        playerCount: 0,
        token: "",
        roomId: "",
        usersInfo: {},
    },
    Game2: {
        playerCount: 0,
        token: "",
        roomId: "",
        usersInfo: {},
    },
};

// TODO マスタートークを実装する
const MasterToken = "dev";

app.get("/", function (request, response) {
    response.sendFile(__dirname + "/index.html");
});

app.get("/init", function (request, response) {
    const userMasterToken = request.query.MasterToken;
    const nameSpace = request.query.nameSpace;

    if (!userMasterToken) {
        response.status(400).send("MasterTokenが設定されていません");
        return;
    }
    if (!(userMasterToken === MasterToken)) {
        response.status(400).send("MasterTokenが違います");
        return;
    }
    if (!nameSpace) {
        response.status(400).send("nameSpaceが設定されていません");
        return;
    }

    // ルームID、トークンを作成
    const roomId = createHash("sha1").update(new Date().toString()).digest("hex");
    const token = createHash("sha256")
        .update(new Date().toString() + roomId + "♡")
        .digest("hex");

    Games[nameSpace] = {
        playerCount: 0,
        token: token,
        roomId: roomId,
        usersInfo: {},
    };
    response.json(Games[nameSpace]);
});

app.get("/join", function (request, response) {
    const token = request.query.token;
    const nameSpace = request.query.nameSpace;

    if (!nameSpace) {
        response.status(400).json({ reason: "nameSpaceが設定されていません" });
        return;
    }
    if (!Games[nameSpace]) {
        response.status(400).json({ reason: "nameSpaceが存在していません" });
        return;
    }
    if (!token) {
        response.status(400).json({ reason: "tokenが設定されていません" });
        return;
    }
    if (token === MasterToken) {
        // マスタートークンは許可
        Games[nameSpace].playerCount++;
        response.json(Games[nameSpace]);
        return;
    }
    if (!(token === Games[nameSpace].token)) {
        response.status(401).json({ reason: "tokenが違います" });
        return;
    }

    Games[nameSpace].playerCount++;
    response.json(Games[nameSpace]);
});

const io = new Server(httpServer, {
    cors: {
        origins: ["http://localhost:3001", "https://localhost:3000"],
    },
});

// ネームスペースを設定
ioGame1 = io.of("/Game1");
ioGame2 = io.of("/Game2");

// ユーザー認証
ioGame1.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        console.log("トークンが設定されていません");
        return next(new Error("トークンが設定されていません"));
    }
    if (token === MasterToken) {
        // マスタートークンでアクセスした時は許可する
        return next();
    }

    if (!(token === Games["Game1"].token)) {
        return next(new Error("トークンが違います"));
    }
    return next();
});

// Game1のメイン
ioGame1.on("connect", (socket) => {
    const token = socket.handshake.auth.token;
    console.log("connect : " + socket.id);
    socket.on("disconnect", () => {});
    socket.on("setInfo", (info) => {
        Games["Game1"].usersInfo[socket.id] = info;
    });
});

console.log("=== sever start ===");
httpServer.listen(4000);
