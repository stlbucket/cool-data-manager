const CoolDataManager = require('../../src/coolDataManager');
const CoolRelation = require('../../src/coolRelation');
const CoolCollection = require('../../src/coolCollection');

const client = require('../client');

const OtherThing = require('../otherThing');
const YetAnotherThing = require('../yetAnotherThing');

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
    },
    yetAnotherThings: {
      type: new CoolCollection(YetAnotherThing)
    }
    // jsonData: {
    //   type: 'json'
    // }
  }
};

const entityManager = new CoolDataManager(entityInfo, client, { verbose: false });

module.exports = entityManager;