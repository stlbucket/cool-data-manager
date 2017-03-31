const ClientWrapper = require('./clientWrapper');
const CreateOne = require('./createOne');
const DeleteOne = require('./deleteOne');
const CreateBatch = require('./createBatch');
const DeleteBatch = require('./deleteBatch');
const GetAll = require('./getAll');
const UpdateOrCreate = require('./updateOrCreate');

class graphCoolEntityManager{
  constructor(entityInfo, client, options){
    this.entityInfo = entityInfo;
    this.client = new ClientWrapper(client, options);
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

}

module.exports = graphCoolEntityManager;