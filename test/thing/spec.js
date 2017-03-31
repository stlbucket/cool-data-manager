'use strict';
const clog   = require('fbkt-clog');
const uuid = require('uuid');
const expect = require('chai').expect;
const moment = require('moment');
const entityManager = require('./index');

describe.only('cool thing', function () {

  it('should update or create a thing then delete it', function (done) {
    this.timeout(10000);
    const testId1       = uuid.v4();
    const testId2       = uuid.v4();

    entityManager.updateOrCreate(
      {
        stringRequired: testId1,
        stringData: testId1
      }
    )
      .then(thing => {
        // clog('UPDATE OR CREATE RESULT', thing);
        expect(thing).to.be.an('object');
        expect(thing.stringData).to.equal(testId1);

        const updateThing = {
          id: thing.id,
          stringRequired: testId2,
        };

        return entityManager.updateOrCreate(updateThing)
          .then(updatedThing => {
            // clog('UPDATED THING', updatedThing);
            expect(updatedThing).to.be.an('object');
            expect(updatedThing.stringRequired).to.equal(testId2);

            return entityManager.deleteOne(thing)
              .then(result => {
                expect(result).to.be.an('object');
                expect(result.id).to.equal(thing.id);
                // clog('DELETE ONE RESULT', result);
                done();
              })
          });
      })
      .catch(error => {
        done(error);
      })
  });


  it('should create a batch of things, get all, delete all', function (done) {
    this.timeout(10000);
    const testId1       = uuid.v4();
    const testId2       = uuid.v4();

    entityManager.createBatch([
      {
        stringRequired: testId1,
        stringData: testId1
      },
      {
        stringRequired: testId1,
        stringData: testId2
      }
    ])
      .then(things => {
        expect(things).to.be.an('array');
        expect(things.length).to.equal(2);

        const thing1 = things.find(thing => thing.stringData === testId1);
        expect(thing1).to.be.an('object');
        expect(thing1.stringData).to.equal(testId1);

        const thing2 = things.find(thing => thing.stringData === testId2);
        expect(thing2).to.be.an('object');
        expect(thing2.stringData).to.equal(testId2);

        return entityManager.getAll()
          .then(result => {
            // clog('GET ALL RESULT', result);
            expect(result).to.be.an('array');
            const thingDelete1 = result.find(thingDelete => thingDelete.id === thing1.id);
            expect(thingDelete1).to.be.an('object');
            const thingDelete2 = result.find(thingDelete => thingDelete.id === thing2.id);
            expect(thingDelete2).to.be.an('object');

            return entityManager.deleteAll()
              .then(result => {
                // clog('DELETE ONE RESULT', result);
                expect(result).to.be.an('array');
                const thingDelete1 = result.find(thingDelete => thingDelete.id === thing1.id);
                expect(thingDelete1).to.be.an('object');
                const thingDelete2 = result.find(thingDelete => thingDelete.id === thing2.id);
                expect(thingDelete2).to.be.an('object');
                done();
              })
          })

      })
      .catch(error => {
        done(error);
      })
  });

  it('should create a batch of things, delete batch', function (done) {
    this.timeout(10000);
    const testId1 = uuid.v4();
    const testId2 = uuid.v4();

    entityManager.createBatch([
      {
        stringRequired: testId1,
        stringData: testId1
      },
      {
        stringRequired: testId1,
        stringData: testId2
      }
    ])
      .then(things => {
        expect(things).to.be.an('array');
        expect(things.length).to.equal(2);

        const thing1 = things.find(thing => thing.stringData === testId1);
        expect(thing1).to.be.an('object');
        expect(thing1.stringData).to.equal(testId1);

        const thing2 = things.find(thing => thing.stringData === testId2);
        expect(thing2).to.be.an('object');
        expect(thing2.stringData).to.equal(testId2);

        // clog('CREATE BATCH RESULT', things);

        return entityManager.deleteBatch(things)
          .then(result => {
            expect(result).to.be.an('array');
            const thingDelete1 = result.find(thingDelete => thingDelete.id === thing1.id);
            expect(thingDelete1).to.be.an('object');
            const thingDelete2 = result.find(thingDelete => thingDelete.id === thing2.id);
            expect(thingDelete2).to.be.an('object');
            // clog('DELETE ONE RESULT', result);
            done();
          })
      })
      .catch(error => {
        done(error);
      })
  });

  it('should create one thing and delete it', function (done) {
    this.timeout(10000);
    const testId = uuid.v4();
    const testEntity = {
      stringRequired: testId,
      stringData: testId,
      intData: 1,
      enumData: 'One',
      floatData: 1.2345,
      booleanData: true,
      dateTimeData: moment.utc().format(),
      // jsonData: {
      //   id: 1,
      //   child: {
      //     id: 2
      //   }
      // }
    };

    entityManager.createOne(testEntity)
      .then(thing => {
        // clog('THING', thing);
        expect(thing).to.be.an('object');
        expect(thing.stringData).to.equal(testEntity.stringData);
        expect(thing.intData).to.equal(testEntity.intData);
        expect(thing.enumData).to.equal(testEntity.enumData);
        expect(thing.floatData).to.equal(testEntity.floatData);
        expect(thing.booleanData).to.equal(testEntity.booleanData);
        expect(moment.utc(thing.dateTimeData).format()).to.equal(testEntity.dateTimeData);
        // expect(thing.jsonData.id).to.equal(testEntity.jsonData.id);
        // expect(thing.jsonData.child.id).to.equal(testEntity.jsonData.child.id);
        // clog('CREATE ONE RESULT', thing);

        return entityManager.deleteOne(thing)
          .then(result => {
            expect(result).to.be.an('object');
            expect(result.id).to.equal(thing.id);
            // clog('DELETE ONE RESULT', result);
            done();
          })
      })
      .catch(error => {
        done(error);
      })
  });

  it.only('should create one thing with all null data fields and delete it', function (done) {
    this.timeout(10000);
    const testId = uuid.v4();

    entityManager.createOne({
      stringRequired: testId
    }, { verbose: true })
      .then(thing => {
        expect(thing).to.be.an('object');
        expect(thing.stringRequired).to.equal(testId);
        expect(thing.stringData).to.equal(null);
        expect(thing.intData).to.equal(null);
        // clog('CREATE ONE RESULT', thing);

        return entityManager.deleteOne(thing, {verbose: false})
          .then(result => {
            expect(result).to.be.an('object');
            expect(result.id).to.equal(thing.id);
            // clog('DELETE ONE RESULT', result);
            done();
          })
      })
      .catch(error => {
        done(error);
      })
  });

  it('should throw an error when missing required field', function (done) {
    this.timeout(10000);
    const testId = uuid.v4();

    entityManager.createOne({
      intData: 44
    })
      .then(thing => {
        done('EXPECTED ERROR BUT GOT RESULT')
      })
      .catch(error => {
        expect(error).to.be.an('error');
        done();
      })
  });

});
