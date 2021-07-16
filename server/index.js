const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});
const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	host: process.env.POSTGRES_HOST,
	port: process.env.POSTGRES_PORT,
	database: process.env.POSTGRES_DATABASE,
});

io.on("connection", (socket) => {
	const id = socket.handshake.query.userId;
	socket.join(id);
	checkSavedMessages(id);

	socket.on("send-message", async ({ message, recipients }) => {
		const tempRecipients = [...recipients];
		recipients.push(id); // add sender's id to list of recipients

		const messageId = await saveMessage(message, tempRecipients);

		tempRecipients.forEach((recipient) => {
			// remove the recipient who is recieving the message from the recipient array
			const newRecipients = recipients.filter((sentTo) => sentTo !== recipient);

			io.to(recipient).emit("message-recieved", {
				messageId: messageId, // used in the message-recieved callback
				recipients: newRecipients,
				message: message,
			});
		});
	});

	socket.on("message-recieved-callback", ({ messageId, userId }) => {
		deleteMessage(messageId, userId);
	});
});

async function checkSavedMessages(id) {
	const result = await pool.query(
		"SELECT sender_id, date, text from messages, conversations WHERE message = mes_id AND recipient = $1",
		[id]
	);
	//console.log(result.rows);
}

async function saveMessage(message, recipients) {
	var messageId;
	try {
		const result = await pool.query(
			`INSERT INTO messages(sender_id, date, text) VALUES($1, to_timestamp($2), $3) RETURNING mes_id`,
			[message.sender, message.date / 1000, message.text]
		);
		messageId = result.rows[0].mes_id;
	} catch (e) {
		console.log(e);
	}

	Promise.all(
		recipients.map(async (recipient) => {
			try {
				await pool.query(
					"INSERT INTO conversations(conversation_id, recipient, message) VALUES($1, $2, $3)",
					[message.conversationId, recipient, messageId]
				);
			} catch (e) {
				console.log(e);
			}
		})
	);

	return messageId;
}

async function deleteMessage(messageId, userId) {
	await pool.query(
		"DELETE FROM conversations WHERE message = $1 AND recipient = $2",
		[messageId, userId]
	);
}

server.listen(5000, () => {
	console.log("listening at port: 5000");
});
