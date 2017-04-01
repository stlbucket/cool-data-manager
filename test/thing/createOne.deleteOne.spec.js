'use strict';
const clog   = require('fbkt-clog');
const uuid = require('uuid');
const expect = require('chai').expect;
const moment = require('moment');
const entityManager = require('./index');

describe(__filename, function () {
  it('should create one thing and delete it', function (done) {
    this.timeout(10000);
    const testId     = uuid.v4();
    const testEntity = {
      stringRequired: testId,
      stringData: testId,
      intData: 1,
      enumData: 'One',
      floatData: 1.2345,
      booleanData: true,
      dateTimeData: moment.utc().format(),
      otherThing: {
        stringData: 'OTHER THING DATA'
      },
      yetAnotherThings: [
        {
          stringData: 'YET MORE'
        },
        {
          stringData: 'Still Yet MOre evEN'
        }
      ]
      // jsonData: {
      //   id: 1,
      //   child: {
      //     id: 2
      //   }
      // }
    };

    entityManager.createOne(testEntity, {
      verbose: true
    })
      .then(thing => {
        clog('THING', thing);
        expect(thing).to.be.an('object');
        expect(thing.stringData).to.equal(testEntity.stringData);
        expect(thing.intData).to.equal(testEntity.intData);
        expect(thing.enumData).to.equal(testEntity.enumData);
        expect(thing.floatData).to.equal(testEntity.floatData);
        expect(thing.booleanData).to.equal(testEntity.booleanData);
        expect(moment.utc(thing.dateTimeData).format()).to.equal(testEntity.dateTimeData);
        expect(thing.otherThing).to.be.an('object');
        expect(thing.otherThing.stringData).to.equal(testEntity.otherThing.stringData);
        expect(thing.yetAnotherThings).to.be.an('array');
        expect(thing.yetAnotherThings.length).to.equal(testEntity.yetAnotherThings.length);
        expect(thing.yetAnotherThings[0]).to.be.an('object');
        expect(thing.yetAnotherThings[0].stringData).to.equal(testEntity.yetAnotherThings[0].stringData);
        expect(thing.yetAnotherThings[1].stringData).to.equal(testEntity.yetAnotherThings[1].stringData);
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
});
