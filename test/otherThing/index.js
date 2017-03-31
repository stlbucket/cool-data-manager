const CoolDataManager = require('../../coolDataManager');
const client = require('../client');

const entityInfo = {
  entityName: 'OtherThing',
  entityNamePlural: 'OtherThings',
  fields: {
    stringData: {
      type: 'string'
    },
  }
};

const entityManager = new CoolDataManager(entityInfo, client, { verbose: false });

module.exports = entityManager;