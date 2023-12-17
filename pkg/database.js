const mysql = require('mysql');
const dotenv = require('dotenv')

dotenv.config()

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    database: process.env.DB
  });
  
  connection.connect((err) => {
    if (err) {
      console.error('ERROR GetDatabase db ping fatal error: ', err);
    } else {
      console.log('INFO GetDatabase database connectionn: established successfully');
    }
  });

module.exports = connection