const clog = require('fbkt-clog');

class DeleteBatch {
  constructor(entityInfo, client, deleteOne) {
    this.entityInfo = entityInfo;
    this.client     = client;
    this.deleteOne = deleteOne;
  }

  _method(entities) {
    const mutation = this.applyTemplate(entities);

    return this.client.mutate(mutation)
      .then(result => {
        return Object.values(result);
      })
      .catch(error => {
        clog.error(`Unable to delete ${this.entityInfo.entityName} batch`, {
          [this.entityInfo.entityName]: entities,
          error: error
        });
        throw error;
      });
  }

  applyTemplate(things) {
    const mutationSet = things.reduce(
      (acc, thing, index) => {
        const thisMutation = `${this.entityInfo.entityName}_${index}: ${this.deleteOne(thing)},`;
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

module.exports = DeleteBatch;