const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});

// look at broadcast api, and join with id
io.on("connection", (socket) => {
	const id = socket.handshake.query.id;
	socket.join(id);

	console.log("client connected to server");
	socket.on("send-message", ({ recipients, message }) => {
		console.log("Message received on server:", message);
		io.emit("message-recieved", message);
	});
});

server.listen(5000, () => {
	console.log("listening at port: 5000");
});
