const clog = require('fbkt-clog');
const Promise = require('bluebird');

function validateRequiredFields(fields, entity) {
  return Promise.reduce(
    Object.keys(fields),

    (acc, fieldName) => {
      if ((entity[fieldName] === undefined || entity[fieldName] === null) && fields[fieldName].required === true) {
        const error = `ENTITY ${JSON.stringify(entity)}`;
        return Object.assign(acc, {
          [fieldName]: error
        })
      } else {
        return acc;
      }
    },
    {}
  )
}


module.exports = validateRequiredFields