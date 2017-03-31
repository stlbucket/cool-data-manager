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

  createOne(entity){
    const createOne = new CreateOne(this.entityInfo, this.client);
    return createOne._method(entity);
  }

  deleteOne(entity) {
    const deleteOne = new DeleteOne(this.entityInfo, this.client);
    return deleteOne._method(entity);
  }

  createBatch(entities){
    const createOne = new CreateOne(this.entityInfo, this.client);
    const createBatch = new CreateBatch(this.entityInfo, this.client, createOne.buildMutation);
    return createBatch._method(entities);
  }

  deleteBatch(entities) {
    const deleteOne = new DeleteOne(this.entityInfo, this.client);
    const deleteBatch = new DeleteBatch(this.entityInfo, this.client, deleteOne.buildMutation);
    return deleteBatch._method(entities);
  }

  getAll() {
    const getAll = new GetAll(this.entityInfo, this.client);
    return getAll._method();
  }

  deleteAll() {
    return this.getAll()
      .then(allEntities => {
        return this.deleteBatch(allEntities);
      })
  }

  updateOrCreate(thing) {
    const updateOrCreate = new UpdateOrCreate(this.entityInfo, this.client);
    return updateOrCreate._method(thing);
  }

}

module.exports = graphCoolEntityManager;