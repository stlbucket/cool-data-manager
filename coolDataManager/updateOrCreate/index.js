const Promise = require('bluebird')
const clog = require('fbkt-clog');
const buildInputFieldList  = require('../fields/buildInputList');
const buildOutputFieldList = require('../fields/buildOutputList');

class UpdateOrCreate {
  constructor(entityInfo, client, options) {
    this.entityInfo = entityInfo;
    this.client     = client;
    this.options = options;
  }

  _method(entity) {
    return this.buildMutation(entity)
      .then(mutation => {
        return this.client.mutate(`{${mutation}}`, this.options)
      })
      .then(result => {
        return Object.values(result)[0];
      })
      .catch(error => {
        clog.error(`Unable to updateOrCreate ${this.entityInfo.entityName}`, {
          [this.entityInfo.entityName]: entity,
          error: error
        });
      });
  }

  buildMutation(entity) {
    return Promise.props({
      input: buildInputFieldList(this.entityInfo.fields, entity),
      output: buildOutputFieldList(this.entityInfo.fields, this.options)
    })
      .then(fields => {
        return `
    updateOrCreate${this.entityInfo.entityName} (
      update: {
        id: "${entity.id}",
        ${fields.input}
      },
      create: {
        ${fields.input}
      }
    ) {
        id,
        createdAt,
        updatedAt,
        ${fields.output}
    }
`
      });
  }
}

module.exports = UpdateOrCreate;