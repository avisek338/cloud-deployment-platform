const prisma = require('../config/prisma.config');
const {CrudRepository} = require('./crud.repository');

class UserRepository extends CrudRepository {
    constructor(){
        super(prisma.user);
    }
    async getUserByEmail(email){
        return await this.model.findUnique({
            where: { email },
        });
    }
}

module.exports = {UserRepository};