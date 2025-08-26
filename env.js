require('dotenv').config();

module.exports = {
  OWNER_NUMBER: process.env.OWNER_NUMBER || "1234567890@s.whatsapp.net",
  SESSION_ID: process.env.SESSION_ID || "session.json",
  BOT_NAME: process.env.BOT_NAME || "OuzouBot"
};
