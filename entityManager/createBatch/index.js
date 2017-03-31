const clog = require('fbkt-clog');

class CreateBatch {
  constructor(entityInfo, client, createOne) {
    this.entityInfo = entityInfo;
    this.client     = client;
    this.createOne = createOne;
  }

  _method(entities) {
    const mutation = this.applyTemplate(entities);

    return this.client.mutate(mutation)
      .then(result => {
        return Object.values(result);
      })
      .catch(error => {
        clog.error(`Unable to create ${this.entityInfo.entityName} batch`, {
          [this.entityInfo.entityName]: entities,
          error: error
        });
        throw error;
      });
  }

  applyTemplate(things) {
    const mutationSet = things.reduce(
      (acc, thing, index) => {
        const thisMutation = `${this.entityInfo.entityName}_${index}: ${this.createOne(thing)},
        `;
        return acc.concat(thisMutation)
      },
      ''
    );

    return `{
    ${mutationSet}
    }
  `;
  }
}

module.exports = CreateBatch;