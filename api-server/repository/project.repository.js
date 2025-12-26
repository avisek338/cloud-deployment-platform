const prisma = require('../config/prisma.config');
const {CrudRepository} = require('./crud.repository');

class ProjectRepository extends CrudRepository {
    constructor() {
        super(prisma.project);
    }
}
module.exports = { ProjectRepository };