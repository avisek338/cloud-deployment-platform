AppConfig = {
     ECS_ACCESS_KEY:`${process.env.ECS_ACCESS_KEY_ID}`,
     SECRET_ACCESS_KEY:`${process.env.ECS_SECERET_ACCESS_KEY}`,
     REDIS_URL:`${process.env.REDIS_URL}`,
}

module.exports = {AppConfig};