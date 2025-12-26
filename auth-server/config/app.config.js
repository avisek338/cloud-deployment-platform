
const appConfig = {
    PORT: process.env.PORT || 9002,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI:process.env.REDIRECT_URI,
    TOKEN_URI:"https://oauth2.googleapis.com/token",
    GOOGLE_OAUTH_URI:"https://accounts.google.com/o/oauth2/v2/auth",
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_TTL: process.env.JWT_TTL || '2h',
}
module.exports = {appConfig};