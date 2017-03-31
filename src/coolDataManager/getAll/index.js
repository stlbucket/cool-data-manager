const Promise = require('bluebird');
const clog = require('fbkt-clog');
const buildOutputFieldList = require('../fields/buildOutputList');

class GetAll {
  constructor(entityInfo, client, options) {
    this.entityInfo = entityInfo;
    this.client     = client;
    this.options = options || {};
  }

  _method() {

    return this.buildQuery()
      .then(query => {
        return this.client.query(query, this.options)
      })
      .then(result => {
        return Object.values(result)[0];
      })
      .catch(error => {
        clog.error(`Unable to get all ${this.entityInfo.entityNamePlural}`);
        throw error;
      })
  }

  buildQuery() {
    return Promise.props({
      output: buildOutputFieldList(this.entityInfo.fields, this.options)
    })
      .then(fields => {
        return `{
    all${this.entityInfo.entityNamePlural} {
        id,
        createdAt,
        updatedAt,
        ${fields.output}
      },
    }
`
      })
  }
}

module.exports = GetAll;