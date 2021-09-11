const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});
const Pool = require("pg").Pool;
require("dotenv").config();

const isProduction = process.env.IS_PRODUCTION == "true";

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

// create postgres tables if they don't exist
async function createTables() {
	await pool.query(
		"CREATE TABLE IF NOT EXISTS conversation(cv_id SERIAL PRIMARY KEY, conversation_id CHAR(36) UNIQUE)"
	);

	await pool.query(`CREATE TABLE IF NOT EXISTS message( 
						message_id SERIAL PRIMARY KEY, 
						sender_id CHAR(36), 
						date TIMESTAMPTZ, 
						text TEXT, 
						conversation INTEGER, 
						CONSTRAINT fk_mc FOREIGN KEY(conversation) REFERENCES conversation(cv_id) ON DELETE CASCADE)`);

	await pool.query(`CREATE TABLE IF NOT EXISTS conversation_recipient(
						cr_id SERIAL PRIMARY KEY,
						user_id CHAR(36),
						conversation INTEGER, 
						UNIQUE (user_id, conversation),
						CONSTRAINT fk_cr_conversation_id FOREIGN KEY(conversation) REFERENCES conversation(cv_id) ON DELETE CASCADE)`);

	await pool.query(`CREATE TABLE IF NOT EXISTS message_cache(
						mc_id SERIAL PRIMARY KEY, 
						user_id CHAR(36), 
						conversation INTEGER, 
						message_id INTEGER, 
						CONSTRAINT fk_cr_message_id FOREIGN KEY(message_id) REFERENCES message(message_id),
						CONSTRAINT fk_cr_conversation_id FOREIGN KEY(conversation) REFERENCES conversation(cv_id) ON DELETE CASCADE)`);
}

io.on("connection", async (socket) => {
	const id = socket.handshake.query.userId;
	socket.join(id);
	const cached = await checkSavedMessages(id);

	if (cached !== []) {
		try {
			cached.map(async (obj) => {
				const msgResult = await pool.query(
					`SELECT conversation.conversation_id, conversation_recipient.user_id, message.date, message.message_id, message.sender_id, message.text 
					 FROM conversation INNER JOIN conversation_recipient ON conversation.cv_id=conversation_recipient.conversation 
					 INNER JOIN message ON message.conversation=conversation.cv_id
					 WHERE conversation.cv_id=$1 AND conversation_recipient.user_id=$2`,
					[obj.conversation, obj.user_id]
				);

				const recResult = await pool.query(
					"SELECT user_id FROM conversation_recipient WHERE conversation=$1",
					[obj.conversation]
				);

				console.log("recResult", recResult);

				var recipients = [];
				recResult.rows.forEach((recipient) => {
					recipients.push(recipient.user_id);
				});

				msgResult.rows.forEach((msg) => {
					io.to(id).emit("message-recieved", {
						messageId: msg.message_id,
						recipients: filterRecipients(recipients, id),
						deleteConversation: true,
						message: {
							conversationId: msg.conversation_id,
							sender: msg.sender_id,
							date: msg.date,
							text: msg.text,
						},
					});
				});
			});
		} catch (e) {
			console.log(e);
		}
	}

	socket.on("send-message", async ({ message, recipients }) => {
		recipients.push(id); // add sender's id to list of recipients
		recipients.sort();

		const messageId = await saveMessage(message, recipients);

		recipients.forEach((recipient) => {
			io.to(recipient).emit("message-recieved", {
				messageId: messageId, // used in the message-recieved callback
				recipients: filterRecipients(recipients, recipient),
				deleteConversation: false,
				message: message,
			});
		});
	});

	// notifies the server when client recieves a message
	socket.on(
		"message-recieved-callback",
		({ messageId, userId, doDeleteConversation }) => {
			deleteMessage(messageId, userId, doDeleteConversation);
		}
	);
});

// check if a user has any messages saved in the database
async function checkSavedMessages(id) {
	try {
		const result = await pool.query(
			"SELECT * FROM message_cache WHERE user_id=$1",
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
		const conversationResult = await pool.query(
			`WITH inserted AS(
				INSERT INTO conversation(conversation_id) 
				VALUES($1) ON CONFLICT DO NOTHING RETURNING cv_id)
			 SELECT * FROM inserted
			 UNION
			 	SELECT cv_id FROM conversation WHERE conversation_id=$1`,
			[message.conversationId]
		);

		const conversation = conversationResult.rows[0].cv_id;

		const messageResult = await pool.query(
			`INSERT INTO message(
				sender_id, 
				date, 
				text, 
				conversation) 
				VALUES($1, to_timestamp($2), $3, $4) 
				RETURNING message_id`,
			[message.sender, message.date / 1000, message.text, conversation]
		);

		messageId = messageResult.rows[0].message_id;

		await Promise.all(
			recipients.map(async (recipient) => {
				await pool.query(
					`INSERT INTO conversation_recipient(user_id, conversation) 
					 VALUES($1, $2) ON CONFLICT DO NOTHING`,
					[recipient, conversation]
				);
			})
		);

		await Promise.all(
			recipients.map(async (recipient) => {
				await pool.query(
					"INSERT INTO message_cache(user_id, conversation, message_id) VALUES($1, $2, $3)",
					[recipient, conversation, messageId]
				);
			})
		);

		return messageId;
	} catch (e) {
		console.log(e);
	}
}

async function deleteMessage(messageId, userId, doDeleteConversation) {
	try {
		// delete from message_cache
		const conversation = await pool.query(
			"DELETE FROM message_cache WHERE message_id=$1 AND user_id=$2 RETURNING conversation",
			[messageId, userId]
		);

		// delete from conversation table and cascade the deletion to remaining tables
		if (conversation.rows[0] !== undefined && doDeleteConversation === true) {
			const fun = await pool.query(
				`DELETE FROM conversation WHERE NOT EXISTS (SELECT 1 FROM message_cache WHERE conversation=$1)`,
				[conversation.rows[0].conversation]
			);
		}
	} catch (e) {
		console.log(e);
	}
}

function filterRecipients(recipients, recipient) {
	return recipients.filter((sentTo) => sentTo !== recipient);
}

server.listen(process.env.PORT || 5000, async () => {
	createTables();
});
