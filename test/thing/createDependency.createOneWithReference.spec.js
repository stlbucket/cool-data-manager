'use strict';
const clog   = require('fbkt-clog');
const uuid = require('uuid');
const expect = require('chai').expect;
const moment = require('moment');
const entityManager = require('./index');
const otherEntityManager = require('../otherThing');

describe(__filename, function () {
  it('should create otherThing then create thing related', function (done) {
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
    };

    const otherThing = {
      stringData: 'OTHER THING DATA'
    };

    otherEntityManager.createOne(otherThing)
      .then(otherThing => {
        clog('OTHER THING', otherThing);

        const thing = Object.assign(testEntity, {
          otherThingId: otherThing.id
        });

        entityManager.createOne(thing, {
          verbose: true
        })
          .then(thing => {
            clog('THING', thing);
            done();
          })
          .catch(error => {
            done(error);
          })
      });

  });
});
