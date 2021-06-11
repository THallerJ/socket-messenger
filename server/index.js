const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});

io.on("connection", (socket) => {
	const id = socket.handshake.query.userId;
	console.log("id:", id);
	socket.join(id);

	console.log("client connected to server");
	socket.on("send-message", ({ recipients, message }) => {
		console.log("Message recieved on server:", message);

		recipients.forEach((recipient) => {
			console.log("recipient id:", recipient);
			io.to(recipient).emit("message-recieved", message);
		});
	});
});

server.listen(5000, () => {
	console.log("listening at port: 5000");
});
