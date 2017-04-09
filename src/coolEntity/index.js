const CoolRelation = require('../coolRelation');

const ClientWrapper = require('./clientWrapper');
const CreateOne = require('./createOne');
const DeleteOne = require('./deleteOne');
const CreateBatch = require('./createBatch');
const DeleteBatch = require('./deleteBatch');
const GetAll = require('./getAll');
const UpdateOrCreate = require('./updateOrCreate');
const UpdateOrCreateBatch = require('./updateOrCreateBatch');

function processEntityInfo(entityInfo){
  const fields = Object.keys(entityInfo.fields).reduce(
    (acc, fieldName) => {

      if (entityInfo.fields[fieldName].type instanceof CoolRelation) {
        return Object.assign(acc, {
          [fieldName]: entityInfo.fields[fieldName],
          [`${fieldName}Id`]: {
            type: 'string',
            queryExclude: true
          }
        })
      } else {
        return Object.assign(acc, {
          [fieldName]: entityInfo.fields[fieldName]
        })
      }
    },
    {}
  );

  return {
    entityName: entityInfo.entityName,
    entityNamePlural: entityInfo.entityNamePlural,
    fields: fields
  };
}

class CoolEntity{
  constructor(entityInfo, options){
    this.entityInfo = processEntityInfo(entityInfo);
    this.client = new ClientWrapper(options);
  }

  createOne(entity, options){
    const createOne = new CreateOne(this.entityInfo, this.client, options);
    return createOne._method(entity);
  }

  deleteOne(entity, options) {
    const deleteOne = new DeleteOne(this.entityInfo, this.client, options);
    return deleteOne._method(entity);
  }

  createBatch(entities, options){
    const createOne = new CreateOne(this.entityInfo, this.client, options);
    const createBatch = new CreateBatch(this.entityInfo, this.client, createOne.buildMutation, options);
    return createBatch._method(entities);
  }

  deleteBatch(entities, options) {
    const deleteOne = new DeleteOne(this.entityInfo, this.client, options);
    const deleteBatch = new DeleteBatch(this.entityInfo, this.client, deleteOne.buildMutation, options);
    return deleteBatch._method(entities);
  }

  getAll(options) {
    const getAll = new GetAll(this.entityInfo, this.client, options);
    return getAll._method();
  }

  deleteAll(options) {
    return this.getAll(options)
      .then(allEntities => {
        return this.deleteBatch(allEntities, options);
      })
  }

  updateOrCreate(thing, options) {
    const updateOrCreate = new UpdateOrCreate(this.entityInfo, this.client, options);
    return updateOrCreate._method(thing);
  }

  updateOrCreateBatch(entities, options) {
    const updateOrCreate   = new UpdateOrCreate(this.entityInfo, this.client, options);
    const updateOrCreateBatch = new UpdateOrCreateBatch(this.entityInfo, this.client, updateOrCreate.buildMutation, options);
    return updateOrCreateBatch._method(entities);
  }

  executeQuery(query, queryName) {
    return this.client.query(query)
      .then(result => {
        return queryName ? result[queryName] : result;
      })
  }
}

module.exports = CoolEntity;