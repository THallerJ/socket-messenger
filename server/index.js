const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});
const { pool } = require("./dbConfig");
const { createTables } = require("./dbInit")(pool);
const dbController = require("./dbController")(pool);
const { filterRecipients } = require("./utils");
require("dotenv").config();

io.on("connection", async (socket) => {
	const id = socket.handshake.query.userId;
	socket.join(id);
	const cachedMessages = await dbController.checkSavedMessages(id);

	if (cachedMessages.length > 0) {
		io.to(id).emit("cached-messages-received", {
			messages: cachedMessages,
		});
	}

	socket.on("send-message", async ({ message, recipients }) => {
		recipients.push(id); // add sender's id to list of recipients
		recipients.sort();

		const messageId = await dbController.saveMessage(message, recipients);

		recipients.forEach((recipient) => {
			io.to(recipient).emit("message-received", {
				messageId: messageId, // used in the message-recieved callback
				recipients: filterRecipients(recipients, recipient),
				deleteConversation: false,
				message: message,
			});
		});
	});

	// notifies the server when client recieves a message
	socket.on(
		"message-received-callback",
		({ messageId, userId, doDeleteConversation }) => {
			dbController.deleteMessage(messageId, userId, doDeleteConversation);
		}
	);
});

server.listen(process.env.PORT || 5000, async () => {
	createTables();
});
