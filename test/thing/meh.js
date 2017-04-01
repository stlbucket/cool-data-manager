const CoolDataManager = require('../../src/coolDataManager');
const CoolRelation    = require('../../src/coolRelation');
const CoolCollection  = require('../../src/coolCollection');

const blah = CoolDataManager;

console.log('CoolDataManager', typeof CoolDataManager);

console.log('blah', typeof blah);

const meh = new CoolDataManager();

console.log('meh', meh instanceof CoolDataManager);

console.log('blah blah', blah instanceof CoolDataManager);