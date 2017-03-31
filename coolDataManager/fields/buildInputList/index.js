const Promise = require('bluebird');
const validateRequiredFields = require('./validateRequiredFields');
const valueWrappers = require('./valueWrappers');

function buildInputList(fields, entity) {
  return validateRequiredFields(fields, entity)
    .then((errors) => {

      if (Object.keys(errors).length > 0) {
        throw new Error(`INVALID GRAPH COOL INPUT: ${JSON.stringify(errors)}`)
      } else {
        return Promise.reduce(
          Object.keys(fields),
          (acc, fieldName) => {
            if (entity[fieldName] !== undefined) {
              const type  = fields[fieldName].type;
              const value = valueWrappers[type](entity[fieldName]);
              return acc.concat(`${fieldName}: ${value},
        `);
            } else {
              return acc;
            }
          },
          ''
        )
      }
    })
}

module.exports = buildInputList;