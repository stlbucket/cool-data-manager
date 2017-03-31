const clog = require('fbkt-clog');
const fieldList = require('../fieldList');

class CreateOne{
  constructor(entityInfo, client){
    this.entityInfo = entityInfo;
    this.client = client;
  }

  _method(entity){
    const mutation = `{${this.buildMutation(entity)}}`;
    return this.client.mutate(mutation)
      .then(result => {
        return result[`create${this.entityInfo.entityName}`];
      })
      .catch(error => {
        clog.error(`Unable to create ${this.entityInfo.entityName}`, {
          [this.entityInfo.entityName]: entity,
          error: error,
        });
        console.log('FAILING MUTATION', mutation);
        throw error;
      })
  }

  buildMutation(entity){
    return `
      create${this.entityInfo.entityName}(
        ${fieldList.in(this.entityInfo.fields, entity)}
      ) {
        id,
        createdAt,
        updatedAt,
        ${fieldList.out(this.entityInfo.fields)}
      },
`
  }
}

module.exports = CreateOne;