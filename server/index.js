const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});

io.on("connection", (socket) => {
	const id = socket.handshake.query.userId;
	socket.join(id);

	socket.on("send-message", ({ recipients, message }) => {
		const tempRecipients = [...recipients];
		recipients.push(id); // add sender's id to list of recipients

		tempRecipients.forEach((recipient) => {
			// remove the recipient who is recieving the message from the recipient array
			const newRecipients = recipients.filter((sentTo) => sentTo !== recipient);
			const msg = { sender: id, message: message };

			io.to(recipient).emit("message-recieved", {
				recipients: newRecipients,
				message: msg,
			});
		});
	});
});

server.listen(5000, () => {
	console.log("listening at port: 5000");
});
