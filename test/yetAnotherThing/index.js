const CoolDataManager = require('../../src/coolDataManager');
const client = require('../client');

const entityInfo = {
  entityName: 'YetAnotherThing',
  entityNamePlural: 'YetAnotherThings',
  fields: {
    stringData: {
      type: 'string'
    },
  }
};

const entityManager = new CoolDataManager(entityInfo, client, { verbose: false });

module.exports = entityManager;