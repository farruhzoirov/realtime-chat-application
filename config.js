require('dotenv').config({ path: './config.env' })

module.exports = {
  APP_PORT: process.env.APP_PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  SECRET_WORD: process.env.SECRET_WORD,
}
