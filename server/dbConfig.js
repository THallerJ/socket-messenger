const Pool = require("pg").Pool;
require("dotenv").config();

const isProduction = process.env.IS_PRODUCTION == "true";

const poolConfig = isProduction
	? {
			connectionString: process.env.DATABASE_URL,
			ssl: {
				required: true,
				PromiseRejectionEvent: false,
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

module.exports.pool = pool;
