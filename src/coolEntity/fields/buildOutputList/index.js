const Promise = require('bluebird');
const clog = require('fbkt-clog');
const CoolRelation = require('../../../coolRelation');
const CoolCollection = require('../../../coolCollection');

/**
 *
 * @param fieldName
 * @param type
 * @param options
 * @param parentQuery
 */
function buildRelationOrCollectionOutputList(fieldName, type, options, parentQuery){
  const subEntityInfo = type.coolEntity.entityInfo;
  return buildOutputList(subEntityInfo.fields, options)
    .then(subQuery => {
      return parentQuery.concat(`${fieldName} {
              ${subQuery}
            },
            `);
    })
}

/**
 *
 * @param fields
 * @param options
 * @returns {Bluebird<string>|Bluebird<function(*=, *=)>}
 */
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
      if (field.type instanceof CoolRelation || field.type instanceof CoolCollection) {
        return buildRelationOrCollectionOutputList(fieldName, field.type, options, acc);
      } else if (field.queryExclude !== true) {
        return Promise.resolve(acc.concat(`   ${fieldName},
      `));
      } else {
        return Promise.resolve(acc);
      }
    },
    ''
  );
}

module.exports = buildOutputList;