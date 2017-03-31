const CoolDataManager = require('../../coolDataManager');
const CoolRelation = require('../../coolRelation');

const client = require('../client');

const OtherThing = require('../otherThing');

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
    otherThing: {
      type: new CoolRelation(OtherThing)
    }
    // jsonData: {
    //   type: 'json'
    // }
  }
};

const entityManager = new CoolDataManager(entityInfo, client, { verbose: false });

module.exports = entityManager;