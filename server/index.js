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
							/* need to get all recipients of message 
						format output as :
						messageId msg.mes_id
						recipientList: recipients
						msg: 
							conversationid result.rows[0].conversation_id
							date msg
							sender msg
							text msg
						*/

							const conversationId = result.rows[0].conversation_id;

							const recipients = await pool.query(
								"SELECT recipient FROM conversations WHERE conversation_id=$1 AND message=$2",
								[conversationId, msg.mes_id]
							);

							// need to handle deleting sender from conversation table when conversation is gone
							// run select query to see if conversation_id appears only once in table, if it does then delete it
							console.log(recipients);

							//io.to(id).emit("message-recieved", {});
						});
				});
			}
		} catch (e) {
			console.log(e);
		}
	});

	socket.on("send-message", async ({ message, recipients }) => {
		const tempRecipients = [...recipients];
		recipients.push(id); // add sender's id to list of recipients

		const messageId = await saveMessage(message, id, recipients);

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

async function saveMessage(message, senderId, recipients) {
	var messageId;
	try {
		const result = await pool.query(
			`INSERT INTO messages(sender_id, date, text) VALUES($1, to_timestamp($2), $3) RETURNING mes_id`,
			[message.sender, message.date / 1000, message.text]
		);
		messageId = result.rows[0].mes_id;

		Promise.all(
			recipients.map(async (recipient) => {
				await pool.query(
					"INSERT INTO conversations(conversation_id, recipient, message) VALUES($1, $2, $3)",
					[
						message.conversationId,
						recipient,
						recipient === senderId ? null : messageId,
					]
				);
			})
		);
	} catch (e) {
		console.log(e);
	}

	return messageId;
}

async function deleteMessage(messageId, userId) {
	try {
		await pool.query(
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

server.listen(5000, () => {
	console.log("listening at port: 5000");
});
