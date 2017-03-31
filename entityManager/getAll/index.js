const clog = require('fbkt-clog');
const fieldList = require('../fieldList');

class GetAll {
  constructor(entityInfo, client) {
    this.entityInfo = entityInfo;
    this.client     = client;
  }

  _method() {
    const query = this.buildQuery();
    return this.client.query(query)
      .then(result => {
        return Object.values(result)[0];
      })
      .catch(error => {
        clog.error(`Unable to get all ${this.entityInfo.entityNamePlural}`);
        throw error;
      })
  }

  buildQuery() {
    return `{
    all${this.entityInfo.entityNamePlural} {
        id,
        createdAt,
        updatedAt,
        ${fieldList.out(this.entityInfo.fields)}
      },
    }`
  }
}

module.exports = GetAll;