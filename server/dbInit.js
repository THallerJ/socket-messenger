require("dotenv").config();

module.exports = function (pool) {
	return {
		createTables: async function createTables() {
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
		},
	};
};
