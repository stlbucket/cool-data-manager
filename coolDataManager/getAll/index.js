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
    const fields = this.options.getFields || this.entityInfo.fields;
    clog('this.entityInfo', this.entityInfo);
    clog('this.options', this.options);
    clog('fields', this.fields);

    return Promise.props({
      output: buildOutputFieldList(fields, this.options)
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