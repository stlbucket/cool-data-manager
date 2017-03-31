const Promise = require('bluebird');
const validateRequiredFields = require('./validateRequiredFields');
const valueWrappers = require('./valueWrappers');
const CoolRelation = require('../../../coolRelation');

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

              const field = fields[fieldName];
              const type  = field.type;

              if (type instanceof CoolRelation){
                const subEntityInfo = type.coolDataManager.entityInfo;
                return buildInputList(subEntityInfo.fields, entity[fieldName])
                  .then(subQuery => {
                    return acc.concat(`${fieldName}: {
                      ${subQuery}
                    }`);
                  })
              } else {
                const value = valueWrappers[type](entity[fieldName]);
                return Promise.resolve(acc.concat(`${fieldName}: ${value},
                `))
              }
            } else {
              return Promise.resolve(acc);
            }
          },
          ''
        )
      }
    })
}

module.exports = buildInputList;