const clog = require('fbkt-clog');
const fieldList = require('../fieldList');

class UpdateOrCreate {
  constructor(entityInfo, client) {
    this.entityInfo = entityInfo;
    this.client     = client;
  }

  _method(entity) {
    const mutation = `{${this.buildMutation(entity)}}`;

    return this.client.mutate(mutation)
      .then(result => {
        return Object.values(result)[0];
      })
      .catch(error => {
        clog.error(`Unable to updateOrCreate ${this.entityInfo.entityName}`, {
          [this.entityInfo.entityName]: entity,
          error: error
        });
      })
  }

  buildMutation(entity) {
    return `
    updateOrCreate${this.entityInfo.entityName} (
      update: {
        id: "${entity.id}",
        ${fieldList.in(this.entityInfo.fields, entity)}
      },
      create: {
        ${fieldList.in(this.entityInfo.fields, entity)}
      }
    ) {
        id,
        createdAt,
        updatedAt,
        ${fieldList.out(this.entityInfo.fields)}
    }
`
  }
}

module.exports = UpdateOrCreate;