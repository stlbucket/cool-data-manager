const EntityManager = require('../../entityManager');
const client = require('../client');

const entityInfo = {
  entityName: 'Thing',
  entityNamePlural: 'Things',
  fields: {
    stringRequired: {
      type: 'string',
      required: true
    },
    stringData: {
      type: 'string'
    },
    intData: {
      type: 'int'
    },
    enumData: {
      type: 'enum',
      validValues: [ 'One', 'Two' ]
    },
    floatData: {
      type: 'float'
    },
    booleanData: {
      type: 'boolean'
    },
    dateTimeData: {
      type: 'dateTime'
    },
    // jsonData: {
    //   type: 'json'
    // }
  }
};

const entityManager = new EntityManager(entityInfo, client);

module.exports = entityManager;