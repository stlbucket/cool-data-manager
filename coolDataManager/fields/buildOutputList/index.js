const Promise = require('bluebird');
const clog = require('fbkt-clog');
const CoolRelation = require('../../../coolRelation');

function buildOutputList(fields, options)
{
  const getFields = (options || {}).getFields || [];
  const fieldsArray = Object.keys(fields).filter(field => {
    return getFields.length > 0 ?
      getFields.indexOf(field) !== -1 :
      true;
  });

  return Promise.reduce(
    fieldsArray,
    (acc, fieldName) => {
      const field = fields[fieldName];
      if (field.type instanceof CoolRelation) {
        const subEntityInfo = field.type.coolDataManager.entityInfo;
        return buildOutputList(subEntityInfo.fields, options)
          .then(subQuery => {
            return acc.concat(`${fieldName} {
              ${subQuery}
            }`);
          })
      } else {
        return Promise.resolve(acc.concat(`   ${fieldName},
      `));
      }
    },
    ''
  );
}

module.exports = buildOutputList;