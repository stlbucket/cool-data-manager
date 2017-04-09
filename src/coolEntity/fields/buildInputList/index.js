const Promise = require('bluebird');
const validateRequiredFields = require('./validateRequiredFields');
const valueWrappers = require('./valueWrappers');
const CoolRelation = require('../../../coolRelation');
const CoolCollection = require('../../../coolCollection');

/**
 *
 * @param relation
 * @param relationEntity
 * @param fieldName
 * @param parentQuery
 */
function buildCoolRelationInputList(relation, relationEntity, fieldName, parentQuery){
  const subEntityInfo = relation.coolEntity.entityInfo;
  return buildInputList(subEntityInfo.fields, relationEntity)
    .then(subQuery => {
      return parentQuery.concat(`
    ${fieldName}: { ${subQuery}
    },
      `);
    })
}

/**
 *
 * @param collection
 * @param relationCollection
 * @param fieldName
 * @param parentQuery
 * @returns {Bluebird<U2|U1>|Bluebird<U>|Thenable<U>|Bluebird<U[]>}
 */
function buildCoolCollectionInputList(collection, relationCollection, fieldName, parentQuery){
  const subEntityInfo = collection.coolEntity.entityInfo;
  return Promise.mapSeries(
    relationCollection,
    subEntity => {
      return buildInputList(subEntityInfo.fields, subEntity)
        .then(subEntity => {
          return `{
          ${subEntity}
        }`
        })
    }
  )
    .then(subQuery => {
      return parentQuery.concat(`${fieldName}: [
        ${subQuery}
      ],
      `);
    });
}

/**
 *
 * @param type
 * @param entity
 * @param fieldName
 * @param parentQuery
 * @returns {Promise.<T>}
 */
function buildEntityInputList(type, entity, fieldName, parentQuery){
  const value = valueWrappers[type](entity[fieldName]);
  return Promise.resolve(parentQuery.concat(`
    ${fieldName}: ${value},`))
}


/**
 *
 * @param fields
 * @param entity
 * @returns {*}
 */
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
                return buildCoolRelationInputList(type, entity[fieldName], fieldName, acc);
              } else if (type instanceof CoolCollection) {
                return buildCoolCollectionInputList(type, entity[fieldName], fieldName, acc);
              } else {
                return buildEntityInputList(type, entity, fieldName, acc);
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