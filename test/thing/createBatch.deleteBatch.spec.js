'use strict';
const clog   = require('fbkt-clog');
const uuid = require('uuid');
const expect = require('chai').expect;
const moment = require('moment');
const entityManager = require('./index');

describe(__filename, function () {

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
});
