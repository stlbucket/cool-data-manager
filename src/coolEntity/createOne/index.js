const Promise = require('bluebird');
const clog = require('fbkt-clog');

const buildInputFieldList  = require('../fields/buildInputList');
const buildOutputFieldList = require('../fields/buildOutputList');

class CreateOne{
  constructor(entityInfo, client, options){
    this.entityInfo = entityInfo;
    this.client = client;
    this.options = options || {};
  }

  _method(entity){
    return Promise.resolve(this.buildMutation(entity))
      .then(mutation => {
        // console.log('mutation', mutation);
        return this.client.mutate(`{${mutation}}`, this.options)
      })
      .then(result => {
        // console.log('result', result);
        return result[`create${this.entityInfo.entityName}`];
      })
      .catch(error => {
        clog.error(`Unable to create ${this.entityInfo.entityName}`, {
          [this.entityInfo.entityName]: entity,
          error: error,
        });
        throw error;
      })
  }

  buildMutation(entity){
    return Promise.props({
      input: buildInputFieldList(this.entityInfo.fields, entity),
      output: buildOutputFieldList(this.entityInfo.fields, this.options)
    })
      .then(fields => {
        return `
  create${this.entityInfo.entityName}(${fields.input}
  ) {
    id,
    createdAt,
    updatedAt,
    ${fields.output}
  },
`
      })
  }
}

module.exports = CreateOne;