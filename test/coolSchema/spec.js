'use strict';
const clog   = require('fbkt-clog');
const expect = require('chai').expect;

const coolSchema = require('../../src/coolSchema');

describe('cool schema', function () {

  it.only('should get the cool schema', function (done) {
    this.timeout(10000);

    const coolSchemaOptions = {
      types: {
        thing:  {

        }
      }
    };

    coolSchema({
      schemaFile: './test/coolSchema/schema.json',
      useEntities: [
        'Thing'
      ]
    })
      .then(result => {
        clog('result', result);
        done();
      });

  });


});
