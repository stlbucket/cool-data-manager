'use strict';
const clog   = require('fbkt-clog');
const uuid = require('uuid');
const expect = require('chai').expect;
const moment = require('moment');
const entityManager = require('./index');

describe(__filename, function () {

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
