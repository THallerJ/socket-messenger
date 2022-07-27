const { filterRecipients } = require("./utils");

module.exports = function (pool) {
	return {
		checkSavedMessages: async function checkSavedMessages(id) {
			try {
				msgResult = await pool.query(
					`SELECT conversation.cv_id, conversation.conversation_id, message.date, message.message_id, message.sender_id, message.text
				 	 FROM message_cache
				 	 INNER JOIN conversation ON conversation.cv_id=message_cache.conversation
				 	 INNER JOIN message ON message.message_id = message_cache.message_id
				 	 WHERE message_cache.user_id=$1`,
					[id]
				);

				const messageArray = [];

				if (msgResult.rows.length > 0) {
					await Promise.all(
						msgResult.rows.map(async (msg) => {
							const recResult = await pool.query(
								`SELECT user_id FROM conversation_recipient WHERE conversation=$1`,
								[msg.cv_id]
							);

							var recipients = [];
							recResult.rows.forEach((recipient) => {
								recipients.push(recipient.user_id);
							});

							const messageObj = {
								messageId: msg.message_id,
								recipients: filterRecipients(recipients, id),
								deleteConversation: true,
								message: {
									conversationId: msg.conversation_id,
									sender: msg.sender_id,
									date: msg.date,
									text: msg.text,
								},
							};

							messageArray.push(messageObj);
						})
					);
				}

				return messageArray;
			} catch (e) {
				console.log(e);
			}
		},

		saveMessage: async function saveMessage(message, recipients) {
			var messageId;
			try {
				const conversationResult = await pool.query(
					`WITH inserted AS (
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
		},

		deleteMessage: async function deleteMessage(
			messageId,
			userId,
			doDeleteConversation
		) {
			try {
				// delete from message_cache
				const conversation = await pool.query(
					"DELETE FROM message_cache WHERE message_id=$1 AND user_id=$2 RETURNING conversation",
					[messageId, userId]
				);

				// delete from conversation table and cascade the deletion to remaining tables
				if (
					conversation.rows[0] !== undefined &&
					doDeleteConversation === true
				) {
					await pool.query(
						`DELETE FROM conversation WHERE NOT EXISTS (SELECT 1 FROM message_cache WHERE conversation=$1)`,
						[conversation.rows[0].conversation]
					);
				}
			} catch (e) {
				console.log(e);
			}
		},
	};
};
