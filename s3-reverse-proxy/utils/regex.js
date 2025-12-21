const domain = process.env.DOMAIN || 'localhost';
const hostnameRegex = new RegExp(
  `^([a-z0-9]([a-z0-9-]*[a-z0-9])?\\.)+${domain}$`
);

module.exports = { hostnameRegex };