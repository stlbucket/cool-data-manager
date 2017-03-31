'use strict';
const clog   = require('fbkt-clog');
const uuid = require('uuid');
const expect = require('chai').expect;
const moment = require('moment');
const entityManager = require('./index');

describe(__filename, function () {

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
});
