const Promise = require('bluebird');
const clog = require('fbkt-clog');

class DeleteBatch {
  constructor(entityInfo, client, deleteOne, options) {
    this.entityInfo = entityInfo;
    this.client     = client;
    this.deleteOne = deleteOne;
    this.options = options;
  }

  _method(entities) {
    if ((entities || []).length > 0){
      return this.applyTemplate(entities)
        .then(mutation => {
          return this.client.mutate(mutation, this.options)
        })
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
    } else {
      return Promise.resolve([]);
    }
  }

  applyTemplate(entities) {
    return Promise.reduce(
      entities,
      (acc, entity, index) => {
        return this.deleteOne(entity)
          .then(entityMutation => {
            const thisMutation = `${this.entityInfo.entityName}_${index}: ${entityMutation},
            `;
            return acc.concat(thisMutation)
          })
      },
      ''
    )
      .then(mutationSet => {
        return `{
        ${mutationSet}
        }
      `;
      });
  }
}

module.exports = DeleteBatch;