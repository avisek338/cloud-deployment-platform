const fs = require('fs');

const KeyConfig = {
    JWT_PRIVATE_KEY: fs.readFileSync('./keys/private.pem', 'utf8'),
    JWT_PUBLIC_KEY: fs.readFileSync('./keys/public.pem', 'utf8')
}
module.exports = { KeyConfig };