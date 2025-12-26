const prisma = require('../config/prisma.config');


class CrudRepository {
  constructor(model) {
    this.model = model; 
  }

  create(data) {
    return this.model.create({ data });
  }

  findById(id) {
    return this.model.findUnique({
      where: { id },
    });
  }

  findAll() {
    return this.model.findMany();
  }

  update(id, data) {
    return this.model.update({
      where: { id },
      data,
    });
  }

  delete(id) {
    return this.model.delete({
      where: { id },
    });
  }
}

module.exports = {CrudRepository};

