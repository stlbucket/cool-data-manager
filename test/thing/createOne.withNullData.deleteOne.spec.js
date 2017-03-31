'use strict';
const clog   = require('fbkt-clog');
const uuid = require('uuid');
const expect = require('chai').expect;
const moment = require('moment');
const entityManager = require('./index');

describe(__filename, function () {
  it('should create one thing with all null data fields and delete it', function (done) {
    this.timeout(10000);
    const testId = uuid.v4();

    entityManager.createOne({
      stringRequired: testId
    }, {verbose: false})
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
});
