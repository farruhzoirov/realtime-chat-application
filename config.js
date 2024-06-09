require('dotenv').config({ path: './config.env' })

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  SECRET_WORD: process.env.SECRET_WORD,
}
