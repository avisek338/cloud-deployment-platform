const prisma = require('../config/prisma.config');
const {CrudRepository} = require('./crud.repository');
class DeploymentRepository extends CrudRepository {
    constructor() {
        super(prisma.deployement);
    }
    async findDeployments(whereClause){
      return await prisma.deployement.findMany({
        where: whereClause,
      }) 
    }
}
module.exports = {DeploymentRepository}