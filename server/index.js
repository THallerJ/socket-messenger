const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});
const Pool = require("pg").Pool;
require("dotenv").config();

const isProduction = process.env.IS_PRODUCTION === "true";

const poolConfig = isProduction
	? {
			user: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			host: process.env.POSTGRES_HOST,
			port: process.env.POSTGRES_PORT,
			database: process.env.POSTGRES_DATABASE,
			ssl: {
				required: true,
				rejectUnauthorized: false,
			},
	  }
	: {
			user: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			host: process.env.POSTGRES_HOST,
			port: process.env.POSTGRES_PORT,
			database: process.env.POSTGRES_DATABASE,
	  };

const pool = new Pool(poolConfig);

io.on("connection", (socket) => {
	const id = socket.handshake.query.userId;
	socket.join(id);

	// check for new messages that were sent when user was offline
	checkSavedMessages(id).then((messages) => {
		try {
			if (messages != undefined) {
				messages.map((msg) => {
					pool
						.query(
							"SELECT conversation_id FROM conversations WHERE message=$1 AND recipient=$2",
							[msg.mes_id, id]
						)
						.then(async (result) => {
							const conversationId = result.rows[0].conversation_id;

							const recipients = await pool.query(
								"SELECT recipient FROM conversations WHERE conversation_id=$1 AND message=$2",
								[conversationId, msg.mes_id]
							);

							var recipientList = [];
							recipients.rows.forEach((recipient) => {
								recipientList.push(recipient.recipient);
							});

							io.to(id).emit("message-recieved", {
								messageId: msg.mes_id,
								recipients: filterRecipients(recipientList, id),
								message: {
									conversationId: conversationId,
									date: msg.date,
									sender: msg.sender_id,
									text: msg.text,
								},
							});
						});
				});
			}
		} catch (e) {
			console.log(e);
		}
	});

	socket.on("send-message", async ({ message, recipients }) => {
		recipients.push(id); // add sender's id to list of recipients

		const messageId = await saveMessage(message, recipients);

		recipients.forEach((recipient) => {
			io.to(recipient).emit("message-recieved", {
				messageId: messageId, // used in the message-recieved callback
				recipients: filterRecipients(recipients, recipient),
				message: message,
			});
		});
	});

	socket.on("message-recieved-callback", ({ messageId, userId }) => {
		deleteMessage(messageId, userId);
	});
});

async function checkSavedMessages(id) {
	try {
		const result = await pool.query(
			"SELECT mes_id, sender_id, date, text from messages, conversations WHERE message=mes_id AND recipient=$1",
			[id]
		);

		return result.rows;
	} catch (e) {
		console.log(e);
	}
}

async function saveMessage(message, recipients) {
	var messageId;
	try {
		const result = await pool.query(
			`INSERT INTO messages(sender_id, date, text) VALUES($1, to_timestamp($2), $3) RETURNING mes_id`,
			[message.sender, message.date / 1000, message.text]
		);

		messageId = result.rows[0].mes_id;

		await Promise.all(
			recipients.map(async (recipient) => {
				await pool.query(
					"INSERT INTO conversations(conversation_id, recipient, message) VALUES($1, $2, $3)",
					[message.conversationId, recipient, messageId]
				);
			})
		);

		return messageId;
	} catch (e) {
		console.log(e);
	}
}

async function deleteMessage(messageId, userId) {
	try {
		const result = await pool.query(
			"DELETE FROM conversations WHERE message=$1 AND recipient=$2",
			[messageId, userId]
		);

		await pool.query(
			"DELETE FROM messages WHERE mes_id=$1 AND NOT EXISTS (SELECT 1 FROM conversations WHERE message=$1)",
			[messageId]
		);
	} catch (e) {
		console.log(e);
	}
}

function filterRecipients(recipients, recipient) {
	return recipients.filter((sentTo) => sentTo !== recipient);
}

server.listen(process.env.PORT || 5000);
