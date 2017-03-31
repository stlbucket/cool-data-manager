const Promise = require('bluebird');
const clog      = require('fbkt-clog');

class DeleteOne {
  constructor(entityInfo, client) {
    this.entityInfo = entityInfo;
    this.client = client;
  }

  _method(entity) {
    return this.buildMutation(entity)
      .then(mutation => {
        return this.client.mutate(`{${mutation}}`)
      })
      .then(result => {
        return Object.values(result)[0];
      })
      .catch(error => {
        clog.error(`Unable to delete ${this.entityInfo.entityName}`, {
          [this.entityInfo.entityName]: entity,
          error: error
        });
        throw error;
      })
  }

  buildMutation(entity) {
    return Promise.resolve(`
      delete${this.entityInfo.entityName}(id: "${entity.id}") {
        id
      }
    `);
  }
}

module.exports = DeleteOne;