"use strict";
const clog = require('./index');

describe(__filename, function(){
	it("output null", function(done){
		clog("NULL", null);
		done();
	});
	
	it("output undefined", function(done){
		clog("UNDEFINED", undefined);
		done();
	});

	it("output json", function(done){
	  clog('TEST JSON', {
	    some: 'THING',
      complex: {
	      name: 'COMPLEX',
        data: [
          {
            id: 1,
            text: "TEXT DATA"
          }
        ]
      }
    });

    clog('TEST JSON', {
      some: 'THING 2',
      complex: {
        name: 'COMPLEX',
        data: [
          {
            id: 1,
            text: "TEXT DATA"
          }
        ]
      }
    });
    done();
  })


  it("output error", function (done) {
    clog.error('TEST JSON', {
      some: 'THING',
      complex: {
        name: 'COMPLEX',
        data: [
          {
            id: 1,
            text: "TEXT DATA"
          }
        ]
      }
    });

    clog.error('TEST JSON', {
      some: 'THING 2',
      complex: {
        name: 'COMPLEX',
        data: [
          {
            id: 1,
            text: "TEXT DATA"
          }
        ]
      }
    });
    done();
  })
});